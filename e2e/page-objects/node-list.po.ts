import { by, element } from 'protractor';

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

    public getBreadcrumbLinks() {
        return this.nodeList.all(by.css('gtx-breadcrumbs a.breadcrumb'));
    }

    getNodeRow(displayName: string) {
        return element
            .all(by.tagName('mesh-node-row'))
            .filter(el => el.isElementPresent(by.cssContainingText('a', displayName)))
            .first();
    }
}
