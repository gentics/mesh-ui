import { by, element } from 'protractor';

import { getTextNodeText, i18n } from '../testUtil';

const editorI18n = i18n('editor');

export async function getPublishOptions() {
    const menu = await openMenu();
    const elements = await menu.all(by.css('mesh-publish-options gtx-dropdown-item')).getWebElements();
    return Promise.all(elements.map(getTextNodeText));
}

export function publish() {
    return clickOption('publish_button');
}

export function publishAllLang() {
    return clickOption('publish_all_lang');
}

export function unpublish() {
    return clickOption('unpublish');
}

export function unpublishAllLang() {
    return clickOption('unpublish_all_lang');
}

async function clickOption(i18nKey: string) {
    const menu = await openMenu();
    return menu.element(by.cssContainingText('gtx-dropdown-item', editorI18n(i18nKey))).click();
}

async function openMenu() {
    const publishOptions = () => element(by.css('mesh-publish-options'));
    let options = publishOptions();
    if (!(await options.isPresent())) {
        await element(by.cssContainingText('mesh-node-editor .editor-header button', 'more_vert')).click();
        options = publishOptions();
    }
    return options;
}
