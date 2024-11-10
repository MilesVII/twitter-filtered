
// import { save, load } from "./commons";
import { buildElement } from "./domkraft";

const tagMarker = "data-xvii-checks-remover";

observeUrlChange(() => {
	if (document.querySelector(`script[${tagMarker}]`)) return;

	wipeBlueCheckReplies();
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

const allArticlesSelector = `article:has(*[data-testid="icon-verified"])`;
const hidingRule = (selector: string) => `${selector} {display: none}`;

function wipeBlueCheckReplies() {
	const cssStyles = buildElement({
		elementName: "style",
		textContent: hidingRule(allArticlesSelector),
		attributes: {
			[tagMarker]: "yes that's me"
		}
	});
	document.head.append(cssStyles);
}