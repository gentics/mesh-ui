import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

import { awaitArray } from '../testUtil';

export class NodeListRow {
    constructor(private container: ElementFinder) {}

    public async openFolder() {
        await this.container.element(by.css('.title a')).click();
    }

    public async editNode() {
        await this.openNodeMenu();
        await element(by.cssContainingText('gtx-dropdown-item', 'Edit')).click();
    }

    public async moveNode() {
        await this.openNodeMenu();
        await element(by.cssContainingText('gtx-dropdown-item', 'Move')).click();
    }

    public async copyNode() {
        await this.openNodeMenu();
        await element(by.cssContainingText('gtx-dropdown-item', 'Copy')).click();
    }

    public async deleteNode() {
        await this.openNodeMenu();
        await element(by.cssContainingText('gtx-dropdown-item', 'Delete')).click();
        await element(by.cssContainingText('gtx-modal-dialog button', 'Delete')).click();
    }

    public async getNodeUuid(): Promise<string> {
        const href = await this.container.element(by.css('.title a')).getAttribute('href');
        return href.match(/demo\/(.*)\//)![1];
    }

    public isPresent() {
        return this.container.isPresent();
    }

    public async getLanguages(): Promise<string[]> {
        return awaitArray<string>(
            this.container.all(by.css('mesh-available-languages-list li')).map<string>(element => element!.getText())
        );
    }

    /**
     * Get all the category tag titles the node is eventually tagged with
     */
    public async getTags(): Promise<string[]> {
        return awaitArray<string>(
            this.container.all(by.css('.added-tags .tag-name')).map<string>(element => element!.getText())
        );
    }

    private async openNodeMenu() {
        await this.container.element(by.css('gtx-dropdown-list button')).click();
        await browser.wait(ExpectedConditions.presenceOf(element(by.css('mesh-app > gtx-dropdown-content-wrapper'))));
    }
}
