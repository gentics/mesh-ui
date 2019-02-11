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

    // it('creates data correctly', async () => {
    //     await page.navigateToAdminSchemaEditorNew();

    //     const schemaEditor = new SchemaEditor();

    // });

    // it('changes data correctly', async () => {
    //     const schemaEditor = new SchemaEditor();

    // });

    // it('deletes correctly', async () => {
    //     const schemaEditor = new SchemaEditor();

    // });
});
