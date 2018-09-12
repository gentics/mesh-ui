import { by, element } from 'protractor';

export class NodeField {
    async clickBrowse() {
        await element(by.buttonText('search')).click();
    }

    async clickDelete() {
        await element(by.buttonText('clear')).click();
    }

    async clickNodeName(nodeName: string) {
        await element(by.cssContainingText('.nodeName', nodeName)).click();
    }

    getDisplayName() {
        return element(by.css('.display-name'));
    }

    getIcon() {
        return element(by.css('mesh-thumbnail icon'));
    }

    getSelectButton() {
        return element.all(by.css('.select-item-button'));
    }

    getPath() {
        return element.all(by.css('.path')).get(1);
    }
}
