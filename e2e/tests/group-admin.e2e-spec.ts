import * as page from '../page-objects/app.po';
import { GroupAdminList } from '../page-objects/group-admin/group-admin-list.po';

describe('group admin list', () => {
    beforeEach(async () => {
        await page.navigateToGroupAdmin();
    });

    it('shows all groups', async () => {
        expect(await GroupAdminList.pagination().displayedPages()).toEqual([1]);
        expect(await GroupAdminList.displayedGroupNames()).toEqualInAnyOrder([
            'Editor Group',
            'Client Group',
            'anonymous',
            'admin'
        ]);
    });

    it('creates groups', async () => {
        await GroupAdminList.createGroup('test1');

        expect(await GroupAdminList.displayedGroupNames()).toEqualInAnyOrder([
            'Editor Group',
            'Client Group',
            'anonymous',
            'admin',
            'test1'
        ]);

        // This will fail if the group could not be found:
        await GroupAdminList.groupByName('test1').delete();

        expect(await GroupAdminList.displayedGroupNames()).toEqualInAnyOrder([
            'Editor Group',
            'Client Group',
            'anonymous',
            'admin'
        ]);
    });

    it('removes and adds roles', async () => {
        const editor = await GroupAdminList.groupByName('Editor Group');
        expect(await editor.roleNames()).toEqualInAnyOrder(['Editor Role', 'admin']);
        await editor.removeRole('Editor Role');
        expect(await editor.roleNames()).toEqualInAnyOrder(['admin']);
        await editor.addRole('Editor Role');
        expect(await editor.roleNames()).toEqualInAnyOrder(['admin', 'Editor Role']);
    });

    xdescribe('filter', () => {
        // TODO: make search case-insensitive!
        it('ignores case', async () => {
            await GroupAdminList.setFilterQuery('group');
            expect(await GroupAdminList.displayedGroupNames()).toEqualInAnyOrder(['Editor Group', 'Client Group']);
        });

        // TODO: implement functionality (dropdown filter input)
        it('filters by role', async () => {
            expect(await GroupAdminList.displayedGroupNames()).toEqualInAnyOrder([
                'Editor Group',
                'Client Group',
                'anonymous',
                'admin'
            ]);
            await GroupAdminList.setRoleFilter('admin');
            expect(await GroupAdminList.displayedGroupNames()).toEqualInAnyOrder([
                'Editor Group',
                'Client Group',
                'admin'
            ]);
        });
    });
});
