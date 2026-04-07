"use strict";
console.log('connected');
const THEME_STORAGE_KEY = "asus-helper-theme";
const DEFAULT_AURA_SPEED = "med";
const DEFAULT_AURA_DIRECTION = "right";
const DEFAULT_BREATHE_SECONDARY = "000000";
const backlightColor = document.querySelectorAll('.hsl-slider');
const themeToggle = document.getElementById('theme-toggle');
const batteryCap = document.getElementById('bat-cap');
const batteryCapValue = document.getElementById('bat-cap-value');
const commandStatus = document.getElementById('command-status');
const auraMode = document.getElementById('aura-mode');
const brightness = document.getElementById('brightness');
const perf = document.getElementById('perf');
const colorControls = document.getElementById('color-controls');
const COLOR_SUPPORTED_AURA_MODES = new Set(["static", "breathe", "pulse"]);
function HSLToHex(hsl) {
    const { h, s, l } = hsl;
    const lDecimal = l / 100;
    const a = (s * Math.min(lDecimal, 1 - lDecimal)) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = lDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return ('0' + Math.round(255 * color).toString(16)).slice(-2);
    };
    return `${f(0)}${f(8)}${f(4)}`;
}
function getSliderValue(id) {
    return Number(document.getElementById(id).value);
}
function getCurrentHexColor() {
    const hue = getSliderValue("hue");
    const sat = getSliderValue("saturation");
    const lig = getSliderValue("lightness");
    return HSLToHex({ h: hue, s: sat, l: lig });
}
function setStatus(message, isError = false) {
    if (!commandStatus) {
        return;
    }
    commandStatus.innerText = message;
    commandStatus.dataset.state = isError ? "error" : "idle";
}
function applyTheme(theme) {
    document.body.dataset.theme = theme;
    if (themeToggle) {
        themeToggle.innerText = theme === "dark" ? "Light" : "Dark";
    }
}
function syncColorPreview() {
    const hexOutput = document.getElementById('hexvalue');
    const preview = document.getElementById('colorpreview');
    if (!hexOutput || !preview) {
        return;
    }
    const output = "#" + getCurrentHexColor();
    hexOutput.innerText = output;
    preview.style.background = output;
}
function auraModeSupportsColor(mode) {
    return COLOR_SUPPORTED_AURA_MODES.has(mode);
}
function setColorControlsEnabled(isEnabled) {
    if (colorControls) {
        colorControls.dataset.disabled = isEnabled ? "false" : "true";
    }
    backlightColor.forEach((slider) => {
        slider.disabled = !isEnabled;
    });
}
async function runCommand(command, successMessage) {
    setStatus(`Running: ${command}`);
    try {
        const result = await Neutralino.os.execCommand(command);
        const stderr = result.stdErr?.trim();
        if (stderr) {
            setStatus(stderr, true);
            return false;
        }
        setStatus(successMessage);
        return true;
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setStatus(message, true);
        return false;
    }
}
function buildAuraCommand(mode, colour) {
    switch (mode) {
        case "static":
            return `asusctl aura effect static -c ${colour}`;
        case "breathe":
            return `asusctl aura effect breathe --colour ${colour} --colour2 ${DEFAULT_BREATHE_SECONDARY} --speed ${DEFAULT_AURA_SPEED}`;
        case "rainbow-cycle":
            return `asusctl aura effect rainbow-cycle --speed ${DEFAULT_AURA_SPEED}`;
        case "rainbow-wave":
            return `asusctl aura effect rainbow-wave --direction ${DEFAULT_AURA_DIRECTION} --speed ${DEFAULT_AURA_SPEED}`;
        case "pulse":
            return `asusctl aura effect pulse -c ${colour}`;
        default:
            return `asusctl aura effect static -c ${colour}`;
    }
}
async function applyAuraEffect() {
    if (!auraMode) {
        return;
    }
    const colour = getCurrentHexColor();
    const mode = auraMode.value;
    const command = buildAuraCommand(mode, colour);
    await runCommand(command, `Aura mode set to ${mode}.`);
}
function normalizeBrightness(value) {
    return value.toLowerCase().replace("medium", "med");
}
function parseProfileValue(output) {
    const match = output.match(/Active profile:\s+([A-Za-z]+)/);
    return match ? match[1] : null;
}
function parseBrightnessValue(output) {
    const match = output.match(/Current keyboard led brightness:\s+([A-Za-z]+)/);
    if (!match) {
        return null;
    }
    return normalizeBrightness(match[1]);
}
function parseBatteryLimit(output) {
    const match = output.match(/Current battery charge limit:\s+(\d+)%/);
    return match ? match[1] : null;
}
async function initializeControls() {
    if (perf) {
        try {
            const result = await Neutralino.os.execCommand("asusctl profile get");
            const profileValue = parseProfileValue(result.stdOut ?? "");
            if (profileValue) {
                perf.value = profileValue;
            }
        }
        catch (err) {
            console.error("Failed to read profile", err);
        }
    }
    if (brightness) {
        try {
            const result = await Neutralino.os.execCommand("asusctl leds get");
            const brightnessValue = parseBrightnessValue(result.stdOut ?? "");
            if (brightnessValue) {
                brightness.value = brightnessValue;
            }
        }
        catch (err) {
            console.error("Failed to read brightness", err);
        }
    }
    if (batteryCap && batteryCapValue) {
        try {
            const result = await Neutralino.os.execCommand("asusctl battery info");
            const batteryLimit = parseBatteryLimit(result.stdOut ?? "");
            if (batteryLimit) {
                batteryCap.value = batteryLimit;
            }
        }
        catch (err) {
            console.error("Failed to read battery limit", err);
        }
        batteryCapValue.innerText = `${batteryCap.value}%`;
    }
    syncColorPreview();
}
backlightColor.forEach((slider) => {
    slider.addEventListener('input', () => {
        syncColorPreview();
        applyAuraEffect();
    });
});
if (perf) {
    perf.addEventListener('change', async (e) => {
        const profile = e.target.value;
        await runCommand(`asusctl profile set ${profile}`, `Profile set to ${profile}.`);
    });
}
if (brightness) {
    brightness.addEventListener('change', async (e) => {
        const level = normalizeBrightness(e.target.value);
        await runCommand(`asusctl leds set ${level}`, `Brightness set to ${level}.`);
    });
}
if (auraMode) {
    auraMode.addEventListener('change', async () => {
        setColorControlsEnabled(auraModeSupportsColor(auraMode.value));
        await applyAuraEffect();
    });
}
if (batteryCap && batteryCapValue) {
    const syncBatteryCap = () => {
        batteryCapValue.innerText = `${batteryCap.value}%`;
    };
    batteryCap.addEventListener('input', syncBatteryCap);
    batteryCap.addEventListener('change', async () => {
        await runCommand(`asusctl battery limit ${batteryCap.value}`, `Battery limit set to ${batteryCap.value}%.`);
    });
    syncBatteryCap();
}
if (themeToggle) {
    const preferredTheme = localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
    applyTheme(preferredTheme);
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
}
else {
    applyTheme("dark");
}
if (auraMode) {
    setColorControlsEnabled(auraModeSupportsColor(auraMode.value));
}
initializeControls();
