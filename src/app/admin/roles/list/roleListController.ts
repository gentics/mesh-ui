module meshAdminUi {

    class RoleListController {

        private roles: IUserRole[];

        constructor(private dataService: DataService) {
            dataService.getRoles()
                .then(data => {
                    this.roles = data.data;
                });
        }

    }

    angular.module('meshAdminUi.admin')
            .controller('RoleListController', RoleListController);

}