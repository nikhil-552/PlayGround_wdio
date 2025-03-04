import homePage from '../pageObjects/home-page.js';
import data from '../test-data/navigationButtons.json' with { type: 'json' };

describe('Test 1    ', () => {
	it('should launch the Url', async () => {
		await homePage.openUrl();

		await expect(await homePage.$header('Next-gen browser and mobile automation test framework for Node.js').isDisplayed())
			.withContext('Expect Header to be displayed')
			.toBe(true);
	});
	for (const item of data.navigationButtons) {
		it(`should validate the button : ${item} present in the landing page `, async () => {
			await expect(homePage.$buttons(item)).withContext('Expect Navigations buttons to be displayed').toBeDisplayed();
		});
	}
});
describe('Test 2', () => {
	it('should launch the Url', async () => {
		await homePage.openUrl();

		await expect(await homePage.$header('Next-gen browser and mobile automation test framework for Node.js').isDisplayed())
			.withContext('Expect Header to be displayed')
			.toBe(true);
	});

	it('should validate the buttons present in the landing page', async () => {
		for (const item of data.navigationButtons) {
			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(true);

			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(false);
		}
	});

	it('should validate the buttons present in the landing page2', async () => {
		for (const item of data.navigationButtons) {
			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(true);

			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(false);
		}
	});
});
describe('Test 3', () => {
	it('should launch the Url', async () => {
		await homePage.openUrl();

		await expect(await homePage.$header('Next-gen browser and mobile automation test framework for Node.js').isDisplayed())
			.withContext('Expect Header to be displayed')
			.toBe(true);
	});

	it('should validate the buttons present in the landing page', async () => {
		for (const item of data.navigationButtons) {
			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(true);

			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(false);
		}
	});

	it('should validate the buttons present in the landing page2', async () => {
		for (const item of data.navigationButtons) {
			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(true);

			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(false);
		}
	});
});

describe('Test 4', () => {
	it('should validate the buttons present in the landing page2', async () => {
		for (const item of data.navigationButtons) {
			await expect(await homePage.$buttons(item).isDisplayed())
				.withContext('Expect Navigations buttons to be displayed')
				.toBe(true);
		}
	});
});
