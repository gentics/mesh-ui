import { t, Selector } from 'testcafe';

export class OptionStringField {
    constructor(public element: Selector) {}

    public async setValue(value: string) {
        await t.click(this.element.find('gtx-select'));
        await t.click(Selector('.select-options li').withText(value));
    }
}
