import Common from './common.js';

class ComponentsPage extends Common {
	constructor() {
		super();
		this.$exploreComponents = () => $('h1=Explore Components');
		this.$learnMoreBtn = componentName => $(`//h2[contains(text(),'${componentName}')]//following::a[contains(text(),'Learn more')]`);
		this.$popHeading = () => $('.text-xl');
		this.$popContent = () => $('.text-xl + p');
		this.$openShadowDOM = () => $('.shadow-host').shadow$('div.shadow-content');
		this.$$openShadowDOMTexts = () => this.$openShadowDOM().$$('*');
		this.popupHeading = 'Pop Window Content';
		this.popupContent = 'This is the content of the Pop Window. You can put any content here.';
		this.components = {
			popWindowComponent: 'Pop Window Component',
			shadowDOMComponent: 'Shadow DOM Component',
		};
		this.openShadowTitleAndText = ['Open Shadow DOM', 'This is inside open shadow root.'];
	}
}

export default new ComponentsPage();
