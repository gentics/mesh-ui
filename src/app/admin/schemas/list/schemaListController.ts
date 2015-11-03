module meshAdminUi {

    class SchemaListController {

        private schemas: ISchema[];

        constructor(private dataService: DataService) {
            dataService.getSchemas()
                .then(response => this.schemas = response.data);
        }

    }

    angular.module('meshAdminUi.admin')
            .controller('SchemaListController', SchemaListController);

}