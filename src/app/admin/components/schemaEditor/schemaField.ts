module meshAdminUi {

    /**
     * Component representing a single editable field in the schema editor.
     */
    class SchemaFieldController {

        public types = [
            { name: 'string', icon: 'icon-type' },
            { name: 'number', icon: 'icon-hash' },
            { name: 'html', icon: 'icon-code' },
            { name: 'boolean', icon: 'icon-check-box' },
            { name: 'date', icon: 'icon-event' },
            { name: 'node', icon: 'icon-link' },
            { name: 'list', icon: 'icon-list' },
            { name: 'micronode', icon: 'icon-view-quilt' }
        ];

        constructor() {
        }

        public getTypeIcon(field: ISchemaFieldDefinition): string {
            return this.types.filter(type => type.name === field.type)[0].icon;
        }

    }

    function schemaFieldDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaEditor/schemaField.html',
            controller: 'SchemaFieldController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                field: '=',
                schemas: '=',
                microschemas: '=',
                onChange: '&',
                onDelete: '&'
            }
        }
    }

    angular.module('meshAdminUi.admin')
        .directive('schemaField', schemaFieldDirective)
        .controller('SchemaFieldController', SchemaFieldController);
}
