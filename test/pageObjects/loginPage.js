import Common from './common.js';

class LoginPage extends Common {
	constructor() {
		super();
		this.$emailField = () => $('input[name="username"]');
		this.$passwordField = () => $('#password');
		this.$signinBtn = () => $('//button[contains(text(),"Sign In")]');
	}

	async login(username, password) {
		await this.$emailField().setValue(username);
		await this.$passwordField().setValue(password);
		await this.$signinBtn().click();
	}
}

export default new LoginPage();
