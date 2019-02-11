import { by, element, promise, ElementFinder } from 'protractor';

import { Schema } from '../../../src/app/common/models/schema.model';
import { SchemaResponse, SchemaUpdateRequest } from '../../../src/app/common/models/server-models';

import { SchemaEditorField } from './schema-editor-field.po';
import { SchemaEditorUtils } from './utils.po';

export class SchemaEditor {
    /** @returns all relevant schema properties input data */
    input = {
        name: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('name'),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('name'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('name')
        },
        description: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('description'),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('description'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('description')
        },
        container: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('container'),
            value: () => SchemaEditorUtils.getInputCheckboxValueByFormControlName('container')
        },
        displayField: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('displayField'),
            value: () => SchemaEditorUtils.getInputSelectSingleValueByFormControlName('displayField'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('displayField'),
            options: async () => {
                const inputSelect = await SchemaEditorUtils.getInputSelectElementByFormControlName('displayField');
                return SchemaEditorUtils.getSelectableOptionsOfInput(inputSelect);
            }
        },
        segmentField: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('segmentField'),
            value: () => SchemaEditorUtils.getInputSelectSingleValueByFormControlName('segmentField'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('segmentField'),
            options: async () => {
                const inputSelect = await SchemaEditorUtils.getInputSelectElementByFormControlName('segmentField');
                return SchemaEditorUtils.getSelectableOptionsOfInput(inputSelect);
            }
        },
        urlFields: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('urlFields'),
            value: () => SchemaEditorUtils.getInputSelectMultiValueByFormControlName('urlFields'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('urlFields'),
            options: async () => {
                const inputSelect = await SchemaEditorUtils.getInputSelectElementByFormControlName('urlFields');
                return SchemaEditorUtils.getSelectableOptionsOfInput(inputSelect);
            }
        }
    };

    /** @returns all schema fields as class instances */
    async fields(): Promise<SchemaEditorField[]> {
        const fields: ElementFinder[] = await element.all(by.css('gtx-sortable-item form'));
        return fields.map(field => new SchemaEditorField(field as ElementFinder));
    }

    /** @returns all schema field input data */
    async fieldStates() {
        const fieldInstances = await this.fields();
        const statePromises: Array<Promise<any>> = fieldInstances.map((instance: SchemaEditorField) =>
            instance.stateCurrent()
        );
        return promise.all(statePromises);
    }

    /** @returns all fields data analogously to the schema editor data object */
    async fieldValues() {
        const fieldInstances = await this.fields();
        const statePromises: Array<Promise<any>> = fieldInstances.map((instance: SchemaEditorField) =>
            instance.value()
        );
        return promise.all(statePromises);
    }

    /** @returns schema buttons */
    button = {
        newField: element(by.cssContainingText('button', 'New Field'))
    };

    /** @returns all relevant input data from schema */
    async stateCurrent() {
        const inputTextNameElement = await this.input.name.element();
        expect(inputTextNameElement.isPresent()).toBeTruthy();
        const inputTextNameValue = await this.input.name.value();
        const inputTextNameErrors = await this.input.name.errors();

        const inputTextDescriptionElement = await this.input.description.element();
        expect(inputTextDescriptionElement.isPresent()).toBeTruthy();
        const inputTextDescriptionValue = await this.input.description.value();
        const inputTextDescriptionErrors = await this.input.description.errors();

        const inputCheckboxContainerElement = await this.input.container.element();
        expect(inputCheckboxContainerElement.isPresent()).toBeTruthy();
        const inputCheckboxContainerValue = await this.input.container.value();

        const inputSelectSingleDisplayFieldElement = await this.input.displayField.element();
        expect(inputSelectSingleDisplayFieldElement.isPresent()).toBeTruthy();
        const inputSelectSingleDisplayFieldValue = await this.input.displayField.value();
        const inputSelectSingleDisplayFieldErrors = await this.input.displayField.errors();
        const inputSelectSingleDisplayFieldOptions = await this.input.displayField.options();

        const inputSelectSingleSegmentFieldElement = await this.input.segmentField.element();
        expect(inputSelectSingleSegmentFieldElement.isPresent()).toBeTruthy();
        const inputSelectSingleSegmentFieldValue = await this.input.segmentField.value();
        const inputSelectSingleSegmentFieldErrors = await this.input.segmentField.errors();
        const inputSelectSingleSegmentFieldOptions = await this.input.segmentField.options();

        const inputSelectMultiUrlFieldsElement = await this.input.urlFields.element();
        expect(inputSelectMultiUrlFieldsElement.isPresent()).toBeTruthy();
        const inputSelectMultiUrlFieldsValue = await this.input.urlFields.value();
        const inputSelectMultiUrlFieldsErrors = await this.input.urlFields.errors();
        const inputSelectMultiUrlFieldsieldOptions = await this.input.urlFields.options();

        return {
            name: {
                value: inputTextNameValue,
                errors: inputTextNameErrors
            },
            description: {
                value: inputTextDescriptionValue,
                errors: inputTextDescriptionErrors
            },
            container: {
                value: inputCheckboxContainerValue
            },
            displayField: {
                value: inputSelectSingleDisplayFieldValue,
                errors: inputSelectSingleDisplayFieldErrors,
                options: inputSelectSingleDisplayFieldOptions
            },
            segmentField: {
                value: inputSelectSingleSegmentFieldValue,
                errors: inputSelectSingleSegmentFieldErrors,
                options: inputSelectSingleSegmentFieldOptions
            },
            urlFields: {
                value: inputSelectMultiUrlFieldsValue,
                errors: inputSelectMultiUrlFieldsErrors,
                options: inputSelectMultiUrlFieldsieldOptions
            }
        };
    }

    /** @returns data analogously to the schema editor data object */
    async value(): Promise<SchemaUpdateRequest | Schema | any> {
        const state = await this.stateCurrent();
        const fieldValues = await this.fieldValues();

        const value = {
            name: state.name.value,
            description: state.description.value,
            ...(fieldValues && fieldValues.length && fieldValues.length > 0 && ({ fields: fieldValues } as any)),
            displayField: state.displayField.value,
            segmentField: state.segmentField.value,
            urlFields: state.urlFields.value,
            ...(typeof state.container.value === 'boolean' && ({ container: state.container.value } as any))
        };

        return value;
    }

    /** @description Contains Schema properties to be editable in editor */
    updateFields: Array<keyof SchemaResponse> = [
        'name',
        'description',
        'fields',
        'displayField',
        'segmentField',
        'urlFields',
        'container'
    ];

    /** @returns Schema object with those properties whic hare editable in the editor */
    stripSchemaFields(schema: SchemaResponse): any {
        schema.fields.sort((a: any, b: any) => a.name.localeCompare(b.name));
        return this.updateFields.reduce((obj, key) => ({ ...obj, [key]: schema[key] }), {});
    }
}
