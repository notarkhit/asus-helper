"use strict";
console.log("connected");
const CHARGE_MODE_EXPLANATIONS = {
    balanced: "Balanced caps charging around 80% to reduce battery wear while keeping solid unplugged runtime.",
    "full capacity": "Full Capacity charges to 100% for maximum unplugged runtime.",
    fullcapacity: "Full Capacity charges to 100% for maximum unplugged runtime.",
    "maximum lifespan": "Maximum Lifespan caps charging around 60% to minimize long-term battery wear.",
    maximumlifespan: "Maximum Lifespan caps charging around 60% to minimize long-term battery wear.",
    "max lifespan": "Max Lifespan caps charging around 60% to minimize long-term battery wear.",
    maxlifespan: "Max Lifespan caps charging around 60% to minimize long-term battery wear.",
    standard: "Standard charges to 100% for normal day-to-day use."
};
const THEME_STORAGE_KEY = "asus-helper-theme";
const DEFAULT_AURA_SPEED = "med";
const DEFAULT_AURA_DIRECTION = "right";
const DEFAULT_BREATHE_SECONDARY = "#000000";
const COLOR_SUPPORTED_AURA_MODES = new Set([
    "static",
    "breathe",
    "stars",
    "highlight",
    "laser",
    "ripple",
    "pulse",
    "comet",
    "flash"
]);
const SECONDARY_COLOR_AURA_MODES = new Set(["breathe", "stars"]);
const SPEED_SUPPORTED_AURA_MODES = new Set([
    "breathe",
    "stars",
    "rainbow-cycle",
    "rainbow-wave",
    "rain",
    "highlight",
    "laser",
    "ripple"
]);
const DIRECTION_SUPPORTED_AURA_MODES = new Set(["rainbow-wave"]);
const backlightColor = document.querySelectorAll(".hsl-slider");
const themeToggle = document.getElementById("theme-toggle");
const refreshAllButton = document.getElementById("refresh-all");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const batteryCap = document.getElementById("bat-cap");
const batteryCapValue = document.getElementById("bat-cap-value");
const batteryOneShotButton = document.getElementById("battery-oneshot");
const commandStatus = document.getElementById("command-status");
const auraMode = document.getElementById("aura-mode");
const auraSpeed = document.getElementById("aura-speed");
const auraDirection = document.getElementById("aura-direction");
const brightness = document.getElementById("brightness");
const brightnessPrevButton = document.getElementById("brightness-prev");
const brightnessNextButton = document.getElementById("brightness-next");
const perf = document.getElementById("perf");
const profileNextButton = document.getElementById("profile-next");
const profileAc = document.getElementById("profile-ac");
const profileBattery = document.getElementById("profile-battery");
const colorControls = document.getElementById("color-controls");
const secondaryColorControls = document.getElementById("secondary-color-controls");
const secondaryColor = document.getElementById("secondary-color");
const secondaryHexOutput = document.getElementById("secondary-hexvalue");
const lastSync = document.getElementById("last-sync");
const deviceFamily = document.getElementById("device-family");
const deviceBoard = document.getElementById("device-board");
const asusctlVersion = document.getElementById("asusctl-version");
const featureCount = document.getElementById("feature-count");
const supportedPlatform = document.getElementById("supported-platform");
const supportedAura = document.getElementById("supported-aura");
const armouryEmpty = document.getElementById("armoury-empty");
const armouryControls = document.getElementById("armoury-controls");
function HSLToHex(hsl) {
    const { h, s, l } = hsl;
    const lDecimal = l / 100;
    const a = (s * Math.min(lDecimal, 1 - lDecimal)) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = lDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return (`0${Math.round(255 * color).toString(16)}`).slice(-2);
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
function getSecondaryColor() {
    var _a;
    return (_a = secondaryColor === null || secondaryColor === void 0 ? void 0 : secondaryColor.value.replace("#", "")) !== null && _a !== void 0 ? _a : DEFAULT_BREATHE_SECONDARY.replace("#", "");
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
function setActiveTab(tabName) {
    tabButtons.forEach((button) => {
        const isActive = button.dataset.tabTarget === tabName;
        button.dataset.tabActive = isActive ? "true" : "false";
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    tabPanels.forEach((panel) => {
        const isVisible = panel.dataset.tabPanel === tabName;
        panel.dataset.tabVisible = isVisible ? "true" : "false";
    });
}
function syncColorPreview() {
    const hexOutput = document.getElementById("hexvalue");
    const preview = document.getElementById("colorpreview");
    if (!hexOutput || !preview) {
        return;
    }
    const output = `#${getCurrentHexColor()}`;
    hexOutput.innerText = output;
    preview.style.background = output;
}
function syncSecondaryColorPreview() {
    if (!secondaryColor || !secondaryHexOutput) {
        return;
    }
    secondaryHexOutput.innerText = secondaryColor.value.toLowerCase();
}
function auraModeSupportsColor(mode) {
    return COLOR_SUPPORTED_AURA_MODES.has(mode);
}
function auraModeSupportsSecondaryColor(mode) {
    return SECONDARY_COLOR_AURA_MODES.has(mode);
}
function auraModeSupportsSpeed(mode) {
    return SPEED_SUPPORTED_AURA_MODES.has(mode);
}
function auraModeSupportsDirection(mode) {
    return DIRECTION_SUPPORTED_AURA_MODES.has(mode);
}
function setColorControlsEnabled(isEnabled) {
    if (colorControls) {
        colorControls.dataset.disabled = isEnabled ? "false" : "true";
    }
    backlightColor.forEach((slider) => {
        slider.disabled = !isEnabled;
    });
}
function setSelectEnabled(element, enabled) {
    if (!element) {
        return;
    }
    element.disabled = !enabled;
}
function setSecondaryColorEnabled(isEnabled) {
    if (!secondaryColorControls || !secondaryColor) {
        return;
    }
    secondaryColorControls.dataset.disabled = isEnabled ? "false" : "true";
    secondaryColor.disabled = !isEnabled;
}
function updateAuraControls() {
    if (!auraMode) {
        return;
    }
    const selectedMode = auraMode.value;
    setColorControlsEnabled(auraModeSupportsColor(selectedMode));
    setSecondaryColorEnabled(auraModeSupportsSecondaryColor(selectedMode));
    setSelectEnabled(auraSpeed, auraModeSupportsSpeed(selectedMode));
    setSelectEnabled(auraDirection, auraModeSupportsDirection(selectedMode));
}
async function execCommand(command) {
    return Neutralino.os.execCommand(command);
}
function escapeShellArg(value) {
    return `'${value.replace(/'/g, `'\\''`)}'`;
}
async function sendNotification(message, isError = false) {
    const urgency = isError ? "critical" : "normal";
    const icon = isError ? "dialog-error" : "dialog-information";
    const command = `notify-send -u ${urgency} -i ${icon} ${escapeShellArg("ASUS Helper")} ${escapeShellArg(message)}`;
    try {
        await execCommand(command);
    }
    catch (_a) {
    }
}
async function readCommand(command) {
    var _a, _b;
    const result = await execCommand(command);
    const stderr = (_a = result.stdErr) === null || _a === void 0 ? void 0 : _a.trim();
    if (stderr) {
        throw new Error(stderr);
    }
    return (_b = result.stdOut) !== null && _b !== void 0 ? _b : "";
}
async function runCommand(command, successMessage, refreshAfter = false, notificationMessage) {
    var _a;
    setStatus(`Running: ${command}`);
    try {
        const result = await execCommand(command);
        const stderr = (_a = result.stdErr) === null || _a === void 0 ? void 0 : _a.trim();
        if (result.exitCode !== 0 || stderr) {
            setStatus(stderr || "Operation failed", true);
            if (notificationMessage) {
                await sendNotification("[ERROR]: Operation failed", true);
            }
            return false;
        }
        setStatus(successMessage);
        if (notificationMessage) {
            await sendNotification(`[LOG] ${notificationMessage}`);
        }
        if (refreshAfter) {
            await refreshAllData(false);
        }
        return true;
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setStatus(message, true);
        if (notificationMessage) {
            await sendNotification("[ERROR]: Operation failed", true);
        }
        return false;
    }
}
function buildAuraCommand(mode, colour) {
    var _a, _b;
    const speed = (_a = auraSpeed === null || auraSpeed === void 0 ? void 0 : auraSpeed.value) !== null && _a !== void 0 ? _a : DEFAULT_AURA_SPEED;
    const direction = (_b = auraDirection === null || auraDirection === void 0 ? void 0 : auraDirection.value) !== null && _b !== void 0 ? _b : DEFAULT_AURA_DIRECTION;
    const secondary = getSecondaryColor();
    switch (mode) {
        case "static":
            return `asusctl aura effect static -c ${colour}`;
        case "breathe":
            return `asusctl aura effect breathe --colour ${colour} --colour2 ${secondary} --speed ${speed}`;
        case "stars":
            return `asusctl aura effect stars --colour ${colour} --colour2 ${secondary} --speed ${speed}`;
        case "rainbow-cycle":
            return `asusctl aura effect rainbow-cycle --speed ${speed}`;
        case "rainbow-wave":
            return `asusctl aura effect rainbow-wave --direction ${direction} --speed ${speed}`;
        case "rain":
            return `asusctl aura effect rain --speed ${speed}`;
        case "highlight":
            return `asusctl aura effect highlight -c ${colour} --speed ${speed}`;
        case "laser":
            return `asusctl aura effect laser -c ${colour} --speed ${speed}`;
        case "ripple":
            return `asusctl aura effect ripple -c ${colour} --speed ${speed}`;
        case "pulse":
            return `asusctl aura effect pulse -c ${colour}`;
        case "comet":
            return `asusctl aura effect comet -c ${colour}`;
        case "flash":
            return `asusctl aura effect flash -c ${colour}`;
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
function parseProfileList(output) {
    return output
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.includes("interfaces"));
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
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function parseBracketList(output, label) {
    const pattern = new RegExp(`${escapeRegExp(label)}:\\s*\\n\\[([\\s\\S]*?)\\]`);
    const match = output.match(pattern);
    if (!match) {
        return [];
    }
    return match[1]
        .split("\n")
        .map((line) => line.trim())
        .map((line) => line.replace(/,$/, ""))
        .map((line) => line.replace(/^"|"$/g, ""))
        .filter((line) => line.length > 0);
}
function parseSupportInfo(output) {
    const versionMatch = output.match(/Software version:\s+([^\n]+)/);
    const familyMatch = output.match(/Product family:\s+([^\n]+)/);
    const boardMatch = output.match(/Board name:\s+([^\n]+)/);
    return {
        version: versionMatch ? versionMatch[1].trim() : "Unknown",
        family: familyMatch ? familyMatch[1].trim() : "Unknown",
        board: boardMatch ? boardMatch[1].trim() : "Unknown",
        platformProperties: parseBracketList(output, "Supported Platform Properties"),
        auraModes: parseBracketList(output, "Supported Aura Modes")
    };
}
function parseArmouryList(output) {
    var _a;
    const lines = output.split("\n");
    const items = [];
    let currentName = null;
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.includes("interfaces")) {
            continue;
        }
        if (line.endsWith(":") && !line.startsWith("current:")) {
            currentName = line.slice(0, -1);
            continue;
        }
        if (currentName && line.startsWith("current:")) {
            const match = line.match(/current:\s+\[(.+)\]/);
            if (!match) {
                continue;
            }
            const options = match[1].split(",").map((value) => value.trim()).filter(Boolean);
            let current = (_a = options[0]) !== null && _a !== void 0 ? _a : "";
            const normalized = options.map((value) => {
                if (value.startsWith("(") && value.endsWith(")")) {
                    current = value.slice(1, -1);
                    return current;
                }
                return value;
            });
            items.push({
                name: currentName,
                current,
                options: normalized
            });
            currentName = null;
        }
    }
    return items;
}
function normalizeChargeModeLabel(value) {
    return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}
function getChargeModeTooltip(property) {
    const normalizedName = normalizeChargeModeLabel(property.name);
    if (!normalizedName.includes("charge")) {
        return null;
    }
    const describedOptions = property.options
        .map((option) => CHARGE_MODE_EXPLANATIONS[normalizeChargeModeLabel(option)])
        .filter((description) => Boolean(description));
    if (describedOptions.length > 0) {
        return describedOptions.join("\n");
    }
    return "Charge modes change the battery target. Lower limits reduce long-term wear, while higher limits maximize unplugged runtime.";
}
function populateSelectOptions(element, values, fallback) {
    if (!element || values.length === 0) {
        return;
    }
    const previousValue = element.value;
    element.innerHTML = "";
    values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.innerText = value;
        element.appendChild(option);
    });
    const targetValue = previousValue && values.includes(previousValue)
        ? previousValue
        : fallback && values.includes(fallback)
            ? fallback
            : values[0];
    element.value = targetValue;
}
function renderCapsules(container, items) {
    if (!container) {
        return;
    }
    container.innerHTML = "";
    const displayItems = items.length > 0 ? items : ["Unavailable"];
    displayItems.forEach((item) => {
        const capsule = document.createElement("span");
        capsule.className = "capsule";
        capsule.innerText = item;
        container.appendChild(capsule);
    });
}
async function renderArmouryControls(properties) {
    if (!armouryControls || !armouryEmpty) {
        return;
    }
    armouryControls.innerHTML = "";
    armouryEmpty.hidden = properties.length > 0;
    for (const property of properties) {
        const card = document.createElement("div");
        card.className = "armoury-card";
        const labelRow = document.createElement("div");
        labelRow.className = "armoury-label-row";
        const label = document.createElement("label");
        label.innerText = property.name;
        label.htmlFor = `armoury-${property.name}`;
        labelRow.appendChild(label);
        const chargeModeTooltip = getChargeModeTooltip(property);
        if (chargeModeTooltip) {
            const tooltip = document.createElement("button");
            tooltip.type = "button";
            tooltip.className = "armoury-tooltip";
            tooltip.innerText = "?";
            tooltip.title = chargeModeTooltip;
            tooltip.setAttribute("aria-label", `${property.name} explanation`);
            labelRow.appendChild(tooltip);
        }
        const value = document.createElement("strong");
        value.innerText = `Current: ${property.current}`;
        const select = document.createElement("select");
        select.id = `armoury-${property.name}`;
        property.options.forEach((optionValue) => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.innerText = optionValue;
            select.appendChild(option);
        });
        select.value = property.current;
        select.addEventListener("change", async () => {
            const changed = await runCommand(`asusctl armoury set ${property.name} ${select.value}`, `${property.name} set to ${select.value}.`, true, `Changed ${property.name} to ${select.value}`);
            if (!changed) {
                select.value = property.current;
            }
        });
        const helper = document.createElement("p");
        helper.innerText = `Available values: ${property.options.join(", ")}`;
        card.append(labelRow, value, select, helper);
        armouryControls.appendChild(card);
    }
}
function updateSyncTime() {
    if (!lastSync) {
        return;
    }
    lastSync.innerText = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}
async function refreshAllData(showStatus = true) {
    if (showStatus) {
        setStatus("Refreshing live ASUS data...");
    }
    try {
        const [infoOutput, profileListOutput, profileOutput, brightnessOutput, batteryOutput, armouryOutput] = await Promise.all([
            readCommand("asusctl info --show-supported"),
            readCommand("asusctl profile list"),
            readCommand("asusctl profile get"),
            readCommand("asusctl leds get"),
            readCommand("asusctl battery info"),
            readCommand("asusctl armoury list")
        ]);
        const supportInfo = parseSupportInfo(infoOutput);
        const profiles = parseProfileList(profileListOutput);
        const activeProfile = parseProfileValue(profileOutput);
        const brightnessValue = parseBrightnessValue(brightnessOutput);
        const batteryLimit = parseBatteryLimit(batteryOutput);
        const armouryProperties = parseArmouryList(armouryOutput);
        if (deviceFamily) {
            deviceFamily.innerText = supportInfo.family;
        }
        if (deviceBoard) {
            deviceBoard.innerText = supportInfo.board;
        }
        if (asusctlVersion) {
            asusctlVersion.innerText = supportInfo.version;
        }
        if (featureCount) {
            const count = supportInfo.platformProperties.length + supportInfo.auraModes.length + armouryProperties.length;
            featureCount.innerText = `${count} detected`;
        }
        renderCapsules(supportedPlatform, supportInfo.platformProperties);
        renderCapsules(supportedAura, supportInfo.auraModes);
        populateSelectOptions(perf, profiles, activeProfile);
        populateSelectOptions(profileAc, profiles, activeProfile);
        populateSelectOptions(profileBattery, profiles, "Quiet");
        if (perf && activeProfile) {
            perf.value = activeProfile;
        }
        if (brightness && brightnessValue) {
            brightness.value = brightnessValue;
        }
        if (batteryCap && batteryCapValue && batteryLimit) {
            batteryCap.value = batteryLimit;
            batteryCapValue.innerText = `${batteryLimit}%`;
        }
        await renderArmouryControls(armouryProperties);
        updateSyncTime();
        if (showStatus) {
            setStatus("Refreshed live ASUS data.");
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setStatus(message, true);
    }
}
backlightColor.forEach((slider) => {
    slider.addEventListener("input", () => {
        syncColorPreview();
        void applyAuraEffect();
    });
});
if (secondaryColor) {
    secondaryColor.addEventListener("input", () => {
        syncSecondaryColorPreview();
        void applyAuraEffect();
    });
}
if (perf) {
    perf.addEventListener("change", async (e) => {
        const profile = e.target.value;
        await runCommand(`asusctl profile set ${profile}`, `Profile set to ${profile}.`, true, `Changed active profile to ${profile}`);
    });
}
if (profileAc) {
    profileAc.addEventListener("change", async (e) => {
        const profile = e.target.value;
        await runCommand(`asusctl profile set -a ${profile}`, `AC profile set to ${profile}.`, false, `Changed Default profile on AC to ${profile}`);
    });
}
if (profileBattery) {
    profileBattery.addEventListener("change", async (e) => {
        const profile = e.target.value;
        await runCommand(`asusctl profile set -b ${profile}`, `Battery profile set to ${profile}.`, false, `Changed Default profile on Battery to ${profile}`);
    });
}
if (profileNextButton) {
    profileNextButton.addEventListener("click", async () => {
        await runCommand("asusctl profile next", "Switched to next profile.", true, "Changed active profile");
    });
}
if (brightness) {
    brightness.addEventListener("change", async (e) => {
        const level = normalizeBrightness(e.target.value);
        await runCommand(`asusctl leds set ${level}`, `Brightness set to ${level}.`, true, `Changed keyboard brightness to ${level}`);
    });
}
if (brightnessPrevButton) {
    brightnessPrevButton.addEventListener("click", async () => {
        await runCommand("asusctl leds prev", "Keyboard brightness lowered.", true, "Changed keyboard brightness");
    });
}
if (brightnessNextButton) {
    brightnessNextButton.addEventListener("click", async () => {
        await runCommand("asusctl leds next", "Keyboard brightness raised.", true, "Changed keyboard brightness");
    });
}
if (auraMode) {
    auraMode.addEventListener("change", async () => {
        updateAuraControls();
        await applyAuraEffect();
    });
}
if (auraSpeed) {
    auraSpeed.addEventListener("change", () => {
        void applyAuraEffect();
    });
}
if (auraDirection) {
    auraDirection.addEventListener("change", () => {
        void applyAuraEffect();
    });
}
if (batteryCap && batteryCapValue) {
    const syncBatteryCap = () => {
        batteryCapValue.innerText = `${batteryCap.value}%`;
    };
    batteryCap.addEventListener("input", syncBatteryCap);
    batteryCap.addEventListener("change", async () => {
        await runCommand(`asusctl battery limit ${batteryCap.value}`, `Battery limit set to ${batteryCap.value}%.`, false, `Changed battery charge limit to ${batteryCap.value}%`);
    });
    syncBatteryCap();
}
if (batteryOneShotButton) {
    batteryOneShotButton.addEventListener("click", async () => {
        await runCommand("asusctl battery oneshot 100", "One-shot charge target set to 100%.", false, "Enabled one-shot charge target to 100%");
    });
}
if (refreshAllButton) {
    refreshAllButton.addEventListener("click", () => {
        void refreshAllData(true);
    });
}
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const target = button.dataset.tabTarget;
        if (target) {
            setActiveTab(target);
        }
    });
});
if (themeToggle) {
    const preferredTheme = localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
    applyTheme(preferredTheme);
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
}
else {
    applyTheme("dark");
}
syncColorPreview();
syncSecondaryColorPreview();
updateAuraControls();
setActiveTab("system");
void refreshAllData(true);
