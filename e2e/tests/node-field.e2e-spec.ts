import { AppPage } from '../page-objects/app.po';
import { NodeBrowserList } from '../page-objects/node-browser-list.po';
import * as browser from '../page-objects/node-browser.po';
import { NodeField } from '../page-objects/node-field.po';
import { MeshNodeList } from '../page-objects/node-list.po';

describe('node field', () => {
    let page: AppPage;
    let nodeField: NodeField;
    let nodeList: MeshNodeList;
    let nodeBrowserList: NodeBrowserList;

    beforeEach(async () => {
        page = new AppPage();
        nodeField = new NodeField();
        nodeList = new MeshNodeList();
        nodeBrowserList = new NodeBrowserList();
        await page.navigateToHome();
        await nodeList.openFolder('Yachts');
        await nodeList.editNode('Pelorus');
    });

    it('should show the right node for vehicleImages', async () => {
        await nodeField.clickSelect(3);
        await nodeField.getBreadcrumbLink().click();
        await nodeField.getFolderButton('Vehicle Images').click();
        await nodeBrowserList.clickFirstCheckbox();
        await browser.choose();
        await nodeField.clickSave();

        await expect(await nodeField.getPath().getText()).toEqual('demo › Vehicle Images › Space Shuttle Image');
    });

    it('should go to the node by clicking on the node name', async () => {
        await nodeField.clickNodeName();

        await expect(await nodeField.getDisplayName().getText()).toEqual('Space Shuttle Image');
    });

    it('should show the select node reference button if delete button was clicked', async () => {
        await nodeField.clickDelete();
        await nodeField.clickSave();

        await expect(await nodeField.getSelectButton()).toBeDefined();
    });

    it('should show the folder icon by choosing some folder', async () => {
        await nodeField.clickSelect(4);
        await nodeField.getBreadcrumbLink().click();
        await nodeBrowserList.clickFirstCheckbox();
        await browser.choose();

        await expect(await nodeField.getIcon().getText()).toEqual('folder');
    });
});
