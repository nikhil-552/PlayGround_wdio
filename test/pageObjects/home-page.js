import Common from './common.js';

class HomePage extends Common {
	constructor() {
		super();
		this.$homepageProfileIcon = () => $('p=Profile');
		this.$homePageSubtitle = () => $('h1.font-titleFont.font-bold');
		this.$newArrivalProduct = () => $("//div[contains(text(),'New Arrivals')]/..//div[@class='slick-slide slick-active slick-current']//img[contains(@class,'object-contain')]/..");
		this.$newArrivalProductText = () => $("//div[contains(text(),'New Arrivals')]/..//div[@class='slick-slide slick-active slick-current']//h2[contains(@class,'text-primeColor font-bold')]");
	}

	/**
	 * Select Shop Category type
	 * @param {string} category
	 */
	async selectShopCategory(category) {
		await this.$menuIcon().click();
		await this.$menuCategory(category).click();
	}

	/**
	 * Search the product, click the first result, and return to the product name.
	 * @param {string} product
	 * @returns {string}
	 */
	async searchProductAndClick(product) {
		await this.$searchBar().setValue(product);
		await expect(await this.$searchResult()).toHaveText(expect.stringContaining(product));
		const productFullName = await this.$searchResult().getText();
		await this.$searchResult().click();
		return productFullName;
	}

	/**
	 * Search the product, click the first result, and return to the product name.
	 * @returns {string}
	 */
	async clickNewArrivalProductAndReturnName() {
		const productFullName = await this.$newArrivalProductText().getText();
		await this.combineClick(await this.$newArrivalProduct());
		return productFullName;
	}
}

export default new HomePage();
