import { browser, by, element } from 'protractor';

declare const window: any;

export class NodeMicroschema {
    async openMicroschema() {
        await browser.driver
            .manage()
            .window()
            .maximize();
        await browser.sleep(1000);
        await this.getMicroschemaButton().click();
        await browser.sleep(1000);
    }

    getMicroschemaButton() {
        return element.all(by.css('.main-menu li a span')).get(4);
    }

    getAllMicroschemasName() {
        return element.all(by.css('.item-primary')).getText();
    }

    async clickMicroschema(microschemaName: string) {
        await this.getMicroschema(microschemaName).click();
        await browser.sleep(1000);
    }

    getMicroschema(microschemaName: string) {
        return element(by.cssContainingText('.item-primary', microschemaName));
    }

    async clickAllocationsTab() {
        await element
            .all(by.css('.tab-link a'))
            .last()
            .click();
    }

    getProjectNames() {
        return element.all(by.css('gtx-checkbox')).getAttribute('ng-reflect-label');
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

    async clickDeleteBottomButton() {
        await browser.waitForAngularEnabled(false);
        await element(by.cssContainingText('.button-event-wrapper', 'Delete')).click();
    }

    async goToNextPage() {
        await element(by.cssContainingText('.page-link', ' » ')).click();
    }
}
