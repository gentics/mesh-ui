import { browser, by, element } from 'protractor';

export class NodeAdmin {
    private readonly mode = element(by.css('.gtx-top-bar-left')).element(by.css('.button-event-wrapper'));

    async modeChange() {
        await this.mode.click();
        await browser.waitForAngular();
    }

    getModeText() {
        return this.mode.getText();
    }

    getBreadcrumbs() {
        return element.all(by.css('gtx-breadcrumbs a.breadcrumb')).getText();
    }
}
