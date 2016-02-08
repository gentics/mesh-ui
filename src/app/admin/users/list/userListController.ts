module meshAdminUi {

    class UserListController {
        public groups: IUserGroup[];
        public users: IUser[];
        public userFilter: string;

        constructor(private $q: ng.IQService,
                    private $timeout: ng.ITimeoutService,
                    private notifyService: NotifyService,
                    private mu: MeshUtils,
                    private dataService: DataService) {
            $q.all([
                // TODO: implement paging
                dataService.getGroups({ perPage: 10000 }),
                dataService.getUsers({ perPage: 10000 })
            ])
                .then((dataArray: any[]) => {
                    this.groups = dataArray[0].data;
                    this.users = dataArray[1].data;
                });
        }

        public filterFn = (value: IUser) => {
            let filterProps = ['username', 'firstname', 'lastname', 'emailAddress'];
            return this.mu.matchProps(value, filterProps, this.userFilter);
        };

        public validateGroup(group, user: IUser) {
            var userAlreadyInGroup = user.groups.map(group => group).indexOf(group.name) > -1;

            if (userAlreadyInGroup || !group.name) {
                this.notifyService.toast('USER_ALREADY_IN_GROUP', { name: group.name });
                this.$timeout(() => user.groups = user.groups.filter(group => typeof group !== 'undefined'));
            } else {
                // group is valid, so add the user to this group.
                this.dataService.addUserToGroup(user.uuid, group.uuid)
                    .then(() => this.notifyService.toast('USER_ADDED_TO_GROUP', { userName: this.userDisplayName(user), groupName: group.name }));
                return group;
            }
        }

        public removeGroup(group, user: IUser) {
            this.dataService.removeUserFromGroup(user.uuid, group.uuid)
                .then(() => this.notifyService.toast('USER_REMOVED_FROM_GROUP', { userName: this.userDisplayName(user), groupName: group.name }));
        }

        public userDisplayName(user: IUser): string {
            if (user.firstname && user.lastname) {
                return user.firstname + ' ' + user.lastname;
            } else {
                return user.username;
            }
        }

        public displayChipName(chip: any) {
            return (chip && chip.name) ? chip.name : chip;
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