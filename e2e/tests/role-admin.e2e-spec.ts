import * as page from '../page-objects/app.po';
import { RoleAdminList } from '../page-objects/role-admin/role-admin-list.po';

describe('role admin list', () => {
    beforeEach(async () => {
        await page.navigateToRoleAdmin();
    });

    it('shows all roles', async () => {
        expect(await RoleAdminList.pagination().displayedPages()).toEqual([1]);
        expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder([
            'Editor Role',
            'Client Role',
            'anonymous',
            'admin'
        ]);
    });

    it('creates roles', async () => {
        await RoleAdminList.createRole('test1');

        expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder([
            'Editor Role',
            'Client Role',
            'anonymous',
            'admin',
            'test1'
        ]);

        // This will fail if the role could not be found:
        await RoleAdminList.roleByName('test1').delete();

        expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder([
            'Editor Role',
            'Client Role',
            'anonymous',
            'admin'
        ]);
    });

    it('removes and adds roles', async () => {
        const editor = await RoleAdminList.roleByName('Editor Role');
        expect(await editor.roleNames()).toEqualInAnyOrder(['Editor Role', 'admin']);
        await editor.removeRole('Editor Role');
        expect(await editor.roleNames()).toEqualInAnyOrder(['admin']);
        await editor.addRole('Editor Role');
        expect(await editor.roleNames()).toEqualInAnyOrder(['admin', 'Editor Role']);
    });

    describe('filter', () => {
        it('ignores case', async () => {
            await RoleAdminList.setFilterQuery('role');
            expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder(['Editor Role', 'Client Role']);
        });

        it('filters by role', async () => {
            expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder([
                'Editor Role',
                'Client Role',
                'anonymous',
                'admin'
            ]);
            await RoleAdminList.setRoleFilter('admin');
            expect(await RoleAdminList.displayedRoleNames()).toEqualInAnyOrder(['Editor Role', 'Client Role', 'admin']);
        });
    });
});
