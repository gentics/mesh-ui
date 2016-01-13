module meshAdminUi {

    /**
     * Component representing a single editable field in the schema editor.
     */
    class SchemaFieldController {

        public field: ISchemaFieldDefinition;
        public onChange: Function;
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

        public micronodeAllow: string = '';

        constructor($scope: ng.IScope) {
            $scope.$watch(() => this.field.allow, () => {
                if (this.field.type === 'micronode' && this.field.allow instanceof Array) {
                    this.micronodeAllow = this.field.allow[0];
                }
            });
        }

        public getTypeIcon(field: ISchemaFieldDefinition): string {
            return this.types.filter(type => type.name === field.type)[0].icon;
        }

        /**
         * We cannot use ng-model to directly bind to the "allow" property of a 'micronode', since
         * it would update the "allow" with a string value rather than an array.
         * Therefore we manually create an array with a single string element.
         */
        public updateMicronodeAllow(value: string) {
            this.field.allow = [value];
            console.log('this.field.allow', this.field.allow);
            this.onChange();
        }

    }

    class MicroschemaFieldController extends SchemaFieldController {

        constructor($scope: ng.IScope) {
            super($scope);
            // micronodes are not a valid type in a microschema field.
            this.types = this.types.filter(type => type.name !== 'micronode');
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

    function microschemaFieldDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaEditor/schemaField.html',
            controller: 'MicroschemaFieldController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                field: '=',
                schemas: '=',
                onChange: '&',
                onDelete: '&'
            }
        }
    }

    angular.module('meshAdminUi.admin')
        .directive('schemaField', schemaFieldDirective)
        .directive('microschemaField', microschemaFieldDirective)
        .controller('SchemaFieldController', SchemaFieldController)
        .controller('MicroschemaFieldController', MicroschemaFieldController);
}
