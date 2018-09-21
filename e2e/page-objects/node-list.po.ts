import { browser, by, element, ExpectedConditions } from 'protractor';

const nodeList = element(by.css('mesh-container-contents'));

export async function openFolder(displayName: string) {
    await element(by.cssContainingText('mesh-node-row a', displayName)).click();
}

export async function editNode(displayName: string) {
    await getNodeRow(displayName)
        .element(by.cssContainingText('button', 'edit'))
        .click();
}

export async function moveNode(displayName: string) {
    await openNodeMenu(displayName);
    await element(by.cssContainingText('gtx-dropdown-item', 'Move')).click();
}

export async function copyNode(displayName: string) {
    await openNodeMenu(displayName);
    await element(by.cssContainingText('gtx-dropdown-item', 'Copy')).click();
}

export async function getNodeUuid(displayName: string): Promise<string> {
    const href = await getNodeRow(displayName)
        .element(by.css('.title a'))
        .getAttribute('href');
    return href.match(/demo\/(.*)\//)![1];
}

async function openNodeMenu(displayName: string) {
    await getNodeRow(displayName)
        .element(by.css('gtx-dropdown-list button'))
        .click();
    await browser.wait(ExpectedConditions.presenceOf(element(by.css('mesh-app > gtx-dropdown-content-wrapper'))));
}

export function getBreadcrumbLinks() {
    return nodeList.all(by.css('gtx-breadcrumbs a.breadcrumb'));
}

export function getNodeRow(displayName: string) {
    return element
        .all(by.tagName('mesh-node-row'))
        .filter(el => el.isElementPresent(by.cssContainingText('a', displayName)))
        .first();
}

export async function createNode(schemaName: string) {
    await element(by.css('mesh-create-node-button gtx-button')).click();
    await element
        .all(by.tagName('gtx-dropdown-item'))
        .filter(el => el.isElementPresent(by.cssContainingText('.name', schemaName)))
        .first()
        .click();
}
