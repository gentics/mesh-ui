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

test('Setting role permissions', async t =>
    withTemporaryRole(async role => {
        await t.useRole(Admin);
        await navigate.toPermissionAdmin();
        await permissionsRoleList.chooseRole(role.name);

        await permissions.openEntityType('roles');

        await permissions.toggleCanCreate();
        await permissionsRow.byName('admin').togglePermissions('create', 'read', 'update', 'delete');
        await permissionsRow.byName('anonymous').togglePermissions('read');
        await permissionsRow.byName('Editor Role').toggleAll();

        const rolePermissions = async (roleName: string) =>
            api.getPermissions(role, PermissionsPath.role(await api.getRoleByName(roleName)));

        await t
            .expect(await rolePermissions('admin'))
            .eql(onlyNodePermissions('create', 'read', 'update', 'delete'))
            .expect(await rolePermissions('anonymous'))
            .eql(onlyNodePermissions('read'))
            .expect(await rolePermissions('Editor Role'))
            .eql(onlyNodePermissions('create', 'read', 'update', 'delete'))
            .expect(await api.getPermissions(role, PermissionsPath.roleRoot()))
            .eql(onlyNodePermissions('create'));

        await permissions.toggleColumn('delete');

        await t
            .expect(await rolePermissions('admin'))
            .eql(onlyNodePermissions('create', 'read', 'update', 'delete'))
            .expect(await rolePermissions('anonymous'))
            .eql(onlyNodePermissions('read', 'delete'))
            .expect(await rolePermissions('Editor Role'))
            .eql(onlyNodePermissions('create', 'read', 'update', 'delete'))
            .expect(await rolePermissions('Client Role'))
            .eql(onlyNodePermissions('delete'));
    }));

test('Setting project permissions', async t =>
    withTemporaryRole(async role => {
        await t.useRole(Admin);
        await navigate.toPermissionAdmin();
        await permissionsRoleList.chooseRole(role.name);

        await permissions.openEntityType('projects');

        await permissions.toggleCanCreate();
        await permissionsRow.byName('demo').togglePermissions('create', 'update');

        await t
            .expect(await api.getPermissions(role, PermissionsPath.project(await api.getProjectByName('demo'))))
            .eql(onlyNodePermissions('create', 'update'))
            .expect(await api.getPermissions(role, PermissionsPath.projectRoot()))
            .eql(onlyNodePermissions('create'));
    }));

function onlyNodePermissions(...perms: NodePermission[]): PermissionInfoFromServer {
    const permObject = toObject(k => k, () => false, nodePermissions);
    perms.forEach(k => (permObject[k] = true));
    return permObject as any;
}
