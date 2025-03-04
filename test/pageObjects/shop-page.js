import Common from './common.js';

class ShopPage extends Common {
	constructor() {
		super();
		this.$shopPageProductText = () => $('h1=Products');
		this.$selectBrand = brandName => $(`//li[contains(text(),'${brandName}')]//input`);
		this.$$productsName = () => $$('.font-titleFont > h2');
		this.$$searchResults = () => $$('.scrollbar-hide.cursor-pointer .font-semibold.text-lg');
		this.$productNameTitle = () => $('h2.font-semibold');
		this.$firstProduct = () => $('//img[contains(@class,"object-contain")]/..');
		this.$firstProductText = () => $('div.font-titleFont > h2.text-primeColor');
		this.products = {
			razer: 'Razer',
			samsung: 'Samsung',
		};
	}

	/**
	 * Click the first product and return the product name
	 * @returns {string}
	 */
	async clickProductAndReturnName() {
		const productFullName = await this.$firstProductText().getText();
		await this.combineClick(this.$firstProduct());
		return productFullName;
	}
}

export default new ShopPage();
