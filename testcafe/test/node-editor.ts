import { api } from '../api';
import { assert } from '../assert';
import * as microschemas from '../microschemas';
import { containerContents } from '../page-object/editor/container-contents';
import { nodeBrowser } from '../page-object/editor/node-browser/node-browser';
import { nodeEditor } from '../page-object/editor/node-editor';
import { login } from '../page-object/login';
import { toast } from '../page-object/toast';
import { schemas } from '../schemas';
import { inTemporaryFolder, requiresMicroSchema, requiresSchema } from '../testUtil';

fixture`Node Editing`.page(api.baseUrl());

test('Create empty node of all possible fields', async t =>
    requiresMicroSchema(microschemas.allMicroFields, () =>
        requiresSchema(schemas.allFields, schema =>
            inTemporaryFolder(async parent => {
                await login.loginAsAdmin();
                await containerContents.getListItemByName(parent.fields.name).open();
                await containerContents.createNode(schema.name);
                await nodeEditor.save();

                const node = await api.findNodeByUuid(await nodeEditor.getCurrentNodeUuid());
                await assert.forAll(node.fields, assert.isEmpty);
            })
        )
    ));

test('Display node path', async t => {
    await login.loginAsAdmin();
    await containerContents.getListItemByName('Aircraft').open();
    await containerContents.getListItemByName('Space Shuttle').open();
    await nodeEditor.showPath();
    await t.expect(await nodeEditor.getNodePath()).eql('/aircrafts/space-shuttle');
});

test('Create language version of node', async t =>
    inTemporaryFolder(async parent => {
        const node = await api.createVehicle(parent, 'TestVehicle');

        await login.loginAsAdmin();

        await containerContents.getListItemByName(parent.fields.name).open();
        await containerContents.getListItemByName('TestVehicle').open();

        await nodeEditor.createLanguageVersion('German');

        const nodeDE = await api.findNodeByUuid(node.uuid, 'de');

        await t
            .expect(nodeDE.language)
            .eql('de')
            .expect(nodeDE.fields.name)
            .eql('TestVehicle-DE')
            .expect(nodeDE.fields.slug)
            .eql('TestVehicle-DE');
    }));

// https://github.com/gentics/mesh-ui/issues/253
test('Changing number field', async t =>
    inTemporaryFolder(async parent => {
        const node = await api.createVehicle(parent, 'TestVehicle');

        await login.loginAsAdmin();
        await containerContents.getListItemByName(parent.fields.name).open();
        await containerContents.getListItemByName(node.fields.name).open();
        await nodeEditor.getNumberField('Weight').setValue(123);
        await nodeEditor.save();

        await toast.expectSuccessMessage('Node successfully saved');
    }));

// https://github.com/gentics/mesh-ui/issues/256
test('String field with allowed values', async t =>
    requiresSchema(schemas.AllowedStringField, async schema =>
        inTemporaryFolder(async parent => {
            const node = await api.createNode(parent, schema.name, { requiredChoose: 'option1' });
            await login.loginAsAdmin();

            await containerContents.getListItemByName(parent.fields.name).open();
            await containerContents.getListItemByName('undefined').open();

            await nodeEditor.getStringField('name').setValue('testName');
            await nodeEditor.getOptionStringField('choose').setValue('option2');
            await nodeEditor.getOptionStringField('requiredChoose').setValue('option3');
            await nodeEditor.save();

            const updatedNode = await api.findNodeByUuid(node.uuid);

            await t
                .expect(updatedNode.fields.name)
                .eql('testName', 'Field was not updated')
                .expect(updatedNode.fields.choose)
                .eql('option2', 'Field was not updated')
                .expect(updatedNode.fields.requiredChoose)
                .eql('option3', 'Field was not updated');
        })
    ));

// https://github.com/gentics/mesh-ui/issues/250
test('Choose node dialog usability', async t => {
    await login.loginAsAdmin();
    await containerContents.getListItemByName('Aircraft').open();
    await containerContents.getListItemByName('Space Shuttle').open();
    await nodeEditor.getNodeField('Vehicle Image').chooseNode();

    await t
        .expect(nodeBrowser.chooseButton.hasAttribute('disabled'))
        .ok('Choose button must be disabled if no node is chosen');

    await nodeBrowser.breadcrumbs.goTo('demo');
    await nodeBrowser.getNodeRow('Vehicle Images').open();

    const row = nodeBrowser.getNodeRow('Pelorus Image');
    await t.hover(row.element);

    await t.expect(row.checkBox.visible).ok('Checkbox must be visible when hovering row');
});
