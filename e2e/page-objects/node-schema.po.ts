import { browser, by, element } from 'protractor';

export class NodeSchema {
    async openSchema() {
        await browser.driver
            .manage()
            .window()
            .maximize();
        await this.getSchemaButton().click();
    }

    getSchemaButton() {
        return element.all(by.css('.main-menu li a span')).get(3);
    }

    getAllSchemasName() {
        return element.all(by.css('.item-primary')).getText();
    }

    async clickSomeSchema(schemaName: string) {
        await this.getSomeSchema(schemaName).click();
    }

    getSomeSchema(schemaName: string) {
        return element(by.cssContainingText('.item-primary', schemaName));
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

    async checkAllSchemas() {
        await element(by.css('.select-all')).click();
    }

    checkedCount() {
        return element(by.css('.checked-count'));
    }

    getBreadcrumbs() {
        return element.all(by.css('gtx-breadcrumbs a.breadcrumb')).getText();
    }

    async createNewSchema() {
        await this.getCreateSchemaButton().click();
    }

    getCreateSchemaButton() {
        return element(by.cssContainingText('.button-event-wrapper', 'Create Schema'));
    }
}
