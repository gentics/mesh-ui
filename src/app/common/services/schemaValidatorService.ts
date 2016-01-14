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
            error('Please specify a displayField.');
            return false;
        }
        return true;
    }

    // ensure the segmentField is set
    function segmentFieldIsSet(obj: any, error: Function): boolean {
        if (obj.segmentField === undefined || obj.segmentField === '') {
            error('Please specify a segmentField.');
            return false;
        }
        return true;
    }

    // ensure at least one field has been defined
    function fieldsIsNotEmpty(obj: any, error: Function): boolean {
        if (!obj.fields || obj.fields.length === 0) {
            error('Schema must have at least one field defined.');
            return false;
        }
        return true;
    }

    // ensure displayField matches an actual field name
    function displayFieldMatchesFieldName(obj: any, error: Function): boolean {
        let fieldNames = obj.fields.map(field => field.name);
        if (fieldNames.indexOf(obj.displayField) === -1) {
            error(`displayField value "${obj.displayField}" does not match any fields.`);
            return false;
        }
        return true;
    }

    // ensure segmentField matches an actual field name
    function segmentFieldMatchesFieldName(obj: any, error: Function): boolean {
        let fieldNames = obj.fields.map(field => field.name);
        if (fieldNames.indexOf(obj.segmentField) === -1) {
            error(`segmentField value "${obj.segmentField}" does not match any fields.`);
            return false;
        }
        return true;
    }

    // ensure each field has a name and type
    function fieldsHaveNameAndType(obj: any, error: Function): boolean {
        let badFields = obj.fields.filter(field => !field.name || !field.type);
        if (0 < badFields.length) {
            error(`All fields must have a "name" and "type" property.`);
            return false;
        }
        return true;
    }

    // ensure only valid field types are used
    function allFieldTypesValid(obj: any, error: Function): boolean {
        let badFieldTypes = obj.fields.filter(field => -1 === validTypes.indexOf(field.type));
        if (0 < badFieldTypes.length) {
            let names = fieldPropString(badFieldTypes, 'type');
            error(`The following fields have invalid types ${names}.`);
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
            error(`Fields must have unique names - duplicate field detected: ${names}.`);
            return false;
        }
        return true;
    }

    // ensure a list type has listType set to a valid type
    function listTypesAreValid(obj: any, error: Function): boolean {
        let listFields = obj.fields.filter(field => field.type === 'list');
        if (0 < listFields.length) {
            let badListFields = listFields.filter(field => -1 === validTypes.indexOf(field.listType));
            if (0 < badListFields.length) {
                let names = fieldPropString(badListFields, 'listType');
                error(`The following list fields have an invalid listType ${names}.`);
                return false;
            }
        }
        return true;
    }

    // ensure any micronode types or listTypes have an allow property defined.
    function micronodesHaveAllowProperty(obj: any, error: Function): boolean {
        let micronodeFields = obj.fields.filter(field => field.type === 'micronode' || field.listType === 'micronode');
        if (0 < micronodeFields.length) {
            const isArray = x => x instanceof Array;
            let badMicronodeFields = micronodeFields.filter(field => field.allow === undefined || !isArray(field.allow));
            if (0 < badMicronodeFields.length) {
                let names = fieldPropString(badMicronodeFields);
                error(`The following micronode fields must have an "allow" property defined: ${names}.`);
                return false;
            }
        }
        return true;
    }

    export class SchemaValidatorService {

        /**
         * Validate the json of a schema
         */
        public validateSchemaJson(json: string, onError?: IValidationErrorFn): boolean {
            const validatorFns = [
                displayFieldIsSet,
                segmentFieldIsSet,
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
                if (!validator(schema, onError)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        /**
         * Returns a function which invokes the passed onError function only if it is defined.
         */
        private createErrorFn(onError: Function): IValidationErrorFn {
            return (message: string) => {
                if (onError !== undefined) {
                    onError(message);
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
                error('JSON is invalid.');
            }
            return obj;
        }
    }

    angular.module('meshAdminUi.common')
        .service('schemaValidatorService', SchemaValidatorService);
}