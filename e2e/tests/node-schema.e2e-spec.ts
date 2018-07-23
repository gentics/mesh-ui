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

    it('should equal schema names', async () => {
        const list: Array<String> = ['category', 'vehicleImage', 'vehicle', 'binary_content', 'folder', 'content'];

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
        await expect(schema.checkedCount().getText()).toEqual('Selected: 6');
    });

    it('should show a right breadcrumb after creating a new schema', async () => {
        const breadcrumbs: Array<String> = ['Schemas', 'New schema'];

        await schema.createNewSchemaClick();
        await expect(schema.getBreadcrumbs()).toEqual(breadcrumbs);
    });

    it('should show a right project allocation for some schema', async () => {
        const projects: Array<String> = ['demo'];

        await schema.clickSomeSchema('folder');
        await schema.clickAllocationsTab();
        await expect(schema.getProjectsName()).toEqual(projects);
    });

    it('should show a right breadcrumb after clicking on "create schema" and going back to a schema list', async () => {
        const breadcrumb: Array<String> = ['Schemas'];

        await schema.createNewSchemaClick();
        await schema.openSchema();

        await expect(schema.getBreadcrumbs()).toEqual(breadcrumb);
    });

    it('should create a new schema right (check breadcrumb after creating a new schema)', async () => {
        const schemaName = ['test333'];
        const schemaInfo = `{
            "name": "test333",
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

        await schema.giveSchemaInfo(schemaInfo);
        await schema.clickSaveButton();

        await schema.openSchema();

        await schema.setFilterText('test333');

        await expect(schema.getAllSchemasName()).toEqual(schemaName);
    });

    it('should delete some schema', async () => {
        const test34: Array<String> = [];

        await schema.clickSomeSchema('test333');
        await schema.clickDeleteButton();

        await schema.openSchema();
        await schema.setFilterText('test333');

        await expect(schema.getAllSchemasName()).toEqual(test34);
    });
});
