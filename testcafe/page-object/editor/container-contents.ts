import { t, Selector } from 'testcafe';

export namespace containerContents {
    export async function createNode(schemaName: string) {
        await t
            .click(Selector('button').withText('CREATE NODE'))
            .click(Selector('gtx-dropdown-item').withText(schemaName));
    }
}
