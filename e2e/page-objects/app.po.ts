import { browser, by, element, until } from 'protractor';

import { HasUuid } from '../model';

export class AppPage {
    async navigateToHome() {
        await browser.get('/');
        const url = await browser.getCurrentUrl();
        if (url.match(/login$/)) {
            await this.login();
        }
    }

    private async login() {
        await element(by.css('input[name="username"]')).sendKeys('admin');
        await element(by.css('input[name="password"]')).sendKeys('admin');
        await element(by.tagName('button')).click();
        // This seems to be necessary sometimes
        await browser.waitForAngular();
    }

    async navigateToNodeEdit(node: HasUuid, language = 'en') {
        await browser.get(`/#/editor/project/(detail:demo/${node.uuid}/${language})`);
    }
}
