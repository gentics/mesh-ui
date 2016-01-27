module meshAdminUi {

    class SchemaListController {

        public schemas: ISchema[];
        public schemaFilter: string;
        public selected: any = {};

        constructor(private dataService: DataService,
                    private mu: MeshUtils) {
            // TODO: implement paging
            this.populateSchemas()
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.schemaFilter);
        };

        public populateSchemas() {
            this.dataService.getSchemas({ perPage: 10000 })
                .then(response => this.schemas = response.data);
        }

        /**
         * Returns false if at least one schema is selected.
         */
        public selectionEmpty(): boolean {
            return 0 === Object.keys(this.selected).filter(key => this.selected[key]).length;
        }

        public clearSelection() {
            this.selected = {};
        }

    }

    angular.module('meshAdminUi.admin')
        .controller('SchemaListController', SchemaListController);

}