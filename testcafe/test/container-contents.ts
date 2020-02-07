import { ClientFunction } from 'testcafe';

import { MeshWindow } from '../../src/app/core/providers/config/config.service';
import { api } from '../api';
import { adminMainMenu } from '../page-object/admin/admin-main-menu';
import { schemaList } from '../page-object/admin/schema/schema-list';
import { paginationControls } from '../page-object/common/pagination-controls';
import { containerContents } from '../page-object/editor/container-contents';
import { nodeEditor } from '../page-object/editor/node-editor';
import { login } from '../page-object/login';
import { topnav } from '../page-object/topnav';
import { inTemporaryFolder, Writeable } from '../testUtil';

import { schemaEditor } from './admin/schema-editor';

declare const window: Writeable<MeshWindow>;

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

test('Per page items configuration', async t =>
    inTemporaryFolder(async folder => {
        const perPageItems = 20;
        for (let i = 0; i <= perPageItems; i++) {
            await api.createVehicle(folder, `vehicle${i}`);
        }
        await ClientFunction(() => (window.MeshUiConfig.contentItemsPerPage = perPageItems), {
            dependencies: {
                perPageItems
            }
        })();
        await login.loginAsAdmin();
        await containerContents.getListItemByName(folder.fields.name).open();

        await t
            .expect(await containerContents.getNumberOfItems())
            .eql(perPageItems, 'Number of items displayed is lower then the configured itemsPerPage');
    }));

test('Page is reset after changing folder', async t =>
    inTemporaryFolder(async folder => {
        for (let i = 0; i < 20; i++) {
            const subFolder = await api.createFolder(folder, `folder${i}`);
            await api.createFolder(subFolder, `subFolder`);
        }
        await login.loginAsAdmin();
        await containerContents.getListItemByName(folder.fields.name).open();
        await paginationControls.goToPage(2);
        await containerContents.getFirstListItem().open();
        await t
            .expect(await containerContents.getFirstListItem().displayName())
            .eql('subFolder')
            .expect(await paginationControls.exists())
            .eql(false);
        }));

test('Display name of nodes', async t =>
    inTemporaryFolder(async folder => {
        const nameOnly = await api.createFolder(folder, { name: 'test1' });
        const slugOnly = await api.createFolder(folder, { slug: 'test2' });
        const both = await api.createFolder(folder, { name: 'test3', slug: 'shouldNotBeSeen' });
        const none = await api.createFolder(folder, {});

        await login.loginAsAdmin();
        await containerContents.getListItemByName(folder.fields.name).open();

        await t
            .expect(await containerContents.getNumberOfItems())
            .eql(4)
            .expect(await containerContents.getListItemByName('test1').element.exists)
            .eql(true)
            .expect(await containerContents.getListItemByName(slugOnly.uuid).element.exists)
            .eql(true)
            .expect(await containerContents.getListItemByName('test3').element.exists)
            .eql(true)
            .expect(await containerContents.getListItemByName(none.uuid).element.exists)
            .eql(true)
            .expect(await containerContents.getListItemByName('shouldNotBeSeen').element.exists)
            .eql(false);
    }));
