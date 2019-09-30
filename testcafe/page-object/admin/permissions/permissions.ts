import { t, Selector } from 'testcafe';

import { NodePermission } from '../../../../src/app/admin/permissions/permissions.util';
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

    export async function toggleCanCreate() {
        await t.click(
            Selector('p-checkbox')
                .withText('Can create new')
                .find('label')
        );
    }

    export async function toggleColumn(perm: NodePermission) {
        await t.click(Selector(`th label[title="${perm}"]`));
    }
}
