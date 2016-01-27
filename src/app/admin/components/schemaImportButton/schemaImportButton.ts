module meshAdminUi {

    class SchemaImportButtonController {

        private onImport: Function;
        /**
         * Should be a string, either "schema" or "microschema", which tells
         * the directive which endpoint to send the imported json to.
         */
        private type: string;

        constructor(private schemaImportExportService: SchemaImportExportService,
                    private notifyService: NotifyService) {
        }

        /**
         * Process the imported files.
         */
        public processImport(files: File[]) {
            const onErrors = errors => this.notifyService.toast(errors);

            const importFn = () => {
                if (this.type === 'microschema') {
                    return this.schemaImportExportService.importMicroschemas(files, onErrors);
                } else {
                    this.schemaImportExportService.importSchemas(files, onErrors);
                }
            };

            importFn().then(results => {
                this.notifyService.toast(`Imported ${results.length} schemas.`);

                if (this.onImport) {
                    this.onImport();
                }
            });
        }

    }

    function schemaImportButtonDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaImportButton/schemaImportButton.html',
            controller: 'SchemaImportButtonController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                onImport: '&',
                type: '@'
            }
        }
    }

    angular.module('meshAdminUi.admin')
        .directive('schemaImportButton', schemaImportButtonDirective)
        .controller('SchemaImportButtonController', SchemaImportButtonController);
}
