angular.module('meshAdminUi.admin')
    .controller('RoleDetailController', RoleDetailController);

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
function RoleDetailController($q, $state, $stateParams, confirmActionDialog, dataService, notifyService) {
    var vm = this;

    vm.roleId = $stateParams.uuid;
    vm.isNew = false;
    vm.modified = false;
    vm.persist = persist;
    vm.remove = remove;
    vm.canDelete = canDelete;

    getRoleData();

    var queryParams = {
        "role": $stateParams.uuid
    };

    $q.all([
        dataService.getSchemas(queryParams),
        dataService.getMicroschemas(queryParams),
        dataService.getProjects(queryParams),
        dataService.getRoles(queryParams),
        dataService.getGroups(queryParams),
        dataService.getUsers(queryParams)
    ])
        .then(function(dataArray) {
            vm.schemas = dataArray[0];
            vm.microschemas = dataArray[1];
            vm.projects = dataArray[2];
            vm.roles = dataArray[3];
            vm.groups = dataArray[4];
            vm.users = dataArray[5];
        });

    /**
     * Persist the project data back to the server.
     */
    function persist() {
        dataService.persistProject(vm.project)
            .then(function(response) {
                if (vm.isNew) {
                    notifyService.toast('NEW_ROLE_CREATED');
                    vm.isNew = false;
                    $state.go('admin.roles.detail', { uuid: response.uuid });
                } else {
                    notifyService.toast('SAVED_CHANGES');
                    vm.modified = false;
                }
            });
    }

    /**
     * Delete the open content, displaying a confirmation dialog first before making the API call.
     * @param project
     */
    function remove(project) {

        showDeleteDialog()
            .then(function() {
                return dataService.deleteProject(project);
            })
            .then(function() {
                notifyService.toast('Deleted');
                $state.go('admin.roles.list');
            });
    }

    /**
     * @returns {ng.IPromise}
     */
    function showDeleteDialog() {
        return confirmActionDialog.show({
            title: 'Delete Role?',
            message: 'Are you sure you want to delete this role?'
        });
    }

    function canDelete() {
        if (vm.project) {
            // TODO: reinstate once API returns permissions correctly, see https://jira.gentics.com/browse/CL-110
            //return -1 < vm.project.perms.indexOf('delete') && !vm.isNew;
            return !vm.isNew;
        }
    }

    /**
     * Get the project data from the server, or in the case of a new project,
     * create an empty project object.
     *
     * @returns {ng.IPromise<Object>}
     */
    function getRoleData() {
        var roleId = $stateParams.uuid;
        if (roleId) {
            return dataService.getRole($stateParams.uuid)
                .then(function (data) {
                    vm.role = data;
                });
        } else {
            vm.role = createEmptyRole();
            vm.isNew = true;
        }
    }

    /**
     * Create an empty project object.
     * @returns {{name: string}}
     */
    function createEmptyRole() {
        return {
            name: ''
        };
    }
}