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
                displayField: '=',
                projectName: '=',
                node: '='
            }
        };
    }

    class FormBuilderController {

        public nodeFieldModels: INodeFieldModel[];
        private fields: INodeFields;
        private schema: ISchemaFieldDefinition[];
        private onChange: Function;
        private perms: string[];
        private displayField: string;
        private projectName: string;
        private node: INode;

        constructor($scope: ng.IScope,
                    private formBuilderService: FormBuilderService) {
            if (!this.perms) {
                this.perms = [];
            }
            $scope.$watch(() => this.schema, val => {
                if (val) {
                    let canUpdate = -1 < this.perms.indexOf('update');
                    let config: INodeFieldModelConfig = {
                        nodeFields: this.fields,
                        schemaFields: this.schema,
                        canUpdate: canUpdate,
                        onChange: this.onChange,
                        displayField: this.displayField,
                        projectName: this.projectName,
                        node: this.node
                    };
                    this.nodeFieldModels = formBuilderService.createNodeFieldModels(config);
                }
            });
        }
    }

    angular.module('meshAdminUi.projects.formBuilder')
        .directive('formBuilder', formBuilderDirective)
        .controller('formBuilderController', FormBuilderController);

}