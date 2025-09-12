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
	return `#${f(0)}${f(8)}${f(4)}`;
}

const backlightColor = document.querySelectorAll<HTMLInputElement>('.color-slider');

backlightColor.forEach(col => {
	col.addEventListener('input', (e: Event) => {
		const hue = (document.getElementById('hue') as HTMLInputElement).value;
		const sat = (document.getElementById('saturation') as HTMLInputElement).value;
		const lig = (document.getElementById('lightness') as HTMLInputElement).value;
		const hexOutput = document.getElementById('hexvalue') as HTMLOutputElement;
		const hex = HSLToHex({ h: hue, s: sat, l: lig });
		hexOutput.innerText = hex;
	});
});
