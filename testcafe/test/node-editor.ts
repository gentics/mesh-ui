import { api } from '../api';
import { assert } from '../assert';
import * as microschemas from '../microschemas';
import { navigate } from '../navigate';
import { containerContents } from '../page-object/editor/container-contents';
import { nodeEditor } from '../page-object/editor/node-editor';
import { Admin } from '../roles';
import * as schemas from '../schemas';
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
