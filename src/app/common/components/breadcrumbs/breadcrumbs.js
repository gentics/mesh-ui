angular.module('caiLunAdminUi.common')
    .directive('breadcrumbs', breadcrumbsDirective);

/**
 * Directive to generate breadcrumbs for navigating a project.
 *
 * @param contextService
 * @returns {{}} Directive Definition Object
 */
function breadcrumbsDirective(contextService) {

    function breadcrumbsController() {
        var vm = this;

        vm.breadcrumbs = [
            contextService.getProject().name
        ];
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
        controller: breadcrumbsController,
        controllerAs: 'vm',
        scope: {}
    };
}
