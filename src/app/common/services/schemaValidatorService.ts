
module meshAdminUi {

    export class SchemaValidatorService {

        /**
         * Some basic validation of the schema def.
         */
        public validateSchemaJson(json: string, onError?: (message: string) => void ): boolean {
            // conditionally invoke the onError callback if defined, passing the error message.
            const error = (message: string) => {
                if (onError !== undefined) {
                    onError(message);
                }
            };
            // returns a string of type `[fieldName, fieldType], ...` for use in error messages.
            const fieldPropString = (fields: ISchemaFieldDefinition[], ...props: string[]): string => {
                // get the first valid (truthy) value of the props passed in.
                let propVal = field => props.map(prop => field[prop]).filter(x => !!x)[0];
                let templateMap = 0 < props.length ? f => `[${f.name} : ${propVal(f)}]` : f => `[${f.name}]`;
                return fields.map(templateMap).join(', ');
            };
            let obj;
            try{
                obj = <ISchema>JSON.parse(json);
            } catch(e) {
                // JSON must be well-formed.
                error('JSON is invalid.');
                return false;
            }
            const validTypes = [
                'string',
                'number',
                'html',
                'boolean',
                'date',
                'list',
                'select',
                'node',
                'micronode'
            ];

            // ensure the displayField is set
            if (typeof obj.displayField === 'undefined' || obj.displayField === '') {
                error('Please specify a displayField.');
                return false;
            }
            // ensure the segmentField is set
            if (typeof obj.segmentField === 'undefined' || obj.segmentField === '') {
                error('Please specify a segmentField.');
                return false;
            }
            // ensure at least one field has been defined
            if (!obj.fields || obj.fields.length === 0) {
                error('Schema must have at least one field defined.');
                return false;
            }
            // ensure displayField matches an actual field name
            let fieldNames = obj.fields.map(field => field.name);
            if (fieldNames.indexOf(obj.displayField) === -1) {
                error(`displayField value "${obj.displayField}" does not match any fields.`);
                return false;
            }
            // ensure segmentField matches an actual field name
            if (fieldNames.indexOf(obj.segmentField) === -1) {
                error(`segmentField value "${obj.segmentField}" does not match any fields.`);
                return false;
            }
            // ensure each field has a name and type
            let badFields = obj.fields.filter(field => {
                return !field.name || !field.type;
            });
            if (0 < badFields.length) {
                error(`All fields must have a "name" and "type" property.`);
                return false;
            }
            // ensure only valid field types are used
            let badFieldTypes = obj.fields.filter(field => -1 === validTypes.indexOf(field.type));
            if (0 < badFieldTypes.length) {
                let names = fieldPropString(badFieldTypes, 'type');
                error(`The following fields have invalid types ${names}.`);
                return false;
            }
            // ensure a list type has listType set to a valid type
            let listFields = obj.fields.filter(field => field.type === 'list');
            if (0 < listFields.length) {
                let badListFields = listFields.filter(field => -1 === validTypes.indexOf(field.listType));
                if (0 < badListFields.length) {
                    let names = fieldPropString(badListFields, 'listType');
                    error(`The following list fields have an invalid listType ${names}.`);
                    return false;
                }
            }
            // ensure any micronode types or listTypes have an allow property defined.
            let micronodeFields = obj.fields.filter(field => field.type === 'micronode' || field.listType === 'micronode');
            if (0 < micronodeFields.length) {
                const isArray = x => x instanceof Array;
                const isUndefined = x => typeof x === undefined;
                let badMicronodeFields = micronodeFields.filter(field => isUndefined(field.allow) || !isArray(field.allow));
                if (0 < badMicronodeFields.length) {
                    let names = fieldPropString(badMicronodeFields);
                    error(`The following micronode fields must have an "allow" property defined: ${names}.`);
                    return false;
                }
            }
            return true;
        }

    }

    angular.module('meshAdminUi.common')
        .service('schemaValidatorService', SchemaValidatorService);
}