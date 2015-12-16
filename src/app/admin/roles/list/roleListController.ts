module meshAdminUi {

    class RoleListController {

        public roles: IUserRole[];
        public rolesFilter: string;

        constructor(private dataService: DataService,
                    private mu: MeshUtils) {
            // TODO: implement paging
            dataService.getRoles({ perPage: 10000 })
                .then(data => this.roles = data.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.rolesFilter);
        };

    }

    angular.module('meshAdminUi.admin')
        .controller('RoleListController', RoleListController);

}