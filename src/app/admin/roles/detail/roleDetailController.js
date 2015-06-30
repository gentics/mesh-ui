angular.module('meshAdminUi.admin')
    .controller('ProjectDetailController', ProjectDetailController);

/**
 *
 * @param {ng.ui.IStateService} $state
 * @param {ng.ui.IStateParamsService} $stateParams
 * @param {ConfirmActionDialog} confirmActionDialog
 * @param {DataService} dataService
 * @param {NotifyService} notifyService
 * @constructor
 */
function ProjectDetailController($state, $stateParams, confirmActionDialog, dataService, notifyService) {
    var vm = this;

    vm.isNew = false;
    vm.modified = false;
    vm.persist = persist;
    vm.remove = remove;
    vm.canDelete = canDelete;

    getRoleData();

    /**
     * Persist the project data back to the server.
     */
    function persist() {
        dataService.persistProject(vm.project)
            .then(function(response) {
                if (vm.isNew) {
                    notifyService.toast('NEW_PROJECT_CREATED');
                    vm.isNew = false;
                    $state.go('admin.projects.detail', { uuid: response.uuid });
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
                $state.go('admin.projects.list');
            });
    }

    /**
     * @returns {ng.IPromise}
     */
    function showDeleteDialog() {
        return confirmActionDialog.show({
            title: 'Delete Project?',
            message: 'Are you sure you want to delete this project?'
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
                    vm.project = data;
                });
        } else {
            vm.project = createEmptyRole();
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