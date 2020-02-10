import { t, Selector } from 'testcafe';

import { selectors } from '../../selectors';

import { AdminListItem } from './admin-list-item';

export namespace adminList {
    export function getItemByName(name: string): AdminListItem {
        return new AdminListItem(
            Selector('mesh-admin-list-item a .name')
                .withText(name)
                .parent('mesh-admin-list-item')
        );
    }

    export async function getAllItems() {
        const elements = await selectors.all(Selector('mesh-admin-list-item').filterVisible());
        return elements.map(element => new AdminListItem(element));
    }
}
