
module meshAdminUi {

    export class SchemaValidatorService {

        /**
         * Some basic validation of the schema def.
         */
        public validateSchemaJson(json: string, onError?: (message: string) => void ): boolean {
            const error = (message: string) => {
                if (onError !== undefined) {
                    onError(message);
                }
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
                let names = badFieldTypes.map(field => `[${field.name} : ${field.type}]`).join(', ');
                error(`The following fields have invalid types ${names}`);
                return false;
            }
            // ensure a list type has listType set to a valid type
            let listFields = obj.fields.filter(field => field.type === 'list');
            if (0 < listFields.length) {
                let badListFields = listFields.filter(field => -1 === validTypes.indexOf(field.listType));
                if (0 < badListFields.length) {
                    let names = badListFields.map(field => `[${field.name} : ${field.listType}]`).join(', ');
                    error(`The following list fields have an invalid listType ${names}`);
                    return false;
                }
            }

            return true;
        }

    }

    angular.module('meshAdminUi.admin')
        .service('schemaValidatorService', SchemaValidatorService);
}