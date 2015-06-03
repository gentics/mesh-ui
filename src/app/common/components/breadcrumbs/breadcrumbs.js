angular.module('meshAdminUi.common')
    .directive('breadcrumbs', breadcrumbsDirective);

/**
 * Directive to generate breadcrumbs for navigating a project.
 *
 * @param dataService
 * @param contextService
 * @returns {ng.IDirective} Directive definition object
 */
function breadcrumbsDirective(dataService, contextService) {

    function breadcrumbsController() {
        var vm = this;
        vm.breadcrumbs = [];

        vm.clearProject = function() {
            vm.projectName = '';
            vm.breadcrumbs = [];
        };

        populateBreadcrumbs();
        contextService.registerContextChangeHandler(contextChangeHandler);

        /**
         * Populate the breadcrumbs on the initial page load. This would only be called once, when
         * the app bootstraps, and is responsible for setting the breadcrumbs on first load.
         */
        function populateBreadcrumbs() {
            contextChangeHandler(contextService.getProject(), contextService.getParentNode());
        }

        /**
         * Update the breadcrumbs array whenever the context changes (i.e. user moves to a new
         * node or project).
         *
         * @param currentProject
         * @param currentNode
         */
        function contextChangeHandler(currentProject, currentNode) {
            vm.projectName = currentProject.name;

            if (vm.projectName === '') {
                vm.breadcrumbs = [];
            } else {
                dataService.getBreadcrumb(vm.projectName, currentNode.id)
                    .then(function (data) {
                        vm.breadcrumbs = data;
                    });
            }
        }

    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
        controller: breadcrumbsController,
        controllerAs: 'vm',
        scope: {}
    };
}
