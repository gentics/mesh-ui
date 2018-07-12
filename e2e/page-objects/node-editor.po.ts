import { by, element } from 'protractor';

import { getTextNodeText } from '../testUtil';

export class NodeEditor {
    private readonly editor = element(by.tagName('mesh-node-editor'));

    async chooseNodeReference(fieldName: string) {
        await this.getFieldElement(fieldName)
            .element(by.buttonText('Browse'))
            .click();
    }

    async getBreadCrumbText() {
        const breadcrumb = await this.editor.element(by.css('.info-row .path a')).getWebElement();
        return getTextNodeText(breadcrumb);
    }

    getFieldElement(fieldName: string) {
        return element
            .all(by.tagName('mesh-node-field'))
            .filter(el => el.isElementPresent(by.cssContainingText('label', fieldName)))
            .first();
    }
}
