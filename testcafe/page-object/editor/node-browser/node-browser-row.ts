import { t } from 'testcafe';

export class NodeBrowserRow {
    public checkBox: Selector;
    constructor(public element: Selector) {
        this.checkBox = element.find('gtx-checkbox input');
    }

    public async open() {
        await t.click(this.element.find('.displayName a'));
    }
}
