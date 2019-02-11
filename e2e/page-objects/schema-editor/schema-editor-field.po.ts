import { by, ElementFinder } from 'protractor';

import { SchemaEditorUtils } from './utils.po';

export class SchemaEditorField {
    constructor(public root: ElementFinder) {}

    /** @returns all relevant schema field properties input data */
    input = {
        name: {
            element: () => SchemaEditorUtils.getInputTextElementByFormControlName('name', this.root),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('name', this.root),
            setValue: (value: string) => SchemaEditorUtils.inputTextSetValue(value, 'name', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('name', this.root)
        },
        label: {
            element: () => SchemaEditorUtils.getInputTextElementByFormControlName('label', this.root),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('label', this.root),
            setValue: (value: string) => SchemaEditorUtils.inputTextSetValue(value, 'label', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('label', this.root)
        },
        type: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('type', this.root),
            value: () => SchemaEditorUtils.getInputSelectSingleValueByFormControlName('type', this.root),
            setValue: (value: string) => SchemaEditorUtils.inputSelectSetValueSingle(value, 'type', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('type', this.root)
        },
        required: {
            element: () => SchemaEditorUtils.getInputTextElementByFormControlName('required', this.root),
            value: () => SchemaEditorUtils.getInputCheckboxValueByFormControlName('required', this.root),
            setValue: (value: boolean) => SchemaEditorUtils.inputCheckboxSetValue(value, 'required', this.root)
        },
        listType: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('listType', this.root),
            value: () => SchemaEditorUtils.getInputSelectSingleValueByFormControlName('listType', this.root),
            setValue: (value: string) => SchemaEditorUtils.inputSelectSetValueSingle(value, 'listType', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('listType', this.root)
        },
        allowInputSelect: {
            element: () => SchemaEditorUtils.getInputSelectElementByFormControlName('allow', this.root),
            value: () => SchemaEditorUtils.getInputSelectMultiValueByFormControlName('allow', this.root),
            setValue: (value: string[]) => SchemaEditorUtils.inputSelectSetValueMulti(value, 'allow', this.root),
            errors: () => SchemaEditorUtils.getInputErrorsByFormControlName('allow', this.root)
        },
        allowInputText: {
            element: () => SchemaEditorUtils.getInputTextElementByFormControlName('allow', this.root),
            value: () => SchemaEditorUtils.getInputValueByFormControlName('allow', this.root),
            setValue: (value: string[]) => SchemaEditorUtils.inputChipsSetValue(value, 'allow', this.root),
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
        listType: type => {
            return type === 'list';
        },
        allowInputSelect: (type, listType) => {
            return type === 'node' || listType === 'node' || type === 'micronode' || listType === 'micronode';
        },
        allowStringsInputText: (type, listType) => {
            return type === 'string' || listType === 'string';
        }
    };

    /** @returns all relevant input data from schema field */
    async stateCurrent() {
        // get values
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

        // provide unconditional values
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

        // listType
        // add if conditions are met
        let inputSelectListTypeValue;
        let inputSelectListTypeErrors;
        if (this.schemaFieldDataConditions.listType(inputSelectTypeValue)) {
            const inputSelectListTypeElement = await this.input.listType.element();
            expect(inputSelectListTypeElement.isPresent()).toBeTruthy();
            inputSelectListTypeValue = await this.input.listType.value();
            inputSelectListTypeErrors = await this.input.listType.errors();

            Object.assign(state, {
                listType: {
                    value: inputSelectListTypeValue,
                    errors: inputSelectListTypeErrors
                }
            });
        }

        // allow input select
        // add if conditions are met
        let inputSelectAllowValue;
        let inputSelectAllowErrors;
        if (this.schemaFieldDataConditions.allowInputSelect(inputSelectTypeValue, inputSelectListTypeValue)) {
            const inputSelectAllowElement = await this.input.allowInputSelect.element();
            expect(inputSelectAllowElement.isPresent()).toBeTruthy();
            inputSelectAllowValue = await this.input.allowInputSelect.value();
            inputSelectAllowErrors = await this.input.allowInputSelect.errors();

            Object.assign(state, {
                allow: {
                    value: inputSelectAllowValue,
                    errors: inputSelectAllowErrors
                }
            });
        }

        // allow input text
        // add if conditions are met
        let inputTextAllowValue;
        let inputTextAllowErrors;
        let inputTextAllowChips;
        if (this.schemaFieldDataConditions.allowStringsInputText(inputSelectTypeValue, inputSelectListTypeValue)) {
            const inputTextAllowElement = await this.input.allowInputText.element();
            expect(inputTextAllowElement.isPresent()).toBeTruthy();
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

        // always provide mandatory properties
        const stateValues: any = {
            name: state.name.value,
            label: state.label.value,
            ...(typeof state.required.value === 'boolean' && ({ required: state.required.value } as any)),
            ...(state.type &&
                state.type.value &&
                this.schemaFieldDataConditions.listType(state.type.value) &&
                ({ listType: state.listType.value } as any)),
            type: state.type.value,
            ...(state.type &&
                state.type.value &&
                this.schemaFieldDataConditions.allowInputSelect(
                    state.type.value,
                    state.listType && state.listType.value
                ) &&
                state.allow.value.length > 0 &&
                ({ allow: state.allow.value } as any)),
            ...(state.type &&
                state.type.value &&
                this.schemaFieldDataConditions.allowStringsInputText(
                    state.type.value,
                    state.listType && state.listType.value
                ) &&
                state.allow.chips.length > 0 &&
                ({ allow: state.allow.chips } as any))
        };

        return stateValues;
    }
}
