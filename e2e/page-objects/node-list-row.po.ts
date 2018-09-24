import { browser, by, element, promise, ElementFinder, ExpectedConditions } from 'protractor';

export class NodeListRow {
    constructor(private container: ElementFinder) {}

    public async openFolder() {
        await this.container.element(by.css('.title a')).click();
    }

    public async editNode() {
        await this.container.element(by.cssContainingText('button', 'edit')).click();
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
        await element(by.cssContainingText('gtx-dropdown-item', 'Delete'));
    }

    public async getNodeUuid(): Promise<string> {
        const href = await this.container.element(by.css('.title a')).getAttribute('href');
        return href.match(/demo\/(.*)\//)![1];
    }

    public isPresent() {
        return this.container.isPresent();
    }

    public async getLanguages(): Promise<string[]> {
        return this.container
            .all(by.css('mesh-available-languages-list li'))
            .map<string>(element => element!.getText());
    }

    private async openNodeMenu() {
        await this.container.element(by.css('gtx-dropdown-list button')).click();
        await browser.wait(ExpectedConditions.presenceOf(element(by.css('mesh-app > gtx-dropdown-content-wrapper'))));
    }
}
