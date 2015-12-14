module meshAdminUi {

    class MicroschemaListController {

        private microschemas: IMicroschema[];

        constructor(private dataService: DataService) {
            dataService.getMicroschemas()
                .then(response => this.microschemas = response.data);
        }

    }

    angular.module('meshAdminUi.admin')
            .controller('MicroschemaListController', MicroschemaListController);

}