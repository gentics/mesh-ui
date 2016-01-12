module meshAdminUi {

    class SchemaEditorController {

        public schema: ISchema;
        public schemas: ISchema[];
        public microschemas: IMicroschema[];
        public onChange: Function;
        private dragStartIndex: number;

        constructor() {
            this.schema = angular.copy(this.schema);
        }

        /**
         * Add a new empty field and update the schema.
         */
        public addField() {
            this.schema.fields.push({
                name: '',
                label: '',
                type: 'string',
                required: false
            });
            this.schemaChanged();
        }

        /**
         * Remove the field at index from the schema
         */
        public removeField(index: number) {
            this.schema.fields.splice(index, 1);
            this.schemaChanged();
        }

        /**
         * Invoke the onChange callback and pass it the updated schema.
         */
        public schemaChanged() {
            this.schema.fields = this.schema.fields.map(this.cleanFields);
            this.onChange({ schema: this.schema });
        }

        /**
         * Removes unused properties from a field definition.
         */
        private cleanFields(field: ISchemaFieldDefinition) {
            if (field.type !== 'list') {
                delete field.listType;
            }
            if (field.type !== 'micronode' && field.listType !== 'micronode' &&
                field.type !== 'node' && field.listType !== 'node') {
                delete field.allow;
            }
            if (field.type !== 'number' && field.listType !== 'number') {
                delete field.min;
                delete field.max;
                delete field.step;
            }
            return field;
        };

        /**
         * Returns an array of strings representing the names of string or html fields,
         * which may be used as the value of the `displayName` or `segmentName` property.
         */
        public getTextFields(): string[] {
            if (!this.schema || !(this.schema.fields instanceof Array)) {
                return [];
            }
            const textFields = (field: ISchemaFieldDefinition) => {
                return field.type === 'string' || field.type === 'html';
            };
            const fieldName = (field: ISchemaFieldDefinition) => field.name;

            return this.schema.fields.filter(textFields).map(fieldName);
        }

        /**
         * Record the index of the item that is being dragged.
         */
        public startDrag(index: number) {
            console.log('starting drag at index ', index);
            this.dragStartIndex = index;
        }

        /**
         * Remove the original dragged item from the list.
         */
        public endDrag(item: ISchemaFieldDefinition, dragEndIndex: number, list: any[]) {
            console.log('ending drag at index ', dragEndIndex);
            var indexToSplice;

            if (dragEndIndex < this.dragStartIndex) {
                indexToSplice = this.dragStartIndex + 1;
            } else {
                indexToSplice = this.dragStartIndex;
            }

            list.splice(dragEndIndex, 0, item); // add the new position
            list.splice(indexToSplice, 1); // remove the old position
            this.schemaChanged();
        }

    }

    function schemaEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaEditor/schemaEditor.html',
            controller: 'SchemaEditorController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                schema: '=',
                schemas: '=',
                microschemas: '=',
                onChange: '&'
            }
        }
    }

    angular.module('meshAdminUi.admin')
        .directive('schemaEditor', schemaEditorDirective)
        .controller('SchemaEditorController', SchemaEditorController);
}
