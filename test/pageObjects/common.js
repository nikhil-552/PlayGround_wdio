export default class Common {
	constructor() {
		this.$header = header => $(`//p[contains(text(),'${header}')]`);
		this.$buttons = buttons => $(`//a[contains(text(),'${buttons}')]`);
		this.$buttonTag = buttons => $(`//button[contains(text(),'${buttons}')]`);
		this.NavMenus = {shop: 'Shop', components: 'Components', contact: 'Contact'};
		this.$menuIcon = () => $('svg.w-5:has(path[stroke-linecap="round"])');
		this.$menuCategory = text => $(`li=${text}`);
		this.$searchBar = () => $('[placeholder="Search your products here"]');
		this.$searchResult = () => $('div.p-10 p.text-lg');
	}

	async openUrl(url) {
		await browser.url(url ?? 'https://webdriver.io/');
		await browser.maximizeWindow();
	}

	async closePopup() {
		await this.$buttonTag('Close').click();
		await expect(await this.$buttonTag('Close').waitForDisplayed({reverse: true})).toBeTrue();
	}

	/**
	 * Before Click it will do some important actions
	 * @param {WebdriverIO.Element} $element
	 */
	async combineClick($element) {
		await $element.waitForDisplayed();
		await $element.scrollIntoView();
		await $element.moveTo();
		await $element.waitForClickable();
		await $element.click();
	}
}
