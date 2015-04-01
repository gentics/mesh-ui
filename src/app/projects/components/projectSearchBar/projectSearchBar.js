angular.module('caiLunAdminUi.projects')
    .directive('projectSearchBar', projectSearchBarDirective);

function projectSearchBarDirective(dataService, contextService) {

    var callbackRegistered = false;

    function projectSearchBarController() {
        var vm = this;

        dataService.getProjects().then(function(data) {
            vm.projects = data;
        });

        if (!callbackRegistered) {
            contextService.registerContextChangeHandler(updateCurrentContext);
            callbackRegistered = true;
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