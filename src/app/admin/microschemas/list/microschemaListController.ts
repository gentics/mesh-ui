module meshAdminUi {

    class MicroschemaListController {

        public microschemas: IMicroschema[];
        public microschemaFilter: string;
        public selected: any = {};

        constructor(private dataService: DataService,
                    private notifyService: NotifyService,
                    private schemaImportExportService: SchemaImportExportService,
                    private mu: MeshUtils) {
            dataService.getMicroschemas()
                .then(response => this.microschemas = response.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.microschemaFilter);
        };

        public exportSelected() {
            this.schemaImportExportService.exportSelected(this.microschemas, this.selected);
        }

        public processImport(files: File[]) {
            const onErrors = errors => this.notifyService.toast(errors);

            this.schemaImportExportService.importMicroschemas(files, onErrors)
                .then(results => {
                    this.notifyService.toast(`Imported ${results.length} microschemas.`);

                    return this.dataService.getMicroschemas({ perPage: 10000 });
                })
                .then(response => this.microschemas = response.data);
        }

        /**
         * Returns false if at least one schema is selected.
         */
        public selectionEmpty(): boolean {
            return 0 === Object.keys(this.selected).filter(key => this.selected[key]).length;
        }

    }

    angular.module('meshAdminUi.admin')
            .controller('MicroschemaListController', MicroschemaListController);

}