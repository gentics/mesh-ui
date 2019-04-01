import { browser, by, element } from 'protractor';

import { awaitArray, toText } from '../testUtil';

declare const window: any;

export class NodeMicroschema {
    async openMicroschema() {
        await browser.sleep(1000);
        await this.getMicroschemaButton().click();
        await browser.sleep(1000);
    }

    getMicroschemaButton() {
        return element.all(by.css('.main-menu li a span')).get(6);
    }

    getAllMicroschemasName() {
        return awaitArray<string>(element.all(by.css('.item-primary')).map(toText));
    }

    async clickMicroschema(microschemaName: string) {
        await this.getMicroschema(microschemaName).click();
        await browser.sleep(1000);
    }

    getMicroschema(microschemaName: string) {
        return element(by.cssContainingText('.item-primary', microschemaName));
    }

    async clickJsonEditorTab() {
        await element(by.cssContainingText('.tab-link a', 'JSON')).click();
    }

    async clickAllocationsTab() {
        await element(by.cssContainingText('.tab-link a', 'Project Assignments')).click();
    }

    getProjectNames() {
        return element.all(by.css('mesh-admin-list gtx-checkbox')).getAttribute('ng-reflect-label');
    }

    async clearFilterText() {
        await element(by.css('gtx-input input')).clear();
    }

    async setFilterText(text: string) {
        await element(by.css('gtx-input input')).sendKeys(text);
        await browser.sleep(1000);
    }

    async checkAllMicroschemas() {
        await element(by.css('.select-all')).click();
    }

    checkedCount() {
        return element(by.css('.checked-count'));
    }

    async createNewMicroschemaClick() {
        await this.getCreateMicroschemaButton().click();
    }

    getCreateMicroschemaButton() {
        return element(by.cssContainingText('.button-event-wrapper', 'Create Microschema'));
    }

    async setMicroschemaJSON(microschemaInfo: String) {
        await browser.wait(() => browser.executeScript(() => window.monaco));
        await browser.executeScript(
            (microschemaInfo: String) => window.monaco.editor.getModels()[0].setValue(microschemaInfo),
            microschemaInfo
        );
    }

    async clickSaveButton() {
        await element(by.cssContainingText('.button-event-wrapper', 'Save')).click();
    }

    async chooseMicroschema() {
        await element
            .all(by.css('gtx-checkbox'))
            .get(1)
            .click();
    }

    async clickDeleteTopButton() {
        await browser.waitForAngularEnabled(true);
        await element(by.cssContainingText('.button-event-wrapper', 'delete')).click();
    }

    async clickDialogDeleteButton() {
        await element(by.cssContainingText('.button-event-wrapper', 'Delete')).click();
    }

    async goToNextPage() {
        await element(by.cssContainingText('.page-link', ' » ')).click();
    }
}
