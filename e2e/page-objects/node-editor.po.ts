import { by, element } from 'protractor';

import { getTextNodeText } from '../testUtil';

import { BinaryField } from './binary-field.po';
import { HtmlField } from './html-field.po';

const editor = element(by.tagName('mesh-node-editor'));

export async function chooseNodeReference(fieldName: string) {
    await this.getFieldElement('mesh-node-field', fieldName)
        .element(by.css('button'))
        .click();
}

export async function getBreadCrumbText() {
    const breadcrumb = await this.editor.element(by.css('.info-row .path a')).getWebElement();
    return getTextNodeText(breadcrumb);
}

function getFieldElement(tagName: string, fieldName: string) {
    return element
        .all(by.tagName(tagName))
        .filter(el => el.isElementPresent(by.cssContainingText('label', fieldName)))
        .first();
}

export function getHtmlField(fieldName: string) {
    return new HtmlField(this.getFieldElement('mesh-html-field', fieldName));
}

export function getBinaryField(fieldName: string) {
    return new BinaryField(this.getFieldElement('mesh-binary-field', fieldName));
}

export function getDescription() {
    return element(by.css('.ql-editor p')).getText();
}

export function getRemoveNodeLink() {
    return element(by.css('.editor-container'))
        .all(by.css('.ql-tooltip'))
        .get(1)
        .element(by.css('.ql-remove'));
}

export async function clickSaveAndClose() {
    await element(by.cssContainingText('button', 'Save and close')).click();
}

export async function save() {
    return this.editor.element(by.css('.editor-header .primary-buttons .save-button')).click();
}

export async function publish() {
    return this.editor.element(by.css('.editor-header .primary-buttons .success')).click();
}
