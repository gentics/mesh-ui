import * as api from '../api';
import * as page from '../page-objects/app.po';
import { NodeBrowserList } from '../page-objects/node-browser-list.po';
import * as browser from '../page-objects/node-browser.po';
import * as nodeEditor from '../page-objects/node-editor.po';
import { NodeField } from '../page-objects/node-field.po';
import * as nodeList from '../page-objects/node-list.po';
import { temporaryNodeChanges } from '../testUtil';

describe('node field', () => {
    let nodeField: NodeField;
    let nodeBrowserList: NodeBrowserList;

    beforeEach(async () => {
        nodeField = new NodeField();
        nodeBrowserList = new NodeBrowserList();
        await page.navigateToHome();
        await nodeList.openFolder('Yachts');
        await nodeList.editNode('Pelorus');
    });

    it('should show the right node for vehicleImages', async () => {
        await nodeField
            .getSelectButton()
            .get(0)
            .click();
        await browser
            .getBreadcrumbLinks()
            .get(0)
            .click();
        await browser.openFolder('Vehicle Images');
        await nodeBrowserList.clickFirstCheckbox();
        await browser.choose();
        await nodeEditor.save();

        await expect(await nodeField.getPath().getText()).toEqual('demo › Vehicle Images › Space Shuttle Image');
    });

    it('should go to the node by clicking on the node name', async () => {
        await nodeField.clickNodeName('Space Shuttle Image');

        await expect(await nodeField.getDisplayName().getText()).toEqual('Space Shuttle Image');
    });

    it('should show the select node reference button if delete button was clicked', async () => {
        await nodeField.clickDelete();
        await nodeEditor.save();

        await expect(
            await nodeField
                .getSelectButton()
                .get(0)
                .isPresent()
        ).toBe(true);
    });

    it('should show the folder icon by choosing some folder', async () => {
        await nodeField
            .getSelectButton()
            .get(1)
            .click();
        await browser
            .getBreadcrumbLinks()
            .get(0)
            .click();
        await nodeBrowserList.clickFirstCheckbox();
        await browser.choose();

        await expect(await nodeField.getIcon().getText()).toEqual('folder');
    });

    it('should actually save the reference', async () => {
        const uuid = '61a0c5efaee349d4a0c5efaee349d4ed';
        await nodeField
            .getSelectButton()
            .get(0)
            .click();
        await browser
            .getBreadcrumbLinks()
            .get(0)
            .click();
        await browser.openFolder('Vehicle Images');
        await nodeBrowserList.clickFirstCheckbox();
        await browser.choose();

        await temporaryNodeChanges(uuid, async () => {
            await nodeEditor.save();

            const node = await api.findNodeByUuid(uuid);
            expect(node.displayName).toEqual('Space Shuttle Image');

            await nodeField.clickDelete();
            await nodeEditor.save();
        });
    });
});
