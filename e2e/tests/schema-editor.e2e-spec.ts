import * as api from '../api';
import * as page from '../page-objects/app.po';
import { SchemaEditor } from '../page-objects/schema-editor/schema-editor.po';

describe('schema editor', () => {
    beforeEach(async () => {
        await page.navigateToHome();
    });

    it('shows correct data', async () => {
        await page.navigateToAdminSchemaEditorExisting();

        const schemaEditor = new SchemaEditor();
        const schemaFromApi = await api.getSchema('2aa83a2b3cba40a1a83a2b3cba90a1de');
        const schemaFromApiStripped = schemaEditor.stripSchemaFields(schemaFromApi);

        const schemaFromEditor = await schemaEditor.value();

        const a = JSON.stringify(schemaFromApiStripped);
        const b = JSON.stringify(schemaFromEditor);
        const isEqual = a === b;
        expect(isEqual).toBeTruthy();
    });

    fit('creates data correctly', async () => {
        await page.navigateToAdminSchemaEditorNew();

        let schemaEditor = new SchemaEditor();

        await schemaEditor.input.name.setValue('schema_test_01');
        await schemaEditor.input.description.setValue('Lorem ipsum dolor amet');
        await schemaEditor.input.container.setValue(true);

        // create new field
        await schemaEditor.button.newField.click();
        await schemaEditor.button.newField.click();
        await schemaEditor.button.newField.click();
        // expect(buttonNewField.isPresent()).toBeTruthy();
        // await buttonNewField.click();
        // await buttonNewField.click();
        // await buttonNewField.click();

        schemaEditor = new SchemaEditor();
        const fields = await schemaEditor.fields();

        await fields[0].input.name.setValue('aaa');
        await fields[0].input.label.setValue('AAA');
        await fields[0].input.type.setValue('boolean');
        await fields[0].input.required.setValue(true);

        await fields[1].input.name.setValue('bbb');
        await fields[1].input.label.setValue('BBB');
        await fields[1].input.type.setValue('list');
        await fields[1].input.listType.setValue('number');

        await fields[2].input.name.setValue('ccc');
        await fields[2].input.label.setValue('CCC');
        await fields[2].input.type.setValue('string');
        await fields[2].input.allowInputText.setValue(['xyz']);

        // set meta fields
        await schemaEditor.input.displayField.setValue('ccc');
        await schemaEditor.input.segmentField.setValue('ccc');

        // check values
        const schemaFromEditor = await schemaEditor.value();
        console.log('!!! schemaFromEditor:', JSON.stringify(schemaFromEditor, null, 4));

        // save new schema
        // const buttonSave = await schemaEditor.button.save;
        // expect(buttonSave.isPresent()).toBeTruthy();
        await schemaEditor.button.save.click();
    });

    // it('changes data correctly', async () => {
    //     const schemaEditor = new SchemaEditor();

    // });

    // it('deletes correctly', async () => {
    //     const schemaEditor = new SchemaEditor();

    // });
});
