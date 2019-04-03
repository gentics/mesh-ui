import { browser } from 'protractor';

import { Microschema } from '../../src/app/common/models/microschema.model';
import { createMicroschema, deleteMicroschema } from '../api';
import * as page from '../page-objects/app.po';
import { NodeAdmin } from '../page-objects/node-admin.po';
import { NodeMicroschema } from '../page-objects/node-microschema.po';

describe('node microschema', () => {
    let admin: NodeAdmin;
    let microschema: NodeMicroschema;

    const microschemaModel: Array<Microschema> = [];

    beforeAll(async () => {
        for (let i = 1; i <= 11; i++) {
            microschemaModel.push(await createMicroschema('test' + i));
        }
    });

    afterAll(async () => {
        for (let i = 0; i < 11; i++) {
            await deleteMicroschema(microschemaModel[i]);
        }
    });

    beforeEach(async () => {
        admin = new NodeAdmin();
        microschema = new NodeMicroschema();
        await page.navigateToHome();
        await admin.modeChange();
        await microschema.openMicroschema();
    });

    it('should give right filter results', async () => {
        const test: Array<String> = ['test3'];
        const test2: Array<String> = ['test2'];

        await microschema.setFilterText('test3');
        await expect(microschema.getAllMicroschemasName()).toEqual(test);

        await microschema.clearFilterText();

        await microschema.setFilterText('2');
        await expect(microschema.getAllMicroschemasName()).toEqual(test2);
    });

    it('should show right number of selected microschemas', async () => {
        // TODO:
        // Current implementation selects all list items available instead per page.
        // Should only select all items of visivle page
        await microschema.checkAllMicroschemas();
        await expect(microschema.checkedCount().getText()).toEqual('Selected: 11');
    });

    it('should show a right breadcrumb after creating a new microschema', async () => {
        const breadcrumbs: Array<String> = ['Microschemas', 'New microschema'];

        await microschema.createNewMicroschemaClick();
        await expect(admin.getBreadcrumbs()).toEqual(breadcrumbs);
    });

    it('should show a right project allocation for some microschema', async () => {
        const projects: Array<String> = ['demo'];

        await microschema.clickMicroschema('test3');
        await microschema.clickAllocationsTab();
        await expect(microschema.getProjectNames()).toEqual(projects);
    });

    it('should show a right breadcrumb after clicking on "create microschema" and going back to a microschema list', async () => {
        const breadcrumb: Array<String> = ['Microschemas'];

        await microschema.createNewMicroschemaClick();
        await microschema.openMicroschema();

        await expect(admin.getBreadcrumbs()).toEqual(breadcrumb);
    });

    it('should create a new schema and delete it (using top button) with selected items check', async () => {
        const test: Array<String> = [];
        const microschemaName: Array<String> = ['test12'];
        const microschemaInfo = `{
            "name": "test12",
            "fields": [
                {
                    "name": "name",
                    "label": "Name",
                    "required": true,
                    "type": "string"
                }
            ]
        }`;

        await microschema.createNewMicroschemaClick();
        await microschema.clickJsonEditorTab();

        await microschema.setMicroschemaJSON(microschemaInfo);
        await microschema.clickAnywhere();

        await microschema.clickCreateButton();
        await microschema.clickModalNo();

        await microschema.openMicroschema();

        await microschema.setFilterText('test12');

        await expect(microschema.getAllMicroschemasName()).toEqual(microschemaName);

        await microschema.chooseMicroschema();

        await microschema.clickDeleteTopButton();
        await microschema.clickDialogDeleteButton();

        await expect(microschema.checkedCount().getText()).toEqual('Selected: 0');

        await microschema.clearFilterText();

        await microschema.setFilterText('test12');

        await expect(microschema.getAllMicroschemasName()).toEqual(test);
    });

    it('should go to the next page and show right microschema', async () => {
        const link: String = '#/admin/microschemas?p=2';
        await microschema.goToNextPage();

        await expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + link);
    });
});
