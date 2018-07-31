import { AppPage } from '../page-objects/app.po';
import { NodeAdmin } from '../page-objects/node-admin.po';
import { NodeSchema } from '../page-objects/node-schema.po';

describe('node schema', () => {
    let admin: NodeAdmin;
    let page: AppPage;
    let schema: NodeSchema;

    beforeEach(async () => {
        admin = new NodeAdmin();
        page = new AppPage();
        schema = new NodeSchema();
        await page.navigateToHome();
        await admin.modeChange();
        await schema.openSchema();
    });

    it('should show the correct schema names', async () => {
        const list: Array<String> = ['category', 'vehicleImage', 'vehicle', 'binary_content', 'folder'];

        await expect(schema.getAllSchemasName()).toEqual(list);
    });

    it('should give right filter results', async () => {
        const category: Array<String> = ['category'];
        const binary: Array<String> = ['binary_content'];

        await schema.setFilterText('cat');
        await expect(schema.getAllSchemasName()).toEqual(category);

        await schema.clearFilterText();

        await schema.setFilterText('bi');
        await expect(schema.getAllSchemasName()).toEqual(binary);
    });

    it('should show right number of selected schemas', async () => {
        await schema.checkAllSchemas();
        await expect(schema.checkedCount().getText()).toEqual('Selected: 5');
    });

    it('should show a right breadcrumb after creating a new schema', async () => {
        const breadcrumbs: Array<String> = ['Schemas', 'New schema'];

        await schema.createNewSchemaClick();
        await expect(admin.getBreadcrumbs()).toEqual(breadcrumbs);
    });

    it('should show a right project allocation for some schema', async () => {
        const projects: Array<String> = ['demo'];

        await schema.clickSchema('folder');
        await schema.clickAllocationsTab();
        await expect(schema.getProjectNames()).toEqual(projects);
    });

    it('should show a right breadcrumb after clicking on "create schema" and going back to a schema list', async () => {
        const breadcrumb: Array<String> = ['Schemas'];

        await schema.createNewSchemaClick();
        await schema.openSchema();

        await expect(admin.getBreadcrumbs()).toEqual(breadcrumb);
    });

    it('should create a new schema and delete it (using top button) with selected items check', async () => {
        const test: Array<String> = [];
        const schemaName: Array<String> = ['test'];
        const schemaInfo = `{
            "name": "test",
            "fields": [
                {
                    "name": "name",
                    "label": "Name",
                    "required": true,
                    "type": "string"
                }
            ]
        }`;

        await schema.createNewSchemaClick();

        await schema.setSchemaJSON(schemaInfo);
        await schema.clickSaveButton();

        await schema.openSchema();

        await schema.setFilterText('test');

        await expect(schema.getAllSchemasName()).toEqual(schemaName);

        await schema.chooseSchema();

        await schema.clickDeleteTopButton();
        await schema.clickDialogDeleteButton();

        await expect(schema.checkedCount().getText()).toEqual('Selected: 0');

        await schema.clearFilterText();

        await schema.setFilterText('test');

        await expect(schema.getAllSchemasName()).toEqual(test);
    });

    it('should go to the next page and show right schema', async () => {
        const schemaName: Array<String> = ['content'];
        await schema.goToNextPage();

        await expect(schema.getAllSchemasName()).toEqual(schemaName);
    });
});
