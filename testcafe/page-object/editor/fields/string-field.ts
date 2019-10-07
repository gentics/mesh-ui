import { t } from 'testcafe';

export class StringField {
    constructor(public element: Selector) {}

    public async setValue(value: string) {
        await t.typeText(this.element.find('input'), value, { replace: true });
    }
}
