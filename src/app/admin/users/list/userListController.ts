module meshAdminUi {

    class UserListController {
        private groups: IUserGroup[];
        private users: IUser[];
        private roles: IUserRole[];

        constructor(private $q: ng.IQService,
                    private dataService: DataService) {
            $q.all([
                dataService.getGroups(),
                dataService.getUsers(),
                dataService.getRoles()
            ])
                .then((dataArray: any[]) => {
                    this.groups = dataArray[0].data;
                    this.users = dataArray[1].data;
                    this.roles = dataArray[2].data;
                });
        }

        public validateGroup(group, user) {
            var userAlreadyInGroup = user.groups.map(function (group) {
                    return group.name;
                }).indexOf(group.name) > -1;

            if (userAlreadyInGroup || !group.name) {
                return {
                    name: "invalid group name"
                };
            } else {
                return group;
            }
        }

        public validateRole(role, group) {
            var groupAlreadyHasRole = group.roles.map(function (role) {
                    return role.name;
                }).indexOf(role.name) > -1;

            if (groupAlreadyHasRole || !role.name) {
                return {
                    name: "invalid role"
                };
            } else {
                return role;
            }
        }

        public userDisplayName(user: IUser): string {
            if (user.firstname && user.lastname) {
                return user.firstname + ' ' + user.lastname;
            } else {
                return user.username;
            }
        }

        /**
         * Search for thing.
         */
        public filterBy(collection, query) {
            return query ? collection.filter(this.createFilterFor(query)) : [];
        }

        /**
         * Create filter function for a query string
         */
        private createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return item => item.name.toLowerCase().indexOf(lowercaseQuery) === 0;
        }
    }

    angular.module('meshAdminUi.admin')
          .controller('UserListController', UserListController);

}