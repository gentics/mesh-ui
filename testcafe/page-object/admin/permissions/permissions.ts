import { t, Selector } from 'testcafe';

import { capitalize } from '../../../../src/app/common/util/util';

export type PermissionEntityType =
    | 'projects'
    | 'nodes'
    | 'tags'
    | 'schemas'
    | 'microschemas'
    | 'users'
    | 'groups'
    | 'roles';

export namespace permissions {
    export async function openEntityType(entity: PermissionEntityType) {
        await t.click(Selector('p-accordiontab div').withText(capitalize(entity)));
    }
}
