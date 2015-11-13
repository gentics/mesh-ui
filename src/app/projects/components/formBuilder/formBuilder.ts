module meshAdminUi {

    /**
     * Component for auto-generating a form from schema data.
     *
     * API:
     * ====
     * fields = the object properties from the node fields
     * schema = the schema fields definitions
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
                onChange: '&',
                perms: '=',
                displayField: '='
            }
        };
    }

    class FormBuilderController {

        public nodeFieldModelCollection: INodeFieldModel[];
        private fields: INodeFields;
        private schema: ISchemaFieldDefinition[];
        private onChange: Function;
        private perms: string[];
        private displayField: string;

        constructor($scope: ng.IScope, private mu: MeshUtils) {
            if (!this.perms) {
                this.perms = [];
            }
            $scope.$watch(() => this.schema, val => {
                if (val) {
                    this.nodeFieldModelCollection = this.createNodeFieldsModel(this.fields, this.schema);
                }
            });
        }

        private createNodeFieldsModel(nodeFields: INodeFields, schemaFields: ISchemaFieldDefinition[]): INodeFieldModel[] {
            let canUpdate =  -1 < this.perms.indexOf('update');
            return schemaFields.map(schemaField => {
                let model: INodeFieldModel = <INodeFieldModel>angular.copy(schemaField);
                model.id = this.mu.generateGuid();
                model.value = nodeFields[schemaField.name];
                model.path = [schemaField.name];
                model.canUpdate = canUpdate;
                model.isDisplayField = schemaField.name === this.displayField;
                model.update = this.makeUpdateFunction(model.path);
                model.updateFnFactory = (path) => this.makeUpdateFunction(path);
                return model;
            });
        }

        /**
         * Returns a pre-configured function that will update the node field specified by a path array.
         */
        private makeUpdateFunction(path): (value: any) => any {
            return (value) => {
                this.onChange();
                this.updateAtPath(this.fields, path, value);
            }
        }

        /**
         * Given an object, update the value specified by the `path` array with the given value.
         */
        private updateAtPath(object: any, path: any[], value: any): any {
            let pointer = object;
            for (let i = 0; i < path.length - 1; i ++) {
                let key = path[i];
                pointer = pointer[key];
            }
            return pointer[path[path.length - 1]] = value;
        }
    }

    angular.module('meshAdminUi.projects.formBuilder')
        .directive('formBuilder', formBuilderDirective)
        .controller('formBuilderController', FormBuilderController);

}