import { by, element } from 'protractor';

import { getTextNodeText } from '../testUtil';

import { HtmlField } from './html-field.po';

export class NodeEditor {
    private readonly editor = element(by.tagName('mesh-node-editor'));

    async chooseNodeReference(fieldName: string) {
        await this.getFieldElement('mesh-node-field', fieldName)
            .element(by.buttonText('Browse'))
            .click();
    }

    async getBreadCrumbText() {
        const breadcrumb = await this.editor.element(by.css('.info-row .path a')).getWebElement();
        return getTextNodeText(breadcrumb);
    }

    private getFieldElement(tagName: string, fieldName: string) {
        return element
            .all(by.tagName(tagName))
            .filter(el => el.isElementPresent(by.cssContainingText('label', fieldName)))
            .first();
    }

    getHtmlField(fieldName: string) {
        return new HtmlField(this.getFieldElement('mesh-html-field', fieldName));
    }

    save() {
        return this.editor.element(by.css('.editor-header .primary-buttons .save-button')).click();
    }
}
