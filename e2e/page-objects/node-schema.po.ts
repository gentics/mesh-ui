import { browser, by, element } from 'protractor';

declare const window: any;

export class NodeSchema {
    async openSchema() {
        await browser.driver
            .manage()
            .window()
            .maximize();
        await browser.sleep(1000);
        await this.getSchemaButton().click();
        await browser.sleep(1000);
    }

    getSchemaButton() {
        return element.all(by.css('.main-menu li a span')).get(3);
    }

    getAllSchemasName() {
        return element.all(by.css('.item-primary')).getText();
    }

    async clickSchema(schemaName: string) {
        await this.getSchema(schemaName).click();
        await browser.sleep(1000);
    }

    getSchema(schemaName: string) {
        return element(by.cssContainingText('.item-primary', schemaName));
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

    async checkAllSchemas() {
        await element(by.css('.select-all')).click();
    }

    checkedCount() {
        return element(by.css('.checked-count'));
    }

    async createNewSchemaClick() {
        await this.getCreateSchemaButton().click();
    }

    getCreateSchemaButton() {
        return element(by.cssContainingText('.button-event-wrapper', 'Create Schema'));
    }

    async setSchemaJSON(schemaInfo: String) {
        await browser.wait(() => browser.executeScript(() => window.monaco));
        await browser.executeScript(
            (schemaInfo: String) => window.monaco.editor.getModels()[0].setValue(schemaInfo),
            schemaInfo
        );
    }

    async clickSaveButton() {
        await element(by.cssContainingText('.button-event-wrapper', 'Save')).click();
    }

    async chooseSchema() {
        await element
            .all(by.css('gtx-checkbox'))
            .get(1)
            .click();
    }

    async clickDeleteTopButton() {
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
