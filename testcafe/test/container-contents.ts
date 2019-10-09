import { api } from '../api';
import { adminMainMenu } from '../page-object/admin/admin-main-menu';
import { schemaList } from '../page-object/admin/schema/schema-list';
import { containerContents } from '../page-object/editor/container-contents';
import { nodeEditor } from '../page-object/editor/node-editor';
import { login } from '../page-object/login';
import { paginationControls } from '../page-object/pagination-controls';
import { topnav } from '../page-object/topnav';
import { inTemporaryFolder } from '../testUtil';

import { schemaEditor } from './admin/schema-editor';

fixture`Container contents`.page(api.baseUrl());

const schemaName = 'dummy';
test('Only assigned schemas are visible', async t => {
    await login.loginAsAdmin();

    await topnav.goToAdmin();
    await adminMainMenu.goTo('Schemas');
    await t.click(schemaList.createSchemaButton);

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

test('Current page stays the same after opening Node', async t =>
    inTemporaryFolder(async folder => {
        for (let i = 0; i < 20; i++) {
            await api.createVehicle(folder, `vehicle${i}`);
        }
        await login.loginAsAdmin();
        await containerContents.getListItemByName(folder.fields.name).open();
        await paginationControls.goToPage(2);
        await containerContents.getFirstListItem().open();

        await t.expect(await paginationControls.currentPage()).eql(2, 'Page changed after opening node');
    }));

test('Current page stays the same after saving a node', async t =>
    inTemporaryFolder(async folder => {
        for (let i = 0; i < 20; i++) {
            await api.createVehicle(folder, `vehicle${i}`);
        }
        await login.loginAsAdmin();
        await containerContents.getListItemByName(folder.fields.name).open();
        await paginationControls.goToPage(2);
        await containerContents.getFirstListItem().open();

        await nodeEditor.getStringField('Name').setValue('testName');
        await nodeEditor.save();

        await t
            .expect(containerContents.getListItemByName('testName').element.exists)
            .ok('Could not find node with updated name');

        await t.expect(await paginationControls.currentPage()).eql(2, 'Page changed after opening node');
    }));

test('Current page stays the same after creating a new node', async t =>
    inTemporaryFolder(async folder => {
        for (let i = 0; i < 20; i++) {
            await api.createVehicle(folder, `vehicle${i}`);
        }
        await login.loginAsAdmin();
        await containerContents.getListItemByName(folder.fields.name).open();
        await paginationControls.goToPage(2);

        await containerContents.createNode('vehicle');

        await t.expect(await paginationControls.currentPage()).eql(2, 'Page changed after opening node');

        await nodeEditor.getStringField('Slug').setValue('testName');
        await nodeEditor.getStringField('Name').setValue('testName');
        await nodeEditor.save();

        await t.expect(await paginationControls.currentPage()).eql(2, 'Page changed after creating node');
    }));
