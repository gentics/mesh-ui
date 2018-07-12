import { browser, by, element } from 'protractor';

import { HasUuid } from './model';

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
    }

    async openFolder(displayName: string) {
        await element(by.cssContainingText('mesh-node-row a', displayName)).click();
    }

    async editNode(displayName: string) {
        await this.getNodeRow(displayName)
            .element(by.cssContainingText('button', 'edit'))
            .click();
    }

    async navigateToNodeEdit(node: HasUuid) {
        await browser.get(`/#/editor/project/(detail:demo/${node.uuid}/en)`);
    }

    async chooseNodeReference(fieldName: string) {
        await this.getFieldElement(fieldName)
            .element(by.buttonText('Browse'))
            .click();
    }

    getNodeRow(displayName: string) {
        return element
            .all(by.tagName('mesh-node-row'))
            .filter(el => el.isElementPresent(by.cssContainingText('a', displayName)))
            .first();
    }

    getFieldElement(fieldName: string) {
        return element
            .all(by.tagName('mesh-node-field'))
            .filter(el => el.isElementPresent(by.cssContainingText('label', fieldName)))
            .first();
    }
}
