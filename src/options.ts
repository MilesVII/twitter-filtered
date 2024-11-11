import { save, load } from "./commons";
import type { Storage, WipeMode } from "./commons";

const modeRadio = Array.from(document.querySelectorAll<HTMLInputElement>(`input[name="mode"]`));
const bleachBox = document.querySelector<HTMLInputElement>("input#bleach")!;
const whitelistBox = document.querySelector("textarea")!;
const saveButton = document.querySelector("button")!;

main();

async function main(){
	whitelistBox.placeholder = "Whitelist users\nEach line is username as in URL"
	const [prefs, whitelist] = await Promise.all([load("prefs"), load("whitelist")]);

	bleachBox.checked = prefs.bleach;
	whitelistBox.value = whitelist.join("\n");

	if (prefs.mode === "onspot")
		modeRadio[0].checked = true;
	else
		modeRadio[1].checked = true;

	saveButton.addEventListener("click", () => {
		prefs.mode = modeRadio[0].checked ? "onspot" : "onrequest";
		prefs.bleach = bleachBox.checked;
		save("prefs", prefs);
		save("whitelist", parseWhitelist(whitelistBox.value));
	});
}

function parseWhitelist(raw: string): string[] {
	return raw
		.split("\n")
		.map(line => line.trim())
		.filter(line => line);
}