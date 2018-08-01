import { AppPage } from '../page-objects/app.po';
import { NodeAdmin } from '../page-objects/node-admin.po';
import { NodeMicroschema } from '../page-objects/node-microschema.po';

import { createMicroschema, deleteMicroschema } from '../api';

describe('node microschema', () => {
    let admin: NodeAdmin;
    let page: AppPage;
    let microschema: NodeMicroschema;

    beforeAll(async () => {
        for (let i = 1; i <= 10; i++) {
            await createMicroschema('test' + i);
        }
    });

    /*
    afterAll(async () => {
        await deleteMicroschema(schema.uuid, 'test1');
        await deleteMicroschema(schema.uuid, 'test2');
        await deleteMicroschema(schema.uuid, 'test3');
    });
    */

    beforeEach(async () => {
        admin = new NodeAdmin();
        page = new AppPage();
        microschema = new NodeMicroschema();
        await page.navigateToHome();
        await admin.modeChange();
        await microschema.openMicroschema();
    });

    it('should show the correct microschema names', async () => {
        const list: Array<String> = [];

        await expect(microschema.getAllMicroschemasName()).toEqual(list);
    });

    it('should give right filter results', async () => {
        const test: Array<String> = ['test', 'test3'];
        const test2: Array<String> = ['test2'];

        await microschema.setFilterText('te');
        await expect(microschema.getAllMicroschemasName()).toEqual(test);

        await microschema.clearFilterText();

        await microschema.setFilterText('2');
        await expect(microschema.getAllMicroschemasName()).toEqual(test2);
    });

    it('should show right number of selected microschemas', async () => {
        await microschema.checkAllMicroschemas();
        await expect(microschema.checkedCount().getText()).toEqual('Selected: 0');
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
        const microschemaName: Array<String> = ['test4'];
        const microschemaInfo = `{
            "name": "test4",
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

        await microschema.setMicroschemaJSON(microschemaInfo);
        await microschema.clickSaveButton();

        await microschema.openMicroschema();

        await microschema.setFilterText('test4');

        await expect(microschema.getAllMicroschemasName()).toEqual(microschemaName);

        await microschema.chooseMicroschema();

        await microschema.clickDeleteTopButton();
        await microschema.clickDialogDeleteButton();

        await expect(microschema.checkedCount().getText()).toEqual('Selected: 0');

        await microschema.clearFilterText();

        await microschema.setFilterText('test4');

        await expect(microschema.getAllMicroschemasName()).toEqual(test);
    });

    it('should go to the next page and show right microschema', async () => {
        const microschemaName: Array<String> = ['test2'];
        await microschema.goToNextPage();

        await expect(microschema.getAllMicroschemasName()).toEqual(microschemaName);
    });
});
