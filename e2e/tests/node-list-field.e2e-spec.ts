import * as page from '../page-objects/app.po';
import * as editor from '../page-objects/node-editor.po';
import { ListField } from '../page-objects/node-list-field.po';
import * as nodeList from '../page-objects/node-list.po';
import { SingleNodeFieldList } from '../schemas';
import { inTemporaryFolder, requiresSchema } from '../testUtil';

describe(
    'node list field',
    requiresSchema(SingleNodeFieldList, schema => {
        beforeEach(async () => {
            await page.navigateToHome();
        });

        xdescribe('temp', () => {
            let listField: ListField;

            beforeEach(async () => {
                listField = new ListField();
                await page.navigateToHome();
                await nodeList.openFolder('Yachts');
                await nodeList.editNode('Pelorus');
            });

            it('should show select button by clicking on add button', async () => {
                await listField.clickAddReference();

                expect(await listField.getSelectButton().isPresent()).toBe(true);
            });
        });

        it(
            'saves an empty list',
            inTemporaryFolder(async folder => {
                await page.navigateToFolder(folder);
                await nodeList.createNode(schema.name);
                await editor.save();
                const node = await editor.fetchCurrentNode();
                expect(node.fields.nodes).toEqual([]);
            })
        );
    })
);
