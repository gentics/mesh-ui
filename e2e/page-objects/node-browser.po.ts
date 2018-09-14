import { browser, by, element, Key } from 'protractor';

import { NodeBrowserNode } from './node-browser-node.po';

export function getBreadcrumbLinks() {
    return nodeBrowser().all(by.css('gtx-breadcrumbs a.breadcrumb'));
}

export function getNodes() {
    return nodeBrowser().all(by.css('gtx-contents-list-item'));
}

export function getNodesOnlyNames() {
    return nodeBrowser().all(by.css('gtx-contents-list-item .displayName'));
}

export function getNodeLinks() {
    return nodeBrowser().all(by.css('gtx-contents-list-item a'));
}

export function getPages() {
    return nodeBrowser().all(by.css('pagination-controls li:not(.pagination-previous):not(.pagination-next)'));
}

export function openFolder(displayName: string) {
    return getNodes()
        .all(by.cssContainingText('a', displayName))
        .first()
        .click();
}

export function choose() {
    return nodeBrowser()
        .element(by.css('button.primary'))
        .click();
}

export function getNode(displayName: string): NodeBrowserNode {
    const node = nodeBrowser().element(by.cssContainingText('gtx-contents-list-item', displayName));
    return new NodeBrowserNode(node);
}

export async function search(term: string) {
    await nodeBrowser()
        .element(by.css('gtx-search-bar input'))
        .sendKeys(term, Key.ENTER);
    await browser.waitForAngular();
}

function nodeBrowser() {
    return element(by.css('mesh-node-browser'));
}
