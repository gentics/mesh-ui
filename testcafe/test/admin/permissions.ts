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

fixture`Permission administration`.page(api.baseUrl());

test('Role permissions', async t =>
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
            .eql(onlyPermissions('create', 'read', 'update', 'delete'))
            .expect(await rolePermissions('anonymous'))
            .eql(onlyPermissions('read'))
            .expect(await rolePermissions('Editor Role'))
            .eql(onlyPermissions('create', 'read', 'update', 'delete'))
            .expect(await api.getPermissions(role, PermissionsPath.roleRoot()))
            .eql(onlyPermissions('create'));

        await permissions.toggleColumn('delete');

        await t
            .expect(await rolePermissions('admin'))
            .eql(onlyPermissions('create', 'read', 'update', 'delete'))
            .expect(await rolePermissions('anonymous'))
            .eql(onlyPermissions('read', 'delete'))
            .expect(await rolePermissions('Editor Role'))
            .eql(onlyPermissions('create', 'read', 'update', 'delete'))
            .expect(await rolePermissions('Client Role'))
            .eql(onlyPermissions('delete'));
    }));

test('Project permissions', async t =>
    withTemporaryRole(async role => {
        await t.useRole(Admin);
        await navigate.toPermissionAdmin();
        await permissionsRoleList.chooseRole(role.name);

        await permissions.openEntityType('projects');

        await permissions.toggleCanCreate();
        await permissionsRow.byName('demo').togglePermissions('create', 'update');

        await t
            .expect(await api.getPermissions(role, PermissionsPath.project(await api.getProjectByName('demo'))))
            .eql(onlyPermissions('create', 'update'))
            .expect(await api.getPermissions(role, PermissionsPath.projectRoot()))
            .eql(onlyPermissions('create'));
    }));

test('Tag permissions', async t =>
    withTemporaryRole(async role => {
        await t.useRole(Admin);
        await navigate.toPermissionAdmin();
        await permissionsRoleList.chooseRole(role.name);

        await permissions.openEntityType('tags');

        await permissionsRow.byName('demo').expand();
        await permissionsRow.byName('Fuels').togglePermissions('read', 'delete');
        await permissionsRow.byName('Fuels').expand();
        await permissionsRow.byName('Hydrogen').toggleAll();

        await permissions.toggleColumn('create');
        await permissionsRow.byName('Colors').expand();

        const project = await api.getProjectByName('demo');
        const fuels = await api.getTagFamilyByName('Fuels');
        const colors = await api.getTagFamilyByName('Colors');

        await t
            .expect(await api.getPermissions(role, PermissionsPath.tagFamily(project, fuels)))
            .eql(onlyPermissions('create', 'read', 'delete'))
            .expect(
                await api.getPermissions(
                    role,
                    PermissionsPath.tag(project, fuels, await api.getTagByName(fuels, 'Hydrogen'))
                )
            )
            .eql(onlyPermissions('create', 'read', 'update', 'delete'))
            .expect(
                await api.getPermissions(
                    role,
                    PermissionsPath.tag(project, fuels, await api.getTagByName(fuels, 'Solar'))
                )
            )
            .eql(onlyPermissions('create'))
            .expect(await api.getPermissions(role, PermissionsPath.tagFamily(project, colors)))
            .eql(onlyPermissions('create'))
            .expect(
                await api.getPermissions(
                    role,
                    PermissionsPath.tag(project, colors, await api.getTagByName(colors, 'Orange'))
                )
            )
            .eql(onlyPermissions());
    }));

test.only('Node permissions', async t =>
    withTemporaryRole(async role => {
        await t.useRole(Admin);
        await navigate.toPermissionAdmin();
        await permissionsRoleList.chooseRole(role.name);

        const project = await api.getProject();

        await permissions.openEntityType('nodes');

        await permissionsRow.byName('demo').togglePermissions('read', 'readPublished');
        await permissionsRow.byName('demo').expand();
        await permissionsRow.byName('demo').applyRecursively();

        const nodePermission = async (path: string) =>
            api.getPermissions(role, PermissionsPath.node(project, await api.webroot(path)));

        await t
            .expect(await nodePermission('/'))
            .eql(onlyPermissions('read', 'readPublished'))
            .expect(await nodePermission('/aircrafts'))
            .eql(onlyPermissions('read', 'readPublished'));

        await permissionsRow.byName('Aircraft').togglePermissions('update', 'publish');

        await t
            .expect(await nodePermission('/aircrafts'))
            .eql(onlyPermissions('read', 'readPublished', 'update', 'publish'));

        await permissionsRow.byName('Yachts').toggleAll();

        await t
            .expect(await nodePermission('/yachts'))
            .eql(onlyPermissions('read', 'readPublished', 'update', 'publish', 'delete', 'create'))
            .expect(await nodePermission('/yachts/pelorus'))
            .eql(onlyPermissions('read', 'readPublished'));
    }));

function onlyPermissions(...perms: NodePermission[]): PermissionInfoFromServer {
    const permObject = toObject(k => k, () => false, nodePermissions);
    perms.forEach(k => (permObject[k] = true));
    return permObject as any;
}
