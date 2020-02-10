import { t } from 'testcafe';

import { Thumbnail } from './thumbnail';

export class NodeField {
    constructor(public element: Selector) {}

    public async chooseNode() {
        await t.click(this.element.find('button').withText('search'));
    }

    public thumbnail(): Thumbnail {
        return new Thumbnail(this.element.find('mesh-thumbnail'));
    }
}
