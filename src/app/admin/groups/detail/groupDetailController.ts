
module meshAdminUi {

    /**
     *
     */
    class GroupDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        private group: IUserGroup;

        constructor(
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private confirmActionDialog: ConfirmActionDialog,
            private dataService: DataService,
            private notifyService: NotifyService) {

            this.getGroupData();
        }


        /**
         * Persist the user data back to the server.
         */
        public persist(group: IUserGroup) {
            this.dataService.persistGroup(group)
                .then((response: any) => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_GROUP_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.groups.detail', {uuid: response.uuid});
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                });
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(group: IUserGroup) {
            return this.showDeleteDialog()
                .then(() => this.dataService.deleteGroup(group.uuid))
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.$state.go('admin.groups.list');
                });
        }

        /**
         */
        private showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'CONFIRM_DELETE_GROUP_TITLE',
                message: 'CONFIRM_DELETE_GROUP_MESSAGE'
            });
        }

        public canDelete() {
            if (this.group) {
                return this.group.permissions && this.group.permissions.delete && !this.isNew;
            }
        }

        /**
         * Get the user data from the server, or in the case of a new user,
         * create an empty user object.
         */
        private getGroupData() {
            var uuid = this.$stateParams.uuid;
            if (uuid && uuid !== 'new') {
                return this.dataService.getGroup(uuid)
                    .then(data => this.group = data);
            } else {
                this.group = this.createEmptyGroup();
                this.isNew = true;
            }
        }

        /**
         * Create an empty user object.
         */
        private createEmptyGroup(): IUserGroup {
            return {
                name: '',
                roles: []
            };
        }
    }

    angular.module('meshAdminUi.admin')
          .controller('GroupDetailController', GroupDetailController);
}