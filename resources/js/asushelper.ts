// import { os } from "@neutralinojs/lib";

function HSLToHex(hsl: { h: number; s: number; l: number }): string {
	// https://www.jameslmilner.com/posts/converting-rgb-hex-hsl-colors/
	const { h, s, l } = hsl;

	const lDecimal = l / 100;
	const a = (s * Math.min(lDecimal, 1 - lDecimal)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = lDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

		// Convert to Hex and prefix with "0" if required
		return ('0' + Math.round(255 * color).toString(16)).slice(-2);
	};
	return `${f(0)}${f(8)}${f(4)}`;
}


var backlightColor = document.querySelectorAll<HTMLInputElement>('.hsl-slider');

function getSliderValue(id: string): number {
	return Number((document.getElementById(id) as HTMLInputElement).value);
}

async function changecolor(col: string) {
	try {
		// const result = await os.execCommand(`asusctl aura static -c ${hex}`);
		const result = await Neutralino.os.execCommand(`asusctl aura static -c ${col}`);
		console.log(col, "set as color");
	}
	catch (err) {
		console.error("Error executing commmand", err);
	}
}
backlightColor.forEach(col => {
	col.addEventListener('input', (e: Event) => {
		const hexOutput = document.getElementById('hexvalue') as HTMLOutputElement;
		const preview = document.getElementById('colorpreview') as HTMLOutputElement;
		const hue = getSliderValue("hue");
		const sat = getSliderValue("saturation");
		const lig = getSliderValue("lightness");
		const hex = HSLToHex({ h: hue, s: sat, l: lig });
		const output = "#" + hex;
		hexOutput.innerText = output;
		preview.style.background = output;
		changecolor(hex);

	});
});
