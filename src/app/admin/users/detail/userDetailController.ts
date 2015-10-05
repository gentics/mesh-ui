
module meshAdminUi {

    angular.module('meshAdminUi.admin')
        .controller('UserDetailController', UserDetailController);

    /**
     *
     */
    function UserDetailController($state, $stateParams, confirmActionDialog, dataService, notifyService) {
        this.isNew = false;
        this.modified = false;
        this.persist = persist;
        this.remove = remove;
        this.canDelete = canDelete;

        getUserData();

        /**
         * Persist the user data back to the server.
         */
        function persist(user) {
            dataService.persistUser(user)
                .then(() => {
                    //return persistUserGroups(user.groups, this.selectedGroupsToArray(this.selectedGroups));
                })
                .then(function (response) {
                    if (this.isNew) {
                        notifyService.toast('NEW_USER_CREATED');
                        this.isNew = false;
                        $state.go('admin.users.detail', {uuid: response.uuid});
                    } else {
                        notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                });
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         * @param user
         */
        function remove(user) {

            showDeleteDialog()
                .then(function () {
                    return dataService.deleteUser(user);
                })
                .then(function () {
                    notifyService.toast('Deleted');
                    $state.go('admin.users.list');
                });
        }

        /**
         * @returns {ng.IPromise}
         */
        function showDeleteDialog() {
            return confirmActionDialog.show({
                title: 'Delete User?',
                message: 'Are you sure you want to delete this user?'
            });
        }

        function canDelete() {
            if (this.user) {
                // TODO: reinstate once API returns permissions correctly, see https://jira.gentics.com/browse/CL-110
                //return -1 < this.project.perms.indexOf('delete') && !this.isNew;
                return !this.isNew;
            }
        }

        /**
         * Get the user data from the server, or in the case of a new user,
         * create an empty user object.
         *
         * @returns {ng.IPromise<Object>}
         */
        function getUserData() {
            var userId = $stateParams.uuid;
            if (userId) {
                return dataService.getGroups()
                    .then(function (data) {
                        this.groups = data;
                        return dataService.getUser($stateParams.uuid);
                    })
                    .then(function (data) {
                        this.user = data;
                        //this.selectedGroups = groupsArrayToObject(this.user.groups);
                    });
            } else {
                this.user = createEmptyUser();
                this.isNew = true;
            }
        }

        /**
         * Create an empty user object.
         * @returns {{firstname: String(""), lastname: String(""), emailAddress: String(""), username: String("")}}
         */
        function createEmptyUser() {
            return {
                firstname: '',
                lastname: '',
                emailAddress: '',
                username: '',
                password: ''
            };
        }
    }
}