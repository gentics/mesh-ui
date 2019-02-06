import * as api from '../api';
import * as page from '../page-objects/app.po';
import { SchemaEditor } from '../page-objects/schema-editor/schema-editor.po';

fdescribe('schema editor', () => {
    beforeEach(async () => {
        await page.navigateToHome();
        await page.navigateToAdminSchemaEditorExisting();
        // await page.navigateToAdminSchemaEditorNew();
    });

    it('shows correct data', async () => {
        // const schemaSample = await api.getSchema('a866dec4538c4c65a6dec4538c9c653d');

        const TEST = await SchemaEditor.value();
        console.log('!!! TEST:', JSON.stringify(TEST, null, 4));
    });
});

/**
# Tests

## Basic Input Test Iteration Cycle

## Schema
#### Check existing inputs
##### Input Text Presence & Value
##### Input Text Validation Errors

##### Input CheckBox Presence & Value
##### Input CheckBox Validation Errors

##### Input Select Single Presence & Value
##### Input Select Single Validation Errors
##### Input Select Single Options

##### Input Select Multi Presence & Value
##### Input Select Multi Validation Errors
##### Input Select Multi Options

## Schema Field
### Check how many fields
### Same as Schema

**/
