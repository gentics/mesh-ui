import { browser, by, element, promise, ElementFinder } from 'protractor';

import { Schema } from '../../../src/app/common/models/schema.model';
import { MicroschemaResponse, MicroschemaUpdateRequest } from '../../../src/app/common/models/server-models';
import { isValidString } from '../../../src/app/common/util/util';

import { MicroschemaEditorField } from './microschema-editor-field.po';
import { SchemaEditorUtils } from './utils.po';

export class MicroschemaEditor {
    // GETTERS /////////////////////////////////////////////////////////////////////////////////////

    /** @returns all relevant schema properties input data */
    input = {
        name: {
            element: () => SchemaEditorUtils.getInputTextElementByFormControlName('name'),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('name'),
            setValue: (value: string) => SchemaEditorUtils.inputTextSetValue(value, 'name'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('name')
        },
        description: {
            element: () => SchemaEditorUtils.getInputTextElementByFormControlName('description'),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('description'),
            setValue: (value: string) => SchemaEditorUtils.inputTextSetValue(value, 'description'),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('description')
        }
    };

    /** @returns all schema fields as class instances */
    async fields(): Promise<MicroschemaEditorField[]> {
        const fields: ElementFinder[] = await element.all(by.css('gtx-sortable-item form'));
        return fields.map(field => new MicroschemaEditorField(field as ElementFinder));
    }

    /** @returns all schema field input data */
    async fieldStates() {
        const fieldInstances = await this.fields();
        const statePromises: Array<Promise<any>> = fieldInstances.map((instance: MicroschemaEditorField) =>
            instance.stateCurrent()
        );
        return promise.all(statePromises);
    }

    /** @returns all fields data analogously to the schema editor data object */
    async fieldValues() {
        const fieldInstances = await this.fields();
        const statePromises: Array<Promise<any>> = fieldInstances.map((instance: MicroschemaEditorField) =>
            instance.value()
        );
        return promise.all(statePromises);
    }

    /** @returns schema buttons */
    button = {
        create: {
            element: () => element(by.cssContainingText('button', 'Create')),
            click: async () => {
                const button = await element(by.cssContainingText('button', 'Create'));
                await browser.executeScript('arguments[0].scrollIntoView();', button.getWebElement());
                return await button.click();
            }
        },
        save: {
            element: () => element(by.cssContainingText('button', 'Save')),
            click: async () => {
                const button = await element(by.cssContainingText('button', 'Save'));
                await browser.executeScript('arguments[0].scrollIntoView();', button.getWebElement());
                return await button.click();
            }
        },
        delete: {
            element: () => element(by.cssContainingText('button', 'Delete')),
            click: async () => {
                const button = await element(by.cssContainingText('button', 'Delete'));
                await browser.executeScript('arguments[0].scrollIntoView();', button.getWebElement());
                return await button.click();
            }
        },
        newField: {
            element: () => element(by.cssContainingText('button', 'New Field')),
            click: async () => {
                const button = await element(by.cssContainingText('button', 'New Field'));
                await browser.executeScript('arguments[0].scrollIntoView();', button.getWebElement());
                return await button.click();
            }
        }
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

        return {
            name: {
                value: inputTextNameValue,
                errors: inputTextNameErrors
            },
            description: {
                value: inputTextDescriptionValue,
                errors: inputTextDescriptionErrors
            }
        };
    }

    /** @returns data analogously to the schema editor data object */
    async value(): Promise<MicroschemaUpdateRequest | Schema | any> {
        const state = await this.stateCurrent();
        const fieldValues = await this.fieldValues();

        return {
            name: state.name.value,
            ...(isValidString(state.description.value) && ({ description: state.description.value } as any)),
            ...(fieldValues && fieldValues.length && fieldValues.length > 0 && ({ fields: fieldValues } as any))
        };
    }

    // HELPERS /////////////////////////////////////////////////////////////////////////////////////

    async clickModalNo() {
        await element(by.cssContainingText('gtx-modal-dialog button', 'No')).click();
    }

    /** @description Contains Schema properties to be editable in editor */
    updateFields: Array<keyof MicroschemaResponse> = ['name', 'description', 'fields'];

    /** @returns Schema object with those properties whic hare editable in the editor */
    stripSchemaFields(schema: MicroschemaResponse): any {
        schema.fields.sort((a: any, b: any) => a.name.localeCompare(b.name));
        return this.updateFields.reduce((obj, key) => ({ ...obj, [key]: schema[key] }), {});
    }
}
