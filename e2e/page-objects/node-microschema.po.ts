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
    }

    getMicroschemaButton() {
        return element.all(by.css('.main-menu li a span')).get(4);
    }

    getAllMicroschemasName() {
        return element.all(by.css('.item-primary')).getText();
    }

    async clickSomeMicroschema(microschemaName: string) {
        await this.getSomeMicroschema(microschemaName).click();
    }

    getSomeMicroschema(microschemaName: string) {
        return element(by.cssContainingText('.item-primary', microschemaName));
    }

    async clickAllocationsTab() {
        await element
            .all(by.css('.tab-link a'))
            .last()
            .click();
    }

    getProjectsName() {
        return element.all(by.css('gtx-checkbox')).getAttribute('ng-reflect-label');
    }

    async clearFilterText() {
        await element(by.css('gtx-input input')).clear();
    }

    async setFilterText(text: string) {
        await element(by.css('gtx-input input')).sendKeys(text);
    }

    async checkAllMicroschemas() {
        await element(by.css('.select-all')).click();
    }

    checkedCount() {
        return element(by.css('.checked-count'));
    }

    getBreadcrumbs() {
        return element.all(by.css('gtx-breadcrumbs a.breadcrumb')).getText();
    }

    async createNewMicroschemaClick() {
        await this.getCreateMicroschemaButton().click();
    }

    getCreateMicroschemaButton() {
        return element(by.cssContainingText('.button-event-wrapper', 'Create Microschema'));
    }

    async giveMicroschemaInfo(microschemaInfo: String) {
        await browser.wait(() => browser.executeScript(() => window.monaco));
        await browser.executeScript(
            (microschemaInfo: String) => window.monaco.editor.getModels()[0].setValue(microschemaInfo),
            microschemaInfo
        );
    }

    async clickSaveButton() {
        await element(by.cssContainingText('.button-event-wrapper', 'Save')).click();
    }

    async clickDeleteButton() {
        await element(by.cssContainingText('.button-event-wrapper', 'Delete')).click();
    }

    async chooseMicroschema() {
        await element
            .all(by.css('gtx-checkbox'))
            .get(1)
            .click();
    }

    async clickDeleteTopButton() {
        await element(by.cssContainingText('.button-event-wrapper', 'delete')).click();
    }

    async goToNextPage() {
        await element
            .all(by.css('.page-link'))
            .get(3)
            .click();
    }
}
