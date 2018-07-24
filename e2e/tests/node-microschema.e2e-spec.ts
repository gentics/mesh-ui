import { AppPage } from '../page-objects/app.po';
import { NodeAdmin } from '../page-objects/node-admin.po';
import { NodeMicroschema } from '../page-objects/node-microschema.po';

describe('node microschema', () => {
    let admin: NodeAdmin;
    let page: AppPage;
    let microschema: NodeMicroschema;

    beforeEach(async () => {
        admin = new NodeAdmin();
        page = new AppPage();
        microschema = new NodeMicroschema();
        await page.navigateToHome();
        await admin.modeChange();
        await microschema.openMicroschema();
    });

    it('should equal microschema names', async () => {
        const list: Array<String> = ['test', 'test3'];

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
        await expect(microschema.checkedCount().getText()).toEqual('Selected: 2');
    });

    it('should show a right breadcrumb after creating a new microschema', async () => {
        const breadcrumbs: Array<String> = ['Microschemas', 'New microschema'];

        await microschema.createNewMicroschemaClick();
        await expect(microschema.getBreadcrumbs()).toEqual(breadcrumbs);
    });

    it('should show a right project allocation for some microschema', async () => {
        const projects: Array<String> = ['demo'];

        await microschema.clickSomeMicroschema('test3');
        await microschema.clickAllocationsTab();
        await expect(microschema.getProjectsName()).toEqual(projects);
    });

    it('should show a right breadcrumb after clicking on "create microschema" and going back to a microschema list', async () => {
        const breadcrumb: Array<String> = ['Microschemas'];

        await microschema.createNewMicroschemaClick();
        await microschema.openMicroschema();

        await expect(microschema.getBreadcrumbs()).toEqual(breadcrumb);
    });

    it('should create a new schema and delete it (using bottom button)', async () => {
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

        await microschema.giveMicroschemaInfo(microschemaInfo);
        await microschema.clickSaveButton();

        await microschema.openMicroschema();

        await microschema.setFilterText('test4');

        await expect(microschema.getAllMicroschemasName()).toEqual(microschemaName);

        await microschema.clickSomeMicroschema('test4');
        await microschema.clickDeleteButton();

        await microschema.openMicroschema();
        await microschema.setFilterText('test4');

        await expect(microschema.getAllMicroschemasName()).toEqual(test);
    });

    it('should create a new schema and delete it (using top button)', async () => {
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

        await microschema.giveMicroschemaInfo(microschemaInfo);
        await microschema.clickSaveButton();

        await microschema.openMicroschema();

        await microschema.setFilterText('test4');

        await expect(microschema.getAllMicroschemasName()).toEqual(microschemaName);

        await microschema.chooseMicroschema();

        await microschema.clickDeleteTopButton();
        await microschema.clickDeleteButton();

        await microschema.openMicroschema();
        await microschema.setFilterText('test4');

        await expect(microschema.getAllMicroschemasName()).toEqual(test);
    });

    it('should goes to the next page and show right microschema', async () => {
        const microschemaName: Array<String> = ['test2'];
        await microschema.goToNextPage();

        await expect(microschema.getAllMicroschemasName()).toEqual(microschemaName);
    });
});
