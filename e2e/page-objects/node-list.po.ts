import { browser, by, element, until, ExpectedConditions } from 'protractor';

export class MeshNodeList {
    private readonly nodeList = element(by.css('mesh-container-contents'));

    async openFolder(displayName: string) {
        await element(by.cssContainingText('mesh-node-row a', displayName)).click();
    }

    async editNode(displayName: string) {
        await this.getNodeRow(displayName)
            .element(by.cssContainingText('button', 'edit'))
            .click();
    }

    async moveNode(displayName: string) {
        await this.openNodeMenu(displayName);
        await element(by.cssContainingText('gtx-dropdown-item', 'Move')).click();
    }

    private async openNodeMenu(displayName: string) {
        await this.getNodeRow(displayName)
            .element(by.css('gtx-dropdown-list button'))
            .click();
        await browser.wait(ExpectedConditions.presenceOf(element(by.css('mesh-app > gtx-dropdown-content-wrapper'))));
    }

    public getBreadcrumbLinks() {
        return this.nodeList.all(by.css('gtx-breadcrumbs a.breadcrumb'));
    }

    public getNodeRow(displayName: string) {
        return element
            .all(by.tagName('mesh-node-row'))
            .filter(el => el.isElementPresent(by.cssContainingText('a', displayName)))
            .first();
    }
}
