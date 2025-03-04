import ComponentsPage from '../pageObjects/components-page.js';
import HomePage from '../pageObjects/home-page.js';
import LoginPage from '../pageObjects/loginPage.js';
import ShopPage from '../pageObjects/shop-page.js';
import ContactPage from '../pageObjects/contact-page.js';
import data from '../test-data/navigationButtons.json' with { type: 'json' };
const shopCategory = 'Mobiles';
const product = 'Laptop';

describe('TC001 - Verify user is able to filter product by brand', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`Navigate to ${HomePage.NavMenus.shop} page using menu option`, async () => {
		await HomePage.$buttons(HomePage.NavMenus.shop).click();

		await expect(await ShopPage.$shopPageProductText().waitForDisplayed()).toBeTrue();
	});

	it('Refine the listing of product by filteting the brands by slecting the desired brand name checkbox (e.g. Mircrosoft) shown on the left side of the page', async () => {
		await ShopPage.$selectBrand(ShopPage.products.razer).click();
		await ShopPage.$$productsName().forEach(async elm => await expect(await elm).toHaveText(expect.stringContaining(ShopPage.products.razer)));
	});
});

describe('TC002 - Verify pop up window is displayed', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`Navigate to '${HomePage.NavMenus.components}' page using menu option`, async () => {
		await HomePage.$buttons(HomePage.NavMenus.components).click();

		await expect(await ComponentsPage.$exploreComponents().waitForDisplayed()).toBeTrue();
	});

	it(`Click in the 'Learn more' link on the '${ComponentsPage.components.popWindowComponent}' tile`, async () => {
		await ComponentsPage.$learnMoreBtn(ComponentsPage.components.popWindowComponent).click();

		await expect(await ComponentsPage.$buttonTag('Open Pop Window').waitForDisplayed()).toBeTrue();
	});

	it("Click on the 'Open Pop Window' button and verify the pop up window is opened", async () => {
		await ComponentsPage.$buttonTag('Open Pop Window').click();

		await expect(await ComponentsPage.$popHeading().getText()).toEqual(ComponentsPage.popupHeading);
		await expect(await ComponentsPage.$popContent().getText()).toEqual(ComponentsPage.popupContent);
	});

	it('Click on the and Close button and ensure the pop window is closed', async () => {
		await ComponentsPage.closePopup();

		await expect(await ComponentsPage.$buttonTag('Open Pop Window').waitForDisplayed()).toBeTrue();
	});
});

describe('Verify that the user can post a query on the contact page', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`Navigate to '${HomePage.NavMenus.contact}' page using menu option`, async () => {
		await HomePage.$buttons(HomePage.NavMenus.contact).click();

		await expect(await ContactPage.$fillUpFromText().waitForDisplayed()).toBeTrue();
	});

	Object.entries(data.contactDetails).forEach(([field, value], i) => {
		it(`Fill up a ${field} field with required details`, async () => {
			await ContactPage.$$inputFields()[i].setValue(value);

			await expect(await ContactPage.$$inputFields()[i].getValue()).toEqual(value);
		});
	});

	it('Click on the post button and ensure that we are getting success message', async () => {
		await ContactPage.$buttonTag('Post').click();

		await expect(await ContactPage.$receivedSuccessMsg().getText()).toEqual(ContactPage.receivedSuccessMessageContext(data.contactDetails.Name, data.contactDetails.Email));
	});
});

describe('Enter a valid product name and ensure relevant results are displayed', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`Navigate to ${HomePage.NavMenus.shop} page using menu option`, async () => {
		await HomePage.$buttons(HomePage.NavMenus.shop).click();

		await expect(await ShopPage.$shopPageProductText().waitForDisplayed()).toBeTrue();
	});

	it('Enter a value in the search bar and validate that the results show only the products you searched for (e.g. Samsung)', async () => {
		await ShopPage.$searchBar().setValue(ShopPage.products.samsung);
		await ShopPage.$$searchResults().forEach(async elm => await expect(await elm).toHaveText(expect.stringContaining(ShopPage.products.samsung)));
	});
});

describe('Verify able to access the shadow dom', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`Navigate to '${HomePage.NavMenus.components}' page using menu option`, async () => {
		await HomePage.$buttons(HomePage.NavMenus.components).click();

		await expect(await ComponentsPage.$exploreComponents().waitForDisplayed()).toBeTrue();
	});

	it(`Click in the 'Learn more' link on the '${ComponentsPage.components.shadowDOMComponent}' tile`, async () => {
		await ComponentsPage.$learnMoreBtn(ComponentsPage.components.shadowDOMComponent).click();

		await expect(await ComponentsPage.$openShadowDOM().waitForDisplayed()).toBeTrue();
	});

	ComponentsPage.openShadowTitleAndText.forEach(async (value, i) => {
		it(`Access the shadow dom element and validate the text "${value}"`, async () => {
			await expect(await ComponentsPage.$$openShadowDOMTexts()[i]).toHaveText(value);
		});
	});
});

describe('TC003 - Verify user is able to shop by category', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`Click on "Shop by Category" menu and select a category(eg:select ${shopCategory})`, async () => {
		await HomePage.selectShopCategory(shopCategory);

		await expect(await HomePage.$homePageSubtitle()).toHaveText(shopCategory);
	});
});

describe('TC004 - Verify if the user is able to search the product using the search bar', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon().waitForDisplayed()).toBeTrue();
	});

	it(`In the home page,search for a product in the search bar(eg: search for ${product})`, async () => {
		const productFullName = await HomePage.searchProductAndClick(product);

		await expect(browser).toHaveUrl(expect.stringContaining(productFullName.replace(/\s/g, '').toLocaleLowerCase()));
		await expect(await ShopPage.$productNameTitle()).toHaveText(productFullName);
	});
});

describe('TC005 - Verify if the user is able to click on Shop now option', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon()).toBeDisplayed();
		await HomePage.selectShopCategory(shopCategory);

		await expect(await HomePage.$homePageSubtitle()).toHaveText(shopCategory);
	});

	it(`In home page, click any product(select ${shopCategory})`, async () => {
		const productFullName = await ShopPage.clickProductAndReturnName();

		await expect(browser).toHaveUrl(expect.stringContaining(productFullName.replace(/\s/g, '').toLocaleLowerCase()));
		await expect(await ShopPage.$productNameTitle()).toHaveText(productFullName);
	});
});

describe('TC006 - Verify if the user is able to click on a product to buy', () => {
	it(`Login to ${data.url} and login to the app`, async () => {
		await LoginPage.openUrl(data.url);
		await LoginPage.login(data.loginCredential.username, data.loginCredential.password);

		await expect(await HomePage.$homepageProfileIcon()).toBeDisplayed();
	});

	it('In home page, select the first product under "New Arrivals"', async () => {
		const productFullName = await HomePage.clickNewArrivalProductAndReturnName();

		await expect(browser).toHaveUrl(expect.stringContaining(productFullName.replace(/\s/g, '').toLocaleLowerCase()));
		await expect(await ShopPage.$productNameTitle()).toHaveText(productFullName);
	});
});
