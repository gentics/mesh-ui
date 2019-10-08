import { t } from 'testcafe';

export class NumberField {
    constructor(public element: Selector) {}

    public async setValue(value: number) {
        await t.typeText(this.element.find('input'), value.toString(), { replace: true });
    }
}
