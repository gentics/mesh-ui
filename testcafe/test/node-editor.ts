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
