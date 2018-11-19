import * as page from '../page-objects/app.po';
import { RoleAdminList } from '../page-objects/role-admin/role-admin-list.po';

describe('role admin list', () => {
    beforeEach(async () => {
        await page.navigateToRoleAdmin();
    });

    it('shows all roles', async () => {
        expect(await RoleAdminList.pagination().displayedPages()).toEqual([1]);
        expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder(['anonymous', 'admin']);
    });

    it('creates roles', async () => {
        await RoleAdminList.createRole('test1');

        expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder(['anonymous', 'admin', 'test1']);

        // This will fail if the role could not be found:
        await RoleAdminList.roleByName('test1').delete();

        expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder(['anonymous', 'admin']);
    });
});
