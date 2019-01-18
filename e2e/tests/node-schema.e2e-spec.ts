import { browser } from 'protractor';

import { Schema } from '../../src/app/common/models/schema.model';
import { createSimpleSchema, deleteSchema } from '../api';
import * as page from '../page-objects/app.po';
import { NodeAdmin } from '../page-objects/node-admin.po';
import { NodeSchema } from '../page-objects/node-schema.po';

describe('node schema', () => {
    let admin: NodeAdmin;
    let schema: NodeSchema;

    const schemaModel: Array<Schema> = [];

    beforeAll(async () => {
        for (let i = 1; i <= 10; i++) {
            schemaModel.push(await createSimpleSchema('test' + i));
        }
    });

    afterAll(async () => {
        for (let i = 0; i < 10; i++) {
            await deleteSchema(schemaModel[i]);
        }
    });

    beforeEach(async () => {
        admin = new NodeAdmin();
        schema = new NodeSchema();
        await page.navigateToHome();
        await admin.modeChange();
        await schema.openSchema();
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
        await expect(schema.checkedCount().getText()).toEqual('Selected: 16');
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
        const schemaName: Array<String> = ['test11'];
        const schemaInfo = `{
            "name": "test11",
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

        await schema.setFilterText('test11');

        await expect(schema.getAllSchemasName()).toEqual(schemaName);

        await schema.chooseSchema();

        await schema.clickDeleteTopButton();
        await schema.clickDialogDeleteButton();

        await expect(schema.checkedCount().getText()).toEqual('Selected: 0');

        await schema.clearFilterText();

        await schema.setFilterText('test11');

        await expect(schema.getAllSchemasName()).toEqual(test);
    });

    it('should go to the next page and show right schema', async () => {
        const link: String = 'ui#/admin/schemas?p=2';
        await schema.goToNextPage();

        await expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + link);
    });
});
