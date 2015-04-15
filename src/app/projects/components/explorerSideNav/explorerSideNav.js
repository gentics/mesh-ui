angular.module('caiLunAdminUi.projects')
    .directive('explorerSideNav', explorerSideNavDirective);

/**
 * The left-hand side navigation for displaying the sub-tags of the current tag.
 *
 * @returns {{}} Directive Definition Object
 */
function explorerSideNavDirective() {

    function explorerSideNavController() {
        var vm = this;

        vm.isOpen = false;
        vm.toggleOpen = function() {
            vm.isOpen = !vm.isOpen;
        };
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/explorerSideNav/explorerSideNav.html',
        controller: explorerSideNavController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            tags: '='
        }
    };
}