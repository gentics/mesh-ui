angular.module('caiLunAdminUi.common')
    .directive('breadcrumbs', breadcrumbsDirective);

/**
 * Directive to generate breadcrumbs for navigating a project.
 *
 * @param dataService
 * @param contextService
 * @returns {{}} Directive Definition Object
 */
function breadcrumbsDirective(dataService, contextService) {

    function breadcrumbsController($scope) {
        var vm = this,
            projectName = contextService.getProject().name;

        vm.projectName = projectName;

        dataService.getProjectRootTagId(projectName)
            .then(function(id) {
                vm.breadcrumbs = [
                    {
                        name: projectName,
                        id: id
                    }, {}
                ];
            });

        $scope.$watch(function() {
            return contextService.getTag();
        }, function(newVal) {
            vm.breadcrumbs[1] = {
                name: newVal.name,
                id: newVal.id
            };
        }, true)

    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
        controller: breadcrumbsController,
        controllerAs: 'vm',
        scope: {}
    };
}
