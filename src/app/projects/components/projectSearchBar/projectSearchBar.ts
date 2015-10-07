angular.module('meshAdminUi.projects')
    .directive('projectSearchBar', projectSearchBarDirective);

/**
 * The search/nav bar component which allows and contextual search of projects.
 *
 * @param $state
 * @param contextService
 * @returns {ng.IDirective} Directive definition object
 */
function projectSearchBarDirective($state, contextService) {

    var callbackRegistered = false;

    function projectSearchBarController() {
        var vm = this;
        vm.currentProject = contextService.getProject().name;
        vm.currentNode = contextService.getCurrentNode().name;
        vm.goToContext = goToContext;

        if (!callbackRegistered) {
            contextService.registerContextChangeHandler(updateCurrentContext);
            callbackRegistered = true;
        }

        /**
         * Jump to a new context
         * @param {string} projectName
         */
        function goToContext(projectName) {
            if (projectName !== '') {
                $state.go('projects.explorer', {projectName: projectName});
            }
            else {
                $state.go('projects.list');
            }
        }

        /**
         * Update the view model with the current context
         * @param {string} currentProject
         * @param {string} currentNode
         */
        function updateCurrentContext(currentProject, currentNode) {
            vm.currentProject = currentProject.name;
            vm.currentNode = currentNode.name;
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'projects/components/projectSearchBar/projectSearchBar.html',
        controller: projectSearchBarController,
        controllerAs: 'vm',
        scope: {}
    };
}