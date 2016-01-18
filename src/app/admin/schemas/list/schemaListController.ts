module meshAdminUi {

    class SchemaListController {

        public schemas: ISchema[];
        public schemaFilter: string;
        public selected: any = {};

        constructor(private dataService: DataService,
                    private notifyService: NotifyService,
                    private schemaImportExportService: SchemaImportExportService,
                    private mu: MeshUtils) {
            // TODO: implement paging
            dataService.getSchemas({ perPage: 10000 })
                .then(response => this.schemas = response.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.schemaFilter);
        };

        public exportSelected() {
            this.schemaImportExportService.exportSelected(this.schemas, this.selected);
        }

        public processImport(files: File[]) {
            const onErrors = errors => this.notifyService.toast(errors);

            this.schemaImportExportService.importSchemas(files, onErrors)
                .then(results => {
                    this.notifyService.toast(`Imported ${results.length} schemas.`);

                    return this.dataService.getSchemas({ perPage: 10000 });
                })
                .then(response => this.schemas = response.data);
        }

        /**
         * Returns false if at least one schema is selected.
         */
        public selectionEmpty(): boolean {
            return 0 === Object.keys(this.selected).filter(key => this.selected[key]).length;
        }

    }

    angular.module('meshAdminUi.admin')
        .controller('SchemaListController', SchemaListController);

}