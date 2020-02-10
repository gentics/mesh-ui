import { api } from '../../../api';
import { containerContents } from '../../../page-object/editor/container-contents';
import { nodeEditor } from '../../../page-object/editor/node-editor';
import { login } from '../../../page-object/login';
import { toast } from '../../../page-object/toast';
import { inTemporaryFolder } from '../../../testUtil';

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
