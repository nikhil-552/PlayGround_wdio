import Common from './common.js';

class ContactPage extends Common {
	constructor() {
		super();
		this.$fillUpFromText = () => $('h1=Fill up a Form');
		this.$$inputFields = () => $$("[placeholder='Enter your name here']");
		this.$receivedSuccessMsg = () => $('.text-green-500');
		this.receivedSuccessMessageContext = (senderName, email) =>
			`Thank you dear ${senderName}, Your messages has been received successfully. Futher details will sent to you by your email at ${email}.`;
	}
}

export default new ContactPage();
