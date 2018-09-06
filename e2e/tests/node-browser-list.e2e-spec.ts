import { by, element } from '../../node_modules/protractor';
import { AppPage } from '../page-objects/app.po';
import { NodeBrowserList } from '../page-objects/node-browser-list.po';
import { NodeField } from '../page-objects/node-field.po';
import { MeshNodeList } from '../page-objects/node-list.po';

describe('node browser list', () => {
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

    it('should show checkbox if it is checked', async () => {
        await nodeField.clickSelect(3);
        await nodeField.getBreadcrumbLink().click();
        await nodeField.getFolderButton('Vehicle Images').click();
        await nodeBrowserList.clickFirstCheckbox();

        await expect(
            element
                .all(by.css('gtx-checkbox'))
                .first()
                .getCssValue('opacity')
        ).toBeGreaterThan(0.5);
    });
});
