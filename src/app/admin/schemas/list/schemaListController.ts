module meshAdminUi {

    class SchemaListController {

        public schemas: ISchema[];
        public schemaFilter: string;

        constructor(private dataService: DataService,
                    private mu: MeshUtils) {
            // TODO: implement paging
            dataService.getSchemas({ perPage: 10000 })
                .then(response => this.schemas = response.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.schemaFilter);
        };

    }

    angular.module('meshAdminUi.admin')
            .controller('SchemaListController', SchemaListController);

}