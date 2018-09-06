import { by, element } from 'protractor';

export class NodeField {
    async clickBrowse() {
        await element
            .all(by.css('.right-panel .show-on-hover gtx-button'))
            .first()
            .click();
    }

    async clickDelete() {
        await element
            .all(by.css('.right-panel .show-on-hover gtx-button'))
            .get(1)
            .click();
    }

    async clickNodeName() {
        await element(by.cssContainingText('.nodeName', 'Space Shuttle Image')).click();
    }

    async clickSaveAndClose() {
        await element(by.cssContainingText('button', 'Save and close')).click();
    }

    async clickSave() {
        await element(by.cssContainingText('.primary-buttons button', 'Save')).click();
    }

    async clickSelect(number: number) {
        await element
            .all(by.css('gtx-contents-list-item'))
            .get(number)
            .element(by.css('button'))
            .click();
    }

    getBreadcrumbLink() {
        return element.all(by.css('a.breadcrumb')).get(2);
    }

    getDisplayName() {
        return element(by.css('.display-name'));
    }

    getIcon() {
        return element
            .all(by.css('gtx-contents-list-item'))
            .get(4)
            .element(by.css('icon'));
    }

    getSelectButton() {
        return element(by.cssContainingText('gtx-contents-list-item gtx-button', 'Select Node Reference'));
    }

    getFolderButton(folderName: string) {
        return element(by.cssContainingText('.node-browser-container', folderName));
    }

    getPath() {
        return element.all(by.css('label.path')).get(0);
    }
}
