
import { save, load } from "./commons";
import { buildElement } from "./domkraft";
// @ts-ignore
import blueCross from "./bco.svg.txt";

const tagMarker = "data-xvii-checks-remover";
const blueCrossPollingIntervalMS = 2000;

observeUrlChange(() => {
	if (document.querySelector(`script[${tagMarker}]`)) return;
	main();
});

function observeUrlChange(cb: () => void) {
	let oldHref = document.location.href;
	cb();
	const observer = new MutationObserver(() => {
		if (oldHref !== document.location.href) {
			oldHref = document.location.href;
			cb();
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
};

const whitelistSelector = (usernames: string[]) => usernames.map(username => `:not(:has(*[href="/${username}"]))`).join("");
const allArticlesSelector = `article:has(*[data-testid="icon-verified"])`;

async function main() {
	const prefs = await load("prefs");
	const whitelist = await load("whitelist");

	const whitelistSuffix = whitelistSelector(whitelist);

	if (prefs.bleach) bleach(whitelistSuffix);
	if (prefs.mode === "onspot")
		nuke(whitelistSuffix);
	else {
		setInterval(() => {
			const bcIconSelector = `svg[data-testid="icon-verified"]:not([data-xmvii-cross])`;
			document
				.querySelectorAll<SVGElement>(bcIconSelector)
				.forEach(icon =>
					transformBlueCheckIntoCross(icon, () => {
						nuke(whitelistSuffix);
					})
				);
		}, blueCrossPollingIntervalMS);
	}
}

async function bleach(whitelistSuffix: string) {
	const opacityRule = (selector: string) => `${selector} {opacity: .2}`;
	
	const cssStyles = buildElement({
		elementName: "style",
		textContent: opacityRule(allArticlesSelector + whitelistSuffix),
		attributes: {
			[tagMarker]: "yes that's me"
		}
	});
	document.head.append(cssStyles);
}

async function nuke(whitelistSuffix: string) {
	const hidingRule = (selector: string) => `${selector} {display: none}`;

	const cssStyles = buildElement({
		elementName: "style",
		textContent: hidingRule(allArticlesSelector + whitelistSuffix),
		attributes: {
			[tagMarker]: "yes that's me"
		}
	});
	document.head.append(cssStyles);
}

function transformBlueCheckIntoCross(target: SVGElement, onclick: () => void) {
	target.setAttribute("data-xmvii-cross", "true");
	const blueCrossIcon = target.cloneNode(true) as Element;
	blueCrossIcon.innerHTML = blueCross;

	target.style.display = "none";

	blueCrossIcon.addEventListener("click", (event) => {
		event.preventDefault();
		onclick();
		return false;
	});
	
	const link = target.closest("a");
	if (link) {
		link.parentElement!.style.display = "flex";
		link.parentElement!.style.flexFlow = "row nowrap";
		link.insertAdjacentElement("afterend", blueCrossIcon);
	}
}