module meshAdminUi {

    class SchemaExportButtonController {
        private schemas: Array<ISchema|IMicroschema>;
        private selected: { [uuid: string]: boolean };
        public filename: string = '';
        public disabled: boolean;
        private onExport: Function;

        constructor($scope: ng.IScope,
                    private schemaImportExportService: SchemaImportExportService) {

            $scope.$watchCollection(() => this.selected, () => {
                if (this.schemas instanceof Array) {
                    this.filename = this.makeFilename();
                }
            });
        }

        /**
         * Make a default filename suggestion based on the selected schema(s)
         */
        private makeFilename(): string {
            const isSchema = this.schemas[0].hasOwnProperty('displayField');
            const prefix = isSchema ? 'mesh-schema-' : 'mesh-microschema-';
            const d = new Date();
            const dateSuffix = `-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            let selectedSchemas = this.schemas.filter(s => this.selected[s.uuid]);

            let name = (selectedSchemas.length === 1) ? selectedSchemas[0].name : 'bundle';

            return prefix + name + dateSuffix;
        }

        public export() {
            this.schemaImportExportService.exportSelected(this.filename, this.schemas, this.selected);
            if (this.onExport) {
                this.onExport();
            }
        }

    }

    function schemaExportButtonDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaExportButton/schemaExportButton.html',
            controller: 'SchemaExportButtonController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                schemas: '=',
                selected: '=',
                disabled: '=',
                onExport: '&'
            },
            transclude: true
        }
    }

    angular.module('meshAdminUi.admin')
        .directive('schemaExportButton', schemaExportButtonDirective)
        .controller('SchemaExportButtonController', SchemaExportButtonController);
}
