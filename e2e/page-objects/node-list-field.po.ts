import { by, element } from 'protractor';

export class ListField {
    async clickAddReference() {
        await element(by.css('mesh-list-field gtx-button')).click();
    }

    getSelectButton() {
        return element(by.cssContainingText('mesh-list-field button', 'Select Node Reference'));
    }
}
