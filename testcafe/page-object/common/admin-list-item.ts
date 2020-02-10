import { t } from 'testcafe';

export class AdminListItem {
    public constructor(public element: Selector) {}

    public async open() {
        await t.click(this.element.find('.item-row > a'));
    }

    public isChecked() {
        return this.element.find('gtx-checkbox input').checked;
    }

    public async toggleCheck() {
        await t.click(this.element.find('gtx-checkbox label'));
    }
}
