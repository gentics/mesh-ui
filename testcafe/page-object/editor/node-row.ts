import { t, Selector } from 'testcafe';

export class NodeRow {
    constructor(private root: Selector) {}

    public async open() {
        await t.click(this.root.find('.title a'));
    }
}
