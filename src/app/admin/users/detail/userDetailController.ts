
module meshAdminUi {

    /**
     *
     */
    class UserDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        private user: IUser;

        constructor(
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private confirmActionDialog: ConfirmActionDialog,
            private dataService: DataService,
            private notifyService: NotifyService) {

            this.getUserData();
        }


        /**
         * Persist the user data back to the server.
         */
        public persist(user: IUser) {
            this.dataService.persistUser(user)
                .then((response: any) => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_USER_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.users.detail', {uuid: response.uuid});
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                });
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(user: IUser) {

            this.showDeleteDialog()
                .then(() => {
                    return this.dataService.deleteUser(user);
                })
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.$state.go('admin.users.list');
                });
        }

        /**
         * @returns {ng.IPromise}
         */
        private showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'Delete User?',
                message: 'Are you sure you want to delete this user?'
            });
        }

        public canDelete() {
            if (this.user) {
                return this.user.permissions && -1 < this.user.permissions.indexOf('delete') && !this.isNew;
            }
        }

        /**
         * Get the user data from the server, or in the case of a new user,
         * create an empty user object.
         */
        private getUserData() {
            var userId = this.$stateParams.uuid;
            if (userId) {
                return this.dataService.getUser(userId)
                    .then(data => this.user = data);
            } else {
                this.user = this.createEmptyUser();
                this.isNew = true;
            }
        }

        /**
         * Create an empty user object.
         */
        private createEmptyUser(): IUser {
            return {
                firstname: '',
                lastname: '',
                emailAddress: '',
                username: '',
                password: '',
                groups: []
            };
        }
    }

    angular.module('meshAdminUi.admin')
          .controller('UserDetailController', UserDetailController);
}