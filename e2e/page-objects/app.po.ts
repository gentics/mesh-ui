import { browser, by, element, until } from 'protractor';

import { HasUuid } from '../model';

export async function navigateToHome() {
    await browser.get('/');
    const url = await browser.getCurrentUrl();
    if (url.match(/login$/)) {
        await this.login();
    }
}

async function login() {
    await element(by.css('input[name="username"]')).sendKeys('admin');
    await element(by.css('input[name="password"]')).sendKeys('admin');
    await element(by.tagName('button')).click();
    // This seems to be necessary sometimes
    await browser.waitForAngular();
}

export async function navigateToNodeEdit(node: HasUuid, language = 'en') {
    await browser.get(`/#/editor/project/(detail:demo/${node.uuid}/${language})`);
}

export async function navigateToFolder(node: HasUuid, language = 'en') {
    await browser.get(`/#/editor/project/(list:demo/${node.uuid}/${language})`);
}
