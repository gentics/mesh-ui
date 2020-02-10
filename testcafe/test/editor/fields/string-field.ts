import { api } from '../../../api';
import { containerContents } from '../../../page-object/editor/container-contents';
import { nodeEditor } from '../../../page-object/editor/node-editor';
import { login } from '../../../page-object/login';
import { schemas } from '../../../schemas';
import { inTemporaryFolder, requiresSchema } from '../../../testUtil';

fixture`String Field`.page(api.baseUrl());

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
