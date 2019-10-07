import { t } from 'testcafe';

export class NumberField {
    constructor(private elem: Selector) {}

    public async setValue(value: number) {
        await t.typeText(this.elem.find('input'), value.toString());
    }
}
