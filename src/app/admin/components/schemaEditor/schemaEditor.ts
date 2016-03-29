module meshAdminUi {

    /**
     * A common controller for both the schemaEditor and microschemaEditor. Most of the functionality is shared, except
     * that in the case of microschemas, certain fields are not needed.
     */
    class SchemaEditorBaseController {

        public baseSchema: ISchema | IMicroschema;
        public onChange: Function;
        private dragStartIndex: number;

        /**
         * Add a new empty field and update the schema.
         */
        public addField() {
            this.baseSchema.fields.push({
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
            this.baseSchema.fields.splice(index, 1);
            this.schemaChanged();
        }

        /**
         * Invoke the onChange callback and pass it the updated schema.
         */
        public schemaChanged() {
            this.baseSchema.fields.forEach(this.cleanFields);
            this.onChange({ schema: this.baseSchema });
        }

        /**
         * Removes unused properties from a field definition.
         */
        private cleanFields(field: ISchemaFieldDefinition) {
            if (field.type !== 'list') {
                delete field.listType;
            }
            if (field.type !== 'micronode' && field.listType !== 'micronode' &&
                field.type !== 'node' && field.listType !== 'node' &&
                field.type !== 'string' && field.listType !== 'string') {
                delete field.allow;
            }
            if (field.type !== 'number' && field.listType !== 'number') {
                delete field.min;
                delete field.max;
                delete field.step;
            }
            if (field.hasOwnProperty('$$mdSelectId')) {
                delete field['$$mdSelectId'];
            }
            return field;
        };

        /**
         * Filter for string or html fields,
         * which may be used as the value of the `displayName` or `segmentName` property.
         */
        public textFields(field: ISchemaFieldDefinition) {
            return (field.type === 'string' || field.type === 'html');
        }

        /**
         * Record the index of the item that is being dragged.
         */
        public startDrag(index: number) {
            this.dragStartIndex = index;
        }

        /**
         * Remove the original dragged item from the list.
         */
        public endDrag(item: ISchemaFieldDefinition, dragEndIndex: number, list: any[]) {
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

    class SchemaEditorController extends SchemaEditorBaseController {

        private schema: ISchema;
        public schemas: ISchema[];
        public microschemas: IMicroschema[];
        public displayFieldValue: ISchemaFieldDefinition;
        public segmentFieldValue: ISchemaFieldDefinition;

        constructor($scope: ng.IScope) {
            super();
            let unwatch = $scope.$watch(() => this.schema, val => {
                if (val !== undefined) {
                    console.log('setting schema fields', val);
                    this.baseSchema = val;
                    this.displayFieldValue = this.schema.fields.filter(f => f.name === this.schema.displayField)[0];
                    this.segmentFieldValue = this.schema.fields.filter(f => f.name === this.schema.segmentField)[0];
                    unwatch();
                }
            });
        }

        public updateDisplayField() {
            this.schema.displayField = this.displayFieldValue.name;
            this.schemaChanged();
        }

        public updateSegmentField() {
            this.schema.segmentField = this.segmentFieldValue.name;
            this.schemaChanged();
        }
    }

    class MicroschemaEditorController extends SchemaEditorBaseController {

        public microschema: IMicroschema;

        constructor($scope: ng.IScope) {
            super();
            let unwatch = $scope.$watch(() => this.microschema, val => {
                if (val !== undefined) {
                    this.baseSchema = val;
                    unwatch();
                }
            });
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

    function microschemaEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaEditor/microschemaEditor.html',
            controller: 'MicroschemaEditorController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                microschema: '=',
                schemas: '=',
                onChange: '&'
            }
        }
    }

    angular.module('meshAdminUi.admin')
        .directive('schemaEditor', schemaEditorDirective)
        .directive('microschemaEditor', microschemaEditorDirective)
        .controller('SchemaEditorController', SchemaEditorController)
        .controller('MicroschemaEditorController', MicroschemaEditorController);
}
