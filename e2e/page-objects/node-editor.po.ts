import { by, element } from 'protractor';

import { getTextNodeText } from '../testUtil';

import { BinaryField } from './binary-field.po';
import { HtmlField } from './html-field.po';

export class NodeEditor {
    private readonly editor = element(by.tagName('mesh-node-editor'));

    async chooseNodeReference(fieldName: string) {
        await this.getFieldElement('mesh-node-field', fieldName)
            .element(by.css('button'))
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

    getBinaryField(fieldName: string) {
        return new BinaryField(this.getFieldElement('mesh-binary-field', fieldName));
    }

    getDescription() {
        return element(by.css('.ql-editor p')).getText();
    }

    getRemoveNodeLink() {
        return element(by.css('.editor-container'))
            .all(by.css('.ql-tooltip'))
            .get(1)
            .element(by.css('.ql-remove'));
    }

    async clickSaveAndClose() {
        await element(by.cssContainingText('button', 'Save and close')).click();
    }

    save() {
        return this.editor.element(by.css('.editor-header .primary-buttons .save-button')).click();
    }

    publish() {
        return this.editor.element(by.css('.editor-header .primary-buttons .success')).click();
    }
}
