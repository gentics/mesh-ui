module meshAdminUi {

    /**
     * Component for auto-generating a form from schema data.
     *
     * API:
     * ====
     * fields = the object properties from the node fields
     * schema = the schema fields definitions
     * modified-flag = boolean value that will be set to true when user modifies any form fields.
     *
     */
    function formBuilderDirective() {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'projects/components/formBuilder/formBuilder.html',
            controller: 'formBuilderController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                fields: '=',
                schema: '=',
                modified: '=modifiedFlag',
                perms: '=',
                displayField: '='
            }
        };
    }

    class FormBuilderController {

        public nodeFieldModelCollection: INodeFieldModel[];
        private fields: INodeFields;
        private schema: ISchemaFieldDefinition[];
        private modified: boolean;
        private perms: string[];
        private displayField: string;

        constructor($scope: any) {
            var unwatch = $scope.$watch(() => this.schema, val => {
                if (val) {
                    this.nodeFieldModelCollection = this.createNodeFieldsModel(this.fields, this.schema);
                }
            })
        }

        private createNodeFieldsModel(nodeFields: INodeFields, schemaFields: ISchemaFieldDefinition[]): INodeFieldModel[] {
            let canUpdate =  -1 < this.perms.indexOf('update');
            return schemaFields.map(schemaField => {
                let model: INodeFieldModel = <INodeFieldModel>angular.copy(schemaField);
                model.value = nodeFields[schemaField.name];
                model.path = [schemaField.name];
                model.canUpdate = canUpdate;
                model.isDisplayField = schemaField.name === this.displayField;
                model.update = this.makeUpdateFunction(model.path);
                return model;
            });
        }

        private makeUpdateFunction(path) {
            return (value) => {
                console.log('The value', value, 'will update in the path', path);
            }
        }
    }

    angular.module('meshAdminUi.projects.formBuilder')
        .directive('formBuilder', formBuilderDirective)
        .controller('formBuilderController', FormBuilderController);

}