angular.module('caiLunAdminUi.common')
    .directive('breadcrumbs', breadcrumbsDirective);

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
