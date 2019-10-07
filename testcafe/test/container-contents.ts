import { api } from '../api';
import { navigate } from '../navigate';
import { containerContents } from '../page-object/editor/container-contents';
import { paginationControls } from '../page-object/pagination-controls';
import { topnav } from '../page-object/topnav';
import { Admin } from '../roles';
import { inTemporaryFolder } from '../testUtil';

import { schemaEditor } from './admin/schema-editor';

fixture`Container contents`.page(api.baseUrl());

const schemaName = 'dummy';
test('Only assigned schemas are visible', async t => {
    await t.useRole(Admin);

    await navigate.toAdminSchemaEditorNew();

    await schemaEditor.setName(schemaName);
    await schemaEditor.create();

    t.ctx.created = true;

    await topnav.goHome();

    await t.click(containerContents.createNodeButton());
    await t
        .expect(containerContents.createNodeSchema(schemaName).exists)
        .notOk(`Schema ${schemaName} can be used to create a new node`);
}).after(async t => {
    if (t.ctx.created) {
        await api.deleteSchema(await api.getSchemaByName(schemaName));
    }
});

test.only('Current page stays the same after opening Node', async t =>
    inTemporaryFolder(async folder => {
        for (let i = 0; i < 50; i++) {
            await api.createVehicle(folder, `vehicle${i}`);
        }
        await t.useRole(Admin);
        await navigate.toFolder(folder);
        await paginationControls.goToPage(2);
        await containerContents.getFirstListItem().open();

        await t.expect(await paginationControls.currentPage()).eql(2, 'Page changed after opening node');
    }));
