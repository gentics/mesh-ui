import { t, Selector } from 'testcafe';

import { selectors } from '../../selectors';

export namespace schemaEditor {
    export async function setName(name: string) {
        await t.typeText(selectors.gtxInputWithLabel('Name *'), 'dummy');
    }

    export async function create(assignToProject = false) {
        await t.click(Selector('button').withText('CREATE')).click(Selector('button').withText('NO'));
    }
}
