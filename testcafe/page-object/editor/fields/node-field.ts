import { t } from 'testcafe';

export class NodeField {
    constructor(public element: Selector) {}

    public async chooseNode() {
        await t.click(this.element.find('button').withText('search'));
    }
}
