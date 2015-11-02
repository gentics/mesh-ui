module meshAdminUi {

    class GroupListController {
        private groups: IUserGroup[];
        private roles: IUserRole[];

        constructor(private $q: ng.IQService,
                    private $timeout: ng.ITimeoutService,
                    private notifyService: NotifyService,
                    private dataService: DataService) {
            $q.all([
                dataService.getGroups(),
                dataService.getRoles()
            ])
                .then((dataArray: any[]) => {
                    this.groups = dataArray[0].data;
                    this.roles = dataArray[1].data;
                });
        }

        public validateRole(role, group: IUserGroup) {
            // TODO: group.roles will be a noderef rather than a string.
            var groupAlreadyHasRole = group.roles.map(role => role).indexOf(role.name) > -1;

            if (groupAlreadyHasRole || !role.name) {
                this.notifyService.toast(`Group already assigned to role "${role.name}"`);
                this.$timeout(() => group.roles = group.roles.filter(role => typeof role !== 'undefined'));
            } else {
                this.dataService.addGroupToRole(group.uuid, role.uuid)
                    .then(() => this.notifyService.toast(`Group ${group.name} added to role "${role.name}"`));
                return role;
            }
        }

        public removeRole(role, group: IUserGroup) {
            this.dataService.removeGroupFromRole(group.uuid, role.uuid)
                .then(() => this.notifyService.toast(`Group ${group.name} removed from role "${role.name}"`));
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
          .controller('GroupListController', GroupListController);

}