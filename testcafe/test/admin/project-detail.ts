import { api } from '../../api';
import { projectDetail } from '../../page-object/admin/project/project-detail';
import { adminList } from '../../page-object/common/admin-list';
import { login } from '../../page-object/login';
import { topnav } from '../../page-object/topnav';

fixture`Project detail`.page(api.baseUrl());

test('Schema assignment', async t => {
    await login.loginAsAdmin();
    await topnav.goToAdmin();
    await adminList.getItemByName('demo').open();
    await projectDetail.openTab('SCHEMAS');
    const schemas = await adminList.getAllItems();
    for (const schema of schemas) {
        await t.expect(await schema.isChecked()).eql(true);
    }
    const firstSchema = schemas[0];

    await firstSchema.toggleCheck();
    await t.expect(await firstSchema.isChecked()).eql(false);
    await firstSchema.toggleCheck();
    await t.expect(await firstSchema.isChecked()).eql(true);
});
