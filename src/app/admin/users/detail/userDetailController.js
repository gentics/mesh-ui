angular.module('meshAdminUi.admin')
    .controller('UserDetailController', UserDetailController);

/**
 *
 * @param {ng.ui.IStateService} $state
 * @param {ng.ui.IStateParamsService} $stateParams
 * @param {ConfirmActionDialog} confirmActionDialog
 * @param {DataService} dataService
 * @param {NotifyService} notifyService
 * @constructor
 */
function UserDetailController($state, $stateParams, confirmActionDialog, dataService, notifyService) {
    var vm = this;

    vm.isNew = false;
    vm.modified = false;
    vm.persist = persist;
    vm.remove = remove;
    vm.canDelete = canDelete;

    getUserData();

    /**
     * Persist the user data back to the server.
     */
    function persist(user) {
        dataService.persistUser(user)
            .then(function() {
                return persistUserGroups(user.groups, selectedGroupsToArray(vm.selectedGroups));
            })
            .then(function(response) {
                if (vm.isNew) {
                    notifyService.toast('NEW_USER_CREATED');
                    vm.isNew = false;
                    $state.go('admin.users.detail', { uuid: response.uuid });
                } else {
                    notifyService.toast('SAVED_CHANGES');
                    vm.modified = false;
                }
            });
    }

    /**
     * Delete the open content, displaying a confirmation dialog first before making the API call.
     * @param user
     */
    function remove(user) {

        showDeleteDialog()
            .then(function() {
                return dataService.deleteUser(user);
            })
            .then(function() {
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
        if (vm.user) {
            // TODO: reinstate once API returns permissions correctly, see https://jira.gentics.com/browse/CL-110
            //return -1 < vm.project.perms.indexOf('delete') && !vm.isNew;
            return !vm.isNew;
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
                .then(function(data) {
                    vm.groups = data;
                    return dataService.getUser($stateParams.uuid);
                })
                .then(function (data) {
                    vm.user = data;
                    vm.selectedGroups = groupsArrayToObject(vm.user.groups);
                });
        } else {
            vm.user = createEmptyUser();
            vm.isNew = true;
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