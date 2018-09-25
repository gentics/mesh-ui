import { browser, by, element, ExpectedConditions } from 'protractor';

import { NodeListRow } from './node-list-row.po';

const nodeList = element(by.css('mesh-container-contents'));

export function getBreadcrumbLinks() {
    return nodeList.all(by.css('gtx-breadcrumbs a.breadcrumb'));
}

export function getNode(displayName: string): NodeListRow {
    return new NodeListRow(
        element
            .all(by.tagName('mesh-node-row'))
            .filter(el => el.isElementPresent(by.cssContainingText('a', displayName)))
            .first()
    );
}

export async function createNode(schemaName: string) {
    await element(by.css('mesh-create-node-button gtx-button')).click();
    await browser.waitForAngular();
    await element
        .all(by.tagName('gtx-dropdown-item'))
        .filter(el => el.isElementPresent(by.cssContainingText('.name', schemaName)))
        .first()
        .click();
}
