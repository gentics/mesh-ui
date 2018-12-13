import { browser, by, element, ElementFinder } from 'protractor';

export class NodeAdmin {
    // private readonly mode = element(by.css('.gtx-top-bar-left')).element(by.css('.button-event-wrapper'));
    private readonly appNavigator = element(by.css('.gtx-top-bar-left')).element(by.css('.nav-icon'));
    private appIcon: ElementFinder;

    async modeChange() {
        await this.appNavigator.click();
        this.appIcon = await element(by.css('.gtx-top-bar-left')).element(by.css('.app-icon'));
        await this.appIcon.click();
        await browser.waitForAngular();
    }

    async getAppName() {
        await this.appNavigator.click();
        return await element(by.css('.gtx-top-bar-left'))
            .element(by.css('.app-icon'))
            .getAttribute('data-app');
    }

    getBreadcrumbs() {
        return element.all(by.css('gtx-breadcrumbs a.breadcrumb')).getText();
    }
}
