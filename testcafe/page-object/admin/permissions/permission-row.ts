import { t, Selector } from 'testcafe';

import { NodePermission } from '../../../../src/app/admin/permissions/permissions.util';

export namespace permissionsRow {
    export function byName(name: string) {
        return new PermissionsRow(Selector('tr').withText(name));
    }
}

export class PermissionsRow {
    constructor(private elem: Selector) {}

    async togglePermissions(...perms: NodePermission[]) {
        const cells = this.elem.find('td');
        for (const perm of perms) {
            await t.click(cells.filter(node => !!node.querySelector(`label[title="${perm}"]`), { perm }));
        }
    }

    toggleAll() {}
}
