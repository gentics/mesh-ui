import { by, element, promise, ElementFinder } from 'protractor';

export class GroupAdminListRow {
    constructor(private root: ElementFinder) {}

    async roleNames(): Promise<string[]> {
        const names = await this.root.all(by.css('mesh-chip .chip-contents')).map(el => el!.getText());

        return Promise.all(names as any) as any;
    }

    removeRole(name: string) {
        return this.root
            .all(by.css('mesh-chip'))
            .filter(el =>
                el!
                    .element(by.css('.chip-contents'))
                    .getText()
                    .then((text: string) => text === name)
            )
            .first()
            .element(by.css('icon'))
            .click();
    }

    async addRole(name: string) {
        await this.root.element(by.css('mesh-user-group-select button')).click();
        await element(by.cssContainingText('gtx-dropdown-content gtx-dropdown-item', name)).click();
    }

    public name(): Promise<string> {
        return this.root.element(by.css('a')).getText();
    }

    public async delete() {
        await this.root.element(by.css('.row-actions gtx-dropdown-list button')).click();
        await element(by.cssContainingText('gtx-dropdown-content gtx-dropdown-item', 'delete')).click();
        await element(by.cssContainingText('gtx-modal-dialog button', 'Delete')).click();
    }
}
