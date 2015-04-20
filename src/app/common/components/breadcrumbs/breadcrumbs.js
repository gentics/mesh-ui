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

    function breadcrumbsController() {
        var vm = this,
            projectName = contextService.getProject().name;

        dataService.getProjectRootTagId(projectName)
            .then(function(id) {
                vm.breadcrumbs = [
                    {
                        name: projectName,
                        id: id
                    }
                ];
            });


    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
        controller: breadcrumbsController,
        controllerAs: 'vm',
        scope: {}
    };
}
