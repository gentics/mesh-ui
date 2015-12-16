module meshAdminUi {

    class MicroschemaListController {

        public microschemas: IMicroschema[];
        public microschemaFilter: string;

        constructor(private dataService: DataService,
                    private mu: MeshUtils) {
            dataService.getMicroschemas()
                .then(response => this.microschemas = response.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.microschemaFilter);
        };

    }

    angular.module('meshAdminUi.admin')
            .controller('MicroschemaListController', MicroschemaListController);

}