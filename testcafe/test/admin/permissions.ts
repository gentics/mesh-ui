import { nodePermissions, NodePermission } from '../../../src/app/admin/permissions/permissions.util';
import { PermissionInfoFromServer } from '../../../src/app/common/models/server-models';
import { toObject } from '../../../src/app/common/util/util';
import { api, PermissionsPath } from '../../api';
import { navigate } from '../../navigate';
import { permissionsRow } from '../../page-object/admin/permissions/permission-row';
import { permissions } from '../../page-object/admin/permissions/permissions';
import { permissionsRoleList } from '../../page-object/admin/permissions/permissions-role-list';
import { Admin } from '../../roles';
import { withTemporaryRole } from '../../testUtil';

fixture.only`Permission administration`.page(api.baseUrl());

test('Setting single permission', async t =>
    withTemporaryRole(async role => {
        await t.useRole(Admin);
        await navigate.toPermissionAdmin();
        await permissionsRoleList.chooseRole(role.name);

        await permissions.openEntityType('roles');

        await permissionsRow.byName('admin').togglePermissions('create', 'read', 'update', 'delete');
        await permissionsRow.byName('anonymous').togglePermissions('read');

        await t
            .expect(await api.getPermissions(role, PermissionsPath.role(await api.getRoleByName('admin'))))
            .eql(onlyNodePermissions('create', 'read', 'update', 'delete'));

        await t
            .expect(await api.getPermissions(role, PermissionsPath.role(await api.getRoleByName('anonymous'))))
            .eql(onlyNodePermissions('read'));
    }));

function onlyNodePermissions(...perms: NodePermission[]): PermissionInfoFromServer {
    const permObject = toObject(k => k, () => false, nodePermissions);
    perms.forEach(k => (permObject[k] = true));
    return permObject as any;
}
