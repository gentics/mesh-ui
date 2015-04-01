angular.module('caiLunAdminUi.projects')
    .directive('projectSearchBar', projectSearchBarDirective);

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

        function goToContext(projectName) {
            if (projectName !== '') {
                $state.go('projects.explorer', {projectName: projectName});
            }
            else {
                $state.go('projects.list');
            }
        }

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