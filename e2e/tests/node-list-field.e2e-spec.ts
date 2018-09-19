import * as page from '../page-objects/app.po';
import { ListField } from '../page-objects/node-list-field.po';
import { MeshNodeList } from '../page-objects/node-list.po';
import { SingleHtmlFieldList, SingleNodeFieldList } from '../schemas';
import { inTemporaryFolder, requiresSchema } from '../testUtil';

describe(
    'node list field',
    requiresSchema(SingleNodeFieldList, schema => {
        xdescribe('temp', () => {
            let listField: ListField;
            let nodeList: MeshNodeList;

            beforeEach(async () => {
                listField = new ListField();
                nodeList = new MeshNodeList();
                await page.navigateToHome();
                await nodeList.openFolder('Yachts');
                await nodeList.editNode('Pelorus');
            });

            it('should show select button by clicking on add button', async () => {
                await listField.clickAddReference();

                expect(await listField.getSelectButton().isPresent()).toBe(true);
            });
        });

        it('saves an empty list', inTemporaryFolder(folder => {}));
    })
);
