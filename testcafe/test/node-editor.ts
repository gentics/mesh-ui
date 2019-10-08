import { api } from '../api';
import { assert } from '../assert';
import * as microschemas from '../microschemas';
import { navigate } from '../navigate';
import { containerContents } from '../page-object/editor/container-contents';
import { nodeEditor } from '../page-object/editor/node-editor';
import { toast } from '../page-object/toast';
import { Admin } from '../roles';
import { schemas } from '../schemas';
import { inTemporaryFolder, requiresMicroSchema, requiresSchema } from '../testUtil';

fixture`Node Editing`.page(api.baseUrl());

test('Create empty node of all possible fields', async t =>
    requiresMicroSchema(microschemas.allMicroFields, () =>
        requiresSchema(schemas.allFields, schema =>
            inTemporaryFolder(async parent => {
                await t.useRole(Admin);
                await navigate.toFolder(parent);
                await containerContents.createNode(schema.name);
                await nodeEditor.save();

                const node = await api.findNodeByUuid(await nodeEditor.getCurrentNodeUuid());
                await assert.forAll(node.fields, assert.isEmpty);
            })
        )
    ));

test('Display node path', async t => {
    await t.useRole(Admin);
    await containerContents.getListItemByName('Aircraft').open();
    await containerContents.getListItemByName('Space Shuttle').open();
    await nodeEditor.showPath();
    await t.expect(await nodeEditor.getNodePath()).eql('/aircrafts/space-shuttle');
});

test('Create language version of node', async t =>
    inTemporaryFolder(async parent => {
        const node = await api.createVehicle(parent, 'TestVehicle');

        await t.useRole(Admin);

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

        await t.useRole(Admin);
        await navigate.toNodeEdit(node);
        await nodeEditor.getNumberField('Weight').setValue(123);
        await nodeEditor.save();

        await toast.expectSuccessMessage('Node successfully saved');
    }));

// https://github.com/gentics/mesh-ui/issues/256
test.only('String field with allowed values', async t =>
    requiresSchema(schemas.AllowedStringField, async schema =>
        inTemporaryFolder(async parent => {
            const node = await api.createNode(parent, schema.name);
            await t.debug();

            await t.useRole(Admin);
            await navigate.toNodeEdit(node);
            await nodeEditor.getOptionStringField('choose').setValue('option2');
            await nodeEditor.save();

            await toast.expectSuccessMessage('Node successfully saved');

            const uuid = await nodeEditor.getCurrentNodeUuid();
            const updatedNode = await api.findNodeByUuid(uuid);

            await t.expect(updatedNode.fields.choose).eql('option2', 'Field was not updated');
        })
    ));
