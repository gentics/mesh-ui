import { api } from '../api';
import { navigate } from '../navigate';
import { containerContents } from '../page-object/editor/container-contents';
import { topnav } from '../page-object/topnav';
import { Admin } from '../roles';
import { selectors } from '../selectors';

import { schemaEditor } from './admin/schema-editor';

fixture`Container contents`.page(api.baseUrl());

const schemaName = 'dummy';
test.only('Only assigned schemas are visible', async t => {
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
