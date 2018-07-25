import { by, ElementFinder } from 'protractor';

export class NodeBrowserNode {
    constructor(private node: ElementFinder) {}

    select() {
        return this.node.element(by.tagName('gtx-checkbox')).click();
    }
}
