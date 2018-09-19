import { by, element } from 'protractor';

import * as page from '../page-objects/app.po';
import { NodeBrowserList } from '../page-objects/node-browser-list.po';
import * as browser from '../page-objects/node-browser.po';
import { NodeField } from '../page-objects/node-field.po';
import * as nodeList from '../page-objects/node-list.po';

describe('node browser list', () => {
    let nodeField: NodeField;
    let nodeBrowserList: NodeBrowserList;

    beforeEach(async () => {
        nodeField = new NodeField();
        nodeBrowserList = new NodeBrowserList();
        await page.navigateToHome();
        await nodeList.openFolder('Yachts');
        await nodeList.editNode('Pelorus');
    });

    it('should show checkbox if it is checked', async () => {
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

        await expect(
            element
                .all(by.css('gtx-checkbox'))
                .first()
                .getCssValue('opacity')
        ).toBeGreaterThan(0.5);
    });
});
