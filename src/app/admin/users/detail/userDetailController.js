angular.module('meshAdminUi.admin')
    .controller('UserDetailController', UserDetailController);

/**
 *
 * @param {ng.IQService} $q
 * @param {ng.ui.IStateService} $state
 * @param {ng.ui.IStateParamsService} $stateParams
 * @param {ConfirmActionDialog} confirmActionDialog
 * @param {DataService} dataService
 * @param {NotifyService} notifyService
 * @constructor
 */
function UserDetailController($q, $state, $stateParams, confirmActionDialog, dataService, notifyService) {
    var vm = this;

    vm.isNew = false;
    vm.modified = false;
    vm.persist = persist;
    vm.remove = remove;
    vm.canDelete = canDelete;
    vm.selectedGroups = {};

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
     * Set the groups that this user belongs to. Two lists are needed in order to do a
     * diff and then trigger the correct API "add" and "remove" calls.
     *
     * @param {Array<string>} originalGroups
     * @param {Array<string>} selectedGroups
     * @returns {ng.IPromise<any[]>|ng.IPromise<{}>}
     */
    function persistUserGroups(originalGroups, selectedGroups) {
        var asyncCalls = [];

        originalGroups.forEach(function(groupName) {
            if (-1 === selectedGroups.indexOf(groupName)) {
                asyncCalls.push(doRemoveFromGroupCall(groupName));
            }
        });
        selectedGroups.forEach(function(groupName) {
            if (-1 === originalGroups.indexOf(groupName)) {
                asyncCalls.push(doAddToGroupCall(groupName));
            }
        });

        return $q.all(asyncCalls);
    }

    /**
     * Given a group name, do a call to the server to remove the user from this group.
     * @param {string} groupName
     * @returns {*}
     */
    function doRemoveFromGroupCall(groupName) {
        if (groupName !== null) {
            return dataService.removeUserFromGroup(vm.user.uuid, groupNameToId(groupName));
        }
    }

    /**
     * Given a group name, do a call to the server to add the user to this group.
     * @param {string} groupName
     * @returns {*}
     */
    function doAddToGroupCall(groupName) {
        if (groupName !== null) {
            return dataService.addUserToGroup(vm.user.uuid, groupNameToId(groupName));
        }
    }

    /**
     * Returns the group uuid associated with the specified group name.
     * @param {string} name
     * @returns {string}
     */
    function groupNameToId(name) {
        return vm.groups.filter(function(group) {
            return group.name === name;
        })[0].uuid;
    }

    /**
     * Convert an array of group names into an object hash that can be used as a model for the
     * group select checkboxes.
     *
     * @param {Array<string>} groupsArray
     * @returns {Object<string, boolean>}
     */
    function groupsArrayToObject(groupsArray) {
        var selectedGroups = {};

        groupsArray.forEach(function(groupName) {
            selectedGroups[groupName] = true;
        });

        return selectedGroups;
    }

    /**
     * Convert the object hash containing the selected groups back into an array of the selected
     * group names.
     *
     * @param {Object<string, boolean>}selectedGroups
     * @returns {Array<string>}
     */
    function selectedGroupsToArray(selectedGroups) {
        var groups = [];
        for (var groupName in selectedGroups) {
           if (selectedGroups.hasOwnProperty(groupName) && selectedGroups[groupName] === true) {
               groups.push(groupName);
           }
        }
        return groups;
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