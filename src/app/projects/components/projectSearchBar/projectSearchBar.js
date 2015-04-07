angular.module('caiLunAdminUi.projects')
    .directive('projectSearchBar', projectSearchBarDirective);

/**
 * The search/nav bar component which allows and contextual search of projects.
 *
 * @param $state
 * @param dataService
 * @param contextService
 * @returns {{}} Directive Definition Object
 */
function projectSearchBarDirective($state, dataService, contextService) {

    var callbackRegistered = false;

    function projectSearchBarController() {
        var vm = this;
        vm.currentProject = contextService.getProject().name;
        vm.goToContext = goToContext;

        dataService.getProjects().then(function(data) {
            vm.projects = data;
        });

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
         * @param {string} currentTag
         */
        function updateCurrentContext(currentProject, currentTag) {
            vm.currentProject = currentProject.name;
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