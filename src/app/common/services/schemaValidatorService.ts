module meshAdminUi {

    export interface IValidationErrorFn {
        (message: string): void
    }

    /**
     * Returns a string of type `[fieldName, fieldType], ...` for use in error messages.
     */
    const fieldPropString = (fields: ISchemaFieldDefinition[], ...props: string[]): string => {
        // get the first valid (truthy) value of the props passed in.
        let propVal = field => props.map(prop => field[prop]).filter(x => !!x)[0];
        let templateMap = 0 < props.length ? f => `[${f.name} : ${propVal(f)}]` : f => `[${f.name}]`;
        return fields.map(templateMap).join(', ');
    };

    const validTypes = [
        'string',
        'number',
        'html',
        'boolean',
        'date',
        'list',
        'select',
        'node',
        'micronode',
        'binary'
    ];

    // ensure the displayField is set
    function displayFieldIsSet(obj: any, error: Function): boolean {
        if (obj.displayField === undefined || obj.displayField === '') {
            error('ERR_SCHEMA_PLEASE_SPECIFY_DISPLAY_FIELD');
            return false;
        }
        return true;
    }

    // ensure the segmentField is set
    function segmentFieldIsSet(obj: any, error: Function): boolean {
        if (obj.segmentField === undefined || obj.segmentField === '') {
            error('ERR_SCHEMA_PLEASE_SPECIFY_SEGMENT_FIELD');
            return false;
        }
        return true;
    }

    // ensure at least one field has been defined
    function fieldsIsNotEmpty(obj: any, error: Function): boolean {
        if (!obj.fields || obj.fields.length === 0) {
            error('ERR_SCHEMA_MUST_HAVE_AT_LEAST_ONE_FIELD');
            return false;
        }
        return true;
    }

    // ensure displayField matches an actual field name
    function displayFieldMatchesFieldName(obj: any, error: Function): boolean {
        let fieldNames = obj.fields.map(field => field.name);
        if (fieldNames.indexOf(obj.displayField) === -1) {
            error('ERR_SCHEMA_DISPLAY_FIELD_DOES_NOT_MATCH', { value: obj.displayField });
            return false;
        }
        return true;
    }

    // ensure segmentField matches an actual field name
    function segmentFieldMatchesFieldName(obj: any, error: Function): boolean {
        let fieldNames = obj.fields.map(field => field.name);
        if (obj.segmentField && obj.segmentField !== '' && fieldNames.indexOf(obj.segmentField) === -1) {
            error('ERR_SCHEMA_SEGMENT_FIELD_DOES_NOT_MATCH', { value: obj.segmentField });
            return false;
        }
        return true;
    }

    // ensure each field has a name and type
    function fieldsHaveNameAndType(obj: any, error: Function): boolean {
        let badFields = obj.fields.filter((field: any) => !field.name || !field.type);
        if (0 < badFields.length) {
            error('ERR_SCHEMA_REQUIRE_NAME_AND_TYPE');
            return false;
        }
        return true;
    }

    // ensure only valid field types are used
    function allFieldTypesValid(obj: any, error: Function): boolean {
        let badFieldTypes = obj.fields.filter((field: any) => -1 === validTypes.indexOf(field.type));
        if (0 < badFieldTypes.length) {
            let names = fieldPropString(badFieldTypes, 'type');
            error('ERR_SCHEMA_INVALID_TYPES', { names });
            return false;
        }
        return true;
    }

    // ensure there are no duplicate field names
    function fieldNamesAreUnique(obj: any, error: Function): boolean {
        let fieldNames = obj.fields.map(field => field.name);
        let duplicateNames = fieldNames
            .sort()
            .reduce((duplciates, curr, index, arr) => {
                let last = arr[index - 1];
                if (last !== undefined && last === curr) {
                    duplciates.push(curr);
                }
                return duplciates;
            }, []);
        if (0 < duplicateNames.length) {
            let names = duplicateNames.map(n => `[${n}]`).join(', ');
            error('ERR_SCHEMA_DUPLICATE_FIELD_NAMES', { names });
            return false;
        }
        return true;
    }

    // ensure a list type has listType set to a valid type
    function listTypesAreValid(obj: any, error: Function): boolean {
        let listFields = obj.fields.filter((field: any) => field.type === 'list');
        if (0 < listFields.length) {
            let badListFields = listFields.filter((field: any) => -1 === validTypes.indexOf(field.listType));
            if (0 < badListFields.length) {
                let names = fieldPropString(badListFields, 'listType');
                error('ERR_SCHEMA_INVALID_LIST_TYPE', { names });
                return false;
            }
        }
        return true;
    }

    // ensure any micronode types or listTypes have an allow property defined.
    function micronodesHaveAllowProperty(obj: any, error: Function): boolean {
        let micronodeFields = obj.fields.filter((field: any) => field.type === 'micronode' || field.listType === 'micronode');
        if (0 < micronodeFields.length) {
            const isArray = x => x instanceof Array;
            let badMicronodeFields = micronodeFields.filter((field: any) => field.allow === undefined || !isArray(field.allow));
            if (0 < badMicronodeFields.length) {
                let names = fieldPropString(badMicronodeFields);
                error('ERR_SCHEMA_ALLOW_PROPERTY_MISSING', { names });
                return false;
            }
        }
        return true;
    }

    export class SchemaValidatorService {

        constructor(private i18n: I18nFilter) {}

        /**
         * Validate the json of a schema
         */
        public validateSchemaJson(json: string, onError?: IValidationErrorFn): boolean {
            const validatorFns = [
                displayFieldIsSet,
                fieldsIsNotEmpty,
                displayFieldMatchesFieldName,
                segmentFieldMatchesFieldName,
                fieldsHaveNameAndType,
                allFieldTypesValid,
                fieldNamesAreUnique,
                listTypesAreValid,
                micronodesHaveAllowProperty
            ];
            return this.doValidation(json, validatorFns, onError);
        }

        /**
         * Validate the json of a microschema
         */
        public validateMichroschemaJson(json: string, onError?: IValidationErrorFn) {
            const validatorFns = [
                fieldsIsNotEmpty,
                fieldsHaveNameAndType,
                allFieldTypesValid,
                fieldNamesAreUnique,
                listTypesAreValid
            ];
            return this.doValidation(json, validatorFns, onError);
        }

        private doValidation(json: string, validators: Function[], onError?: IValidationErrorFn): boolean {
            const errorFn = this.createErrorFn(onError);
            let schema = this.jsonToObject(json, errorFn);
            if (schema === undefined) {
                return false;
            }
            let isValid = true;
            if (!schema.fields) {
                schema.fields = [];
            }
            validators.forEach(validator => {
                if (!validator(schema, errorFn)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        /**
         * Returns a function which invokes the passed onError function only if it is defined.
         */
        private createErrorFn(onError: Function): IValidationErrorFn {
            return (message: string, values?: any) => {
                if (onError !== undefined) {
                    let translated = this.i18n(message, values);
                    onError(translated);
                }
            };
        }

        /**
         * Convert a json string to an object and check that it is valid;
         */
        private jsonToObject(json, error): any {
            let obj;
            try{
                obj = <ISchema>JSON.parse(json);
            } catch(e) {
                // JSON must be well-formed.
                error('JSON_IS_INVALID');
            }
            return obj;
        }
    }

    angular.module('meshAdminUi.common')
        .service('schemaValidatorService', SchemaValidatorService);
}