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

    async copyNode(displayName: string) {
        await this.openNodeMenu(displayName);
        await element(by.cssContainingText('gtx-dropdown-item', 'Copy')).click();
    }

    async getNodeUuid(displayName: string): Promise<string> {
        const href = await this.getNodeRow(displayName)
            .element(by.css('.title a'))
            .getAttribute('href');
        return href.match(/demo\/(.*)\//)![1];
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

    public async createNode(schemaName: string) {
        await element(by.css('mesh-create-node-button gtx-button')).click();
        await element
            .all(by.tagName('gtx-dropdown-item'))
            .filter(el => el.isElementPresent(by.cssContainingText('.name', schemaName)))
            .first()
            .click();
    }
}
