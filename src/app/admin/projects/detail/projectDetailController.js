angular.module('meshAdminUi.admin')
    .controller('ProjectDetailController', ProjectDetailController);

/**
 *
 * @param {ng.ui.IStateService} $state
 * @param {ng.ui.IStateParamsService} $stateParams
 * @param dataService
 * @param notifyService
 * @constructor
 */
function ProjectDetailController($state, $stateParams, dataService, notifyService) {
    var vm = this;

    vm.isNew = false;
    vm.modified = false;
    vm.persist = persist;

    getProjectData();


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
     * Get the project data from the server, or in the case of a new project,
     * create an empty project object.
     *
     * @returns {ng.IPromise<Object>}
     */
    function getProjectData() {
        var projectId = $stateParams.uuid;
        if (projectId) {
            return dataService.getProject($stateParams.uuid)
                .then(function (data) {
                    vm.project = data;
                });
        } else {
            vm.project = createEmptyProject();
            vm.isNew = true;
        }
    }

    /**
     * Create an empty project object.
     * @returns {{name: string}}
     */
    function createEmptyProject() {
        return {
            name: ''
        };
    }
}