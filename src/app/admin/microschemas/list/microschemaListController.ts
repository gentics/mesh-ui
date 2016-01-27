module meshAdminUi {

    class MicroschemaListController {

        public microschemas: IMicroschema[];
        public microschemaFilter: string;
        public selected: any = {};

        constructor(private dataService: DataService,
                    private notifyService: NotifyService,
                    private schemaImportExportService: SchemaImportExportService,
                    private mu: MeshUtils) {
            this.populateMicroschemas();
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.microschemaFilter);
        };

        public populateMicroschemas() {
            this.dataService.getMicroschemas()
                           .then(response => this.microschemas = response.data);
        }

        public clearSelection() {
            this.selected = {};
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