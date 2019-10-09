import { t } from 'testcafe';

export class Breadcrumbs {
    constructor(public element: Selector) {}

    public async goTo(name: string) {
        await t.click(this.element.find('a').withText(name));
    }
}
