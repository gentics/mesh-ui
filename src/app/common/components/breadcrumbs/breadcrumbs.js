angular.module('meshAdminUi.common')
    .directive('breadcrumbs', breadcrumbsDirective);

/**
 * Directive to generate breadcrumbs for navigating a project.
 * TODO: This is just a demo implementation. Awaiting API endpoint for breadcrumbs.
 *
 * @param dataService
 * @param contextService
 * @returns {ng.IDirective} Directive definition object
 */
function breadcrumbsDirective(dataService, contextService) {

    function breadcrumbsController($scope) {
        var vm = this;

        vm.clearProject = function() {
            vm.projectName = '';
            vm.breadcrumbs = [];
        };

        $scope.$watch(function() {
            return contextService.getProject();
        }, function(project) {
            vm.projectName = project.name;
            getProjectRootTag(project.name);
        }, true);

        function getProjectRootTag(projectName) {
            dataService.getProjectRootTagId(projectName)
                .then(function (id) {
                    vm.breadcrumbs = [
                        {
                            name: projectName,
                            id: id
                        }, {}
                    ];
                });
        }

        $scope.$watch(function() {
            return contextService.getTag();
        }, function(newVal) {
            if (vm.breadcrumbs) {
                vm.breadcrumbs[1] = {
                    name: newVal.name,
                    id: newVal.id
                };
            }
        }, true);

    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
        controller: breadcrumbsController,
        controllerAs: 'vm',
        scope: {}
    };
}
