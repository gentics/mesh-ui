import { AppPage } from '../page-objects/app.po';
import { ListField } from '../page-objects/node-list-field.po';
import { MeshNodeList } from '../page-objects/node-list.po';

describe('node list field', () => {
    let page: AppPage;
    let listField: ListField;
    let nodeList: MeshNodeList;

    beforeEach(async () => {
        page = new AppPage();
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
