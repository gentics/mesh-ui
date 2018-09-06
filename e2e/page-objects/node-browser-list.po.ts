import { browser, by, element } from 'protractor';

export class NodeBrowserList {
    async clickFirstCheckbox() {
        await element
            .all(by.css('gtx-checkbox'))
            .first()
            .click();
    }
}
