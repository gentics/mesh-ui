import { browser, by, element } from 'protractor';

import * as api from '../api';
import { getTextNodeText, i18n } from '../testUtil';

import { BinaryField } from './binary-field.po';
import { HtmlField } from './html-field.po';

const editor = element(by.tagName('mesh-node-editor'));

export async function chooseNodeReference(fieldName: string) {
    await getFieldElement('mesh-node-field', fieldName)
        .element(by.css('button'))
        .click();
}

export async function getBreadCrumbText() {
    const breadcrumb = await editor.element(by.css('.info-row .path a')).getWebElement();
    return getTextNodeText(breadcrumb);
}

function getFieldElement(tagName: string, fieldName: string) {
    return element
        .all(by.tagName(tagName))
        .filter(el => el.isElementPresent(by.cssContainingText('label', fieldName)))
        .first();
}

export function getHtmlField(fieldName: string) {
    return new HtmlField(getFieldElement('mesh-html-field', fieldName));
}

export function getBinaryField(fieldName: string) {
    return new BinaryField(getFieldElement('mesh-binary-field', fieldName));
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
    return editor.element(by.css('.editor-header .primary-buttons .save-button')).click();
}

export async function fetchCurrentNode() {
    const url = await browser.getCurrentUrl();
    const match = url.match(/detail:demo\/(.*)\//);
    if (!match) {
        throw new Error(`Could not get uuid from url. Url is ${url}`);
    }
    return api.findNodeByUuid(match[1]);
}

export async function publish() {
    return editor.element(by.css('.editor-header .primary-buttons .success')).click();
}

/**
 * Tests if the editor pane is currently displayed.
 */
export function isDisplayed() {
    return editor.isDisplayed();
}

export async function createLanguage(language: string) {
    await editor.element(by.css('.language mesh-node-language-switcher')).click();
    await browser
        .element(by.cssContainingText('gtx-dropdown-content-wrapper gtx-dropdown-item', getTranslateNodeText(language)))
        .click();
}

function getTranslateNodeText(langCode: string): string {
    const language = i18n('lang')(langCode);
    return i18n('editor')('language_translate_to').replace('{{language}}', language);
}
