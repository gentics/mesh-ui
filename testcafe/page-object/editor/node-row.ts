import { t, Selector } from 'testcafe';

export class NodeRow {
    constructor(public element: Selector) {}

    public async open() {
        await t.click(this.element.find('.title a'));
    }
}
