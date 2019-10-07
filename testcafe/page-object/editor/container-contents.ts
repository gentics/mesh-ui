import { t, Selector } from 'testcafe';

import { NodeRow } from './node-row';

export namespace containerContents {
    /**
     * Asserts that the container contents are visible.
     */
    export async function expectVisible() {
        await t.expect(Selector('mesh-container-contents').visible).ok('Container contents are not visible');
    }

    export async function createNode(schemaName: string) {
        await t.click(createNodeButton()).click(createNodeSchema(schemaName));
    }

    export function createNodeButton() {
        return Selector('button').withText('CREATE NODE');
    }

    export function createNodeSchema(schemaName: string) {
        return Selector('gtx-dropdown-item').withText(schemaName);
    }

    export function getListItemByName(displayName: string) {
        return new NodeRow(
            Selector('mesh-node-row').filter(
                node => {
                    return node.querySelector('.title a')!.textContent === displayName;
                },
                { displayName }
            )
        );
    }
}
