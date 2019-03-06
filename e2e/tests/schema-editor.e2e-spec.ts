import * as api from '../api';
import * as page from '../page-objects/app.po';
import { SchemaEditor } from '../page-objects/schema-editor/schema-editor.po';
import { Schemalist } from '../page-objects/schema-editor/schema-list.po';

describe('schema editor', () => {
    const testSchema: any = {
        name: 'schema_test',
        description: 'Lorem ipsum dolor amet',
        container: true,
        displayField: 'ccc',
        segmentField: 'ccc',
        fields: [
            {
                name: 'aaa',
                label: 'AAA',
                type: 'boolean',
                required: true
            },
            {
                name: 'bbb',
                label: 'BBB',
                type: 'list',
                listType: 'number'
            },
            {
                name: 'ccc',
                label: 'CCC',
                type: 'string',
                allow: ['x', 'y', 'z']
            }
        ]
    };

    beforeEach(async () => {
        await page.navigateToHome();
    });

    it('shows correct data according to API response', async () => {
        // schema 'Vehicle' with htis UUID must be provided in demo data
        const existingSchemaUuid = '2aa83a2b3cba40a1a83a2b3cba90a1de';
        // navigate to existing reference schema
        await page.navigateToAdminSchemaEditorExistingSchema(existingSchemaUuid);
        // construct schema object from open page
        const schemaEditor = new SchemaEditor();
        // get reference schema data from API
        const schemaFromApi = await api.getSchema(existingSchemaUuid);
        // reduce schema data to those properties to be mutable by schema editor
        const schemaFromApiStripped = schemaEditor.stripSchemaFields(schemaFromApi);
        // get schema data from schema editor
        const schemaFromEditor = await schemaEditor.value();
        // compare API data against editor data
        const a = JSON.stringify(schemaFromApiStripped);
        const b = JSON.stringify(schemaFromEditor);
        expect(a === b).toBeTruthy();
    });

    it('creates schema', async () => {
        let schemaEditor;
        let fields;

        await page.navigateToAdminSchemaEditorNew();

        schemaEditor = new SchemaEditor();

        await schemaEditor.input.name.setValue(testSchema.name);
        await schemaEditor.input.description.setValue(testSchema.description);
        await schemaEditor.input.container.setValue(testSchema.container);

        // create 3 new fields
        const btnNewField = await schemaEditor.button.newField.element();
        expect(btnNewField.isPresent()).toBeTruthy();
        await schemaEditor.button.newField.click();
        await schemaEditor.button.newField.click();
        await schemaEditor.button.newField.click();

        // recreate object to access changed properties
        schemaEditor = new SchemaEditor();
        fields = await schemaEditor.fields();

        await fields[0].input.name.setValue(testSchema.fields[0].name);
        await fields[0].input.label.setValue(testSchema.fields[0].label);
        await fields[0].input.type.setValue(testSchema.fields[0].type);
        await fields[0].input.required.setValue(testSchema.fields[0].required);

        await fields[1].input.name.setValue(testSchema.fields[1].name);
        await fields[1].input.label.setValue(testSchema.fields[1].label);
        await fields[1].input.type.setValue(testSchema.fields[1].type);
        await fields[1].input.listType.setValue(testSchema.fields[1].listType);

        await fields[2].input.name.setValue(testSchema.fields[2].name);
        await fields[2].input.label.setValue(testSchema.fields[2].label);
        await fields[2].input.type.setValue(testSchema.fields[2].type);
        await fields[2].input.allowInputText.setValue(testSchema.fields[2].allow);

        // set schema properties
        await schemaEditor.input.displayField.setValue(testSchema.displayField);
        await schemaEditor.input.segmentField.setValue(testSchema.segmentField);

        // save new schema
        const buttonCreate = await schemaEditor.button.create.element();
        expect(buttonCreate.isPresent()).toBeTruthy();
        expect(buttonCreate.getAttribute('disabled')).toBeFalsy();
        await schemaEditor.button.create.click();
    });

    it('created schema has correct data', async () => {
        // Now navigate to new this new schema and check values
        await page.navigateToAdminSchemaEditor();
        const newSchemaListItem = await Schemalist.getAdminListItemByName(testSchema.name);
        await newSchemaListItem.click();

        const schemaEditor = new SchemaEditor();
        const schemaFromEditor = await schemaEditor.value();

        expect(schemaFromEditor.name).toBe(testSchema.name);
        expect(schemaFromEditor.description).toBe(testSchema.description);
        expect(schemaFromEditor.container).toBe(testSchema.container);
        expect(schemaFromEditor.displayField).toBe(testSchema.displayField);
        expect(schemaFromEditor.segmentField).toBe(testSchema.segmentField);

        expect(schemaFromEditor.fields[0].name).toBe(testSchema.fields[0].name);
        expect(schemaFromEditor.fields[0].label).toBe(testSchema.fields[0].label);
        expect(schemaFromEditor.fields[0].type).toBe(testSchema.fields[0].type);
        expect(schemaFromEditor.fields[0].required).toBe(testSchema.fields[0].required);

        expect(schemaFromEditor.fields[1].name).toBe(testSchema.fields[1].name);
        expect(schemaFromEditor.fields[1].label).toBe(testSchema.fields[1].label);
        expect(schemaFromEditor.fields[1].type).toBe(testSchema.fields[1].type);
        expect(schemaFromEditor.fields[1].listType).toBe(testSchema.fields[1].listType);

        expect(schemaFromEditor.fields[2].name).toBe(testSchema.fields[2].name);
        expect(schemaFromEditor.fields[2].label).toBe(testSchema.fields[2].label);
        expect(schemaFromEditor.fields[2].type).toBe(testSchema.fields[2].type);
        expect(JSON.stringify(schemaFromEditor.fields[2].allow)).toBe(JSON.stringify(testSchema.fields[2].allow));
    });

    it('deletes schema correctly', async () => {
        let newSchemaListItem;

        await page.navigateToAdminSchemaEditor();
        newSchemaListItem = await Schemalist.getAdminListItemByName(testSchema.name);
        await newSchemaListItem.click();

        const schemaEditor = new SchemaEditor();
        // delete schema
        await schemaEditor.button.delete.click();

        // navigate to schema list
        await page.navigateToHome();
        await page.navigateToAdminSchemaEditor();

        // check if deleted schema is in list
        newSchemaListItem = await Schemalist.getAdminListItemByName(testSchema.name);
        expect(newSchemaListItem.isPresent()).toBeFalsy();
    });
});
