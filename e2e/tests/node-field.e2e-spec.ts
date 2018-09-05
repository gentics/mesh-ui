import { AppPage } from '../page-objects/app.po';
import * as browser from '../page-objects/node-browser.po';
import { NodeField } from '../page-objects/node-field.po';
import { MeshNodeList } from '../page-objects/node-list.po';

describe('node field', () => {
    let page: AppPage;
    let nodeField: NodeField;
    let nodeList: MeshNodeList;

    beforeEach(async () => {
        page = new AppPage();
        nodeField = new NodeField();
        nodeList = new MeshNodeList();
        await page.navigateToHome();
    });

    it('should show the right node for vehicleImages', async () => {
        await nodeList.openFolder('Yachts');
        await nodeList.editNode('Pelorus');
        await nodeField.getBrowseButton().click();
        await nodeField.getBreadcrumbLink().click();
        await nodeField.getFolderButton('Vehicle Images').click();
        await nodeField.getFirstCheckbox().click();
        await browser.choose();

        await expect(await nodeField.getPath().getText()).toEqual('demo › Vehicle Images › Space Shuttle Image');
    });
});
