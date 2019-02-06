import { by, ElementFinder } from 'protractor';

import { SchemaField } from '../../../src/app/common/models/schema.model';

import { SchemaEditorUtils } from './utils.po';

export class SchemaEditorField {
    constructor(public root: ElementFinder) {}

    /** @returns all relevant schema field properties input data */
    input = {
        name: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('name', this.root),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('name', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('name', this.root)
        },
        label: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('label', this.root),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('label', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('label', this.root)
        },
        type: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('type', this.root),
            value: () => SchemaEditorUtils.getInputSelectSingleValueByFormControlName('type', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('type', this.root)
        },
        required: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('required', this.root),
            value: () => SchemaEditorUtils.getInputCheckboxValueByFormControlName('required', this.root)
        },
        listType: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('listType', this.root),
            value: () => SchemaEditorUtils.getInputSelectSingleValueByFormControlName('listType', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('listType', this.root)
        },
        allowInputSelect: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('allow', this.root),
            value: () => SchemaEditorUtils.getInputSelectMultiValueByFormControlName('allow', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('allow', this.root)
        },
        allowInputText: {
            element: () => SchemaEditorUtils.getInputElementByFormControlName('allow', this.root),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('allow', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('allow', this.root),
            chips: () => SchemaEditorUtils.getAllowStrings(this.root)
        }
    };

    /** @returns schema field buttons */
    button = {
        delete: () => this.root.element(by.css('.button-close')),
        addField: () => this.root.element(by.css('.button-add'))
    };

    /** @description Precondition functions to fill schema fields data */
    schemaFieldDataConditions: { [key: string]: (...args: any[]) => boolean } = {
        listType: type => type === 'List',
        allowInputSelect: (type, listType) => {
            return type === 'Node' || listType === 'Node' || type === 'Micronode' || listType === 'Micronode';
        },
        allowStringsInputText: (type, listType) => {
            return type === 'String' || listType === 'String';
        }
    };

    /** @returns all relevant input data from schema field */
    async stateCurrent() {
        const inputTextNameElement = await this.input.name.element();
        expect(inputTextNameElement.isPresent()).toBeTruthy();
        const inputTextNameValue = await this.input.name.value();
        const inputTextNameErrors = await this.input.name.errors();

        const inputTextLabelElement = await this.input.label.element();
        expect(inputTextLabelElement.isPresent()).toBeTruthy();
        const inputTextLabelValue = await this.input.label.value();
        const inputTextLabelErrors = await this.input.label.errors();

        const inputSelectTypeElement = await this.input.type.element();
        expect(inputSelectTypeElement.isPresent()).toBeTruthy();
        const inputSelectTypeValue = await this.input.type.value();
        const inputSelectTypeErrors = await this.input.type.errors();

        const inputCheckboxRequiredElement = await this.input.required.element();
        expect(inputCheckboxRequiredElement.isPresent()).toBeTruthy();
        const inputCheckboxRequiredValue = await this.input.required.value();

        const state: any = {
            name: {
                value: inputTextNameValue,
                errors: inputTextNameErrors
            },
            label: {
                value: inputTextLabelValue,
                errors: inputTextLabelErrors
            },
            type: {
                value: inputSelectTypeValue,
                errors: inputSelectTypeErrors
            },
            required: {
                value: inputCheckboxRequiredValue
            }
        };

        let inputSelectListTypeValue;
        let inputSelectListTypeErrors;
        if (this.schemaFieldDataConditions.listType(inputSelectTypeValue)) {
            inputSelectListTypeValue = await this.input.listType.value();
            inputSelectListTypeErrors = await this.input.listType.errors();

            Object.assign(state, {
                listType: {
                    value: inputSelectListTypeValue,
                    errors: inputSelectListTypeErrors
                }
            });
        }

        let inputSelectAllowValue;
        let inputSelectAllowErrors;
        if (this.schemaFieldDataConditions.allowInputSelect(inputSelectTypeValue, inputSelectListTypeValue)) {
            inputSelectAllowValue = await this.input.allowInputSelect.value();
            inputSelectAllowErrors = await this.input.allowInputSelect.errors();

            Object.assign(state, {
                allow: {
                    value: inputSelectAllowValue,
                    errors: inputSelectAllowErrors
                }
            });
        }

        let inputTextAllowValue;
        let inputTextAllowErrors;
        let inputTextAllowChips;
        if (this.schemaFieldDataConditions.allowStringsInputText(inputSelectTypeValue, inputSelectListTypeValue)) {
            inputTextAllowValue = await this.input.allowInputText.value();
            inputTextAllowErrors = await this.input.allowInputText.errors();
            inputTextAllowChips = await this.input.allowInputText.chips();

            Object.assign(state, {
                allow: {
                    value: inputTextAllowValue,
                    errors: inputTextAllowErrors,
                    chips: inputTextAllowChips
                }
            });
        }

        return state;
    }

    /** @returns data analogously to the schema editor field data object */
    async value() {
        const state = await this.stateCurrent();

        const stateValues: any = {
            name: state.name.value,
            label: state.label.value,
            type: state.type.value,
            required: state.required.value
        };

        if (state.type && this.schemaFieldDataConditions.listType(state.type.value)) {
            Object.assign(stateValues, { listType: state.listType.value });
        }

        if (
            state.type &&
            state.listType &&
            this.schemaFieldDataConditions.allowInputSelect(state.type.value, state.listType.value)
        ) {
            Object.assign(stateValues, { allow: state.allow.value });
        }

        return stateValues;
    }
}
