angular.module('caiLunAdminUi.projects')
    .directive('explorerSideNav', explorerSideNavDirective);

/**
 * The left-hand side navigation for displaying the sub-tags of the current tag.
 *
 * @returns {{}} Directive Definition Object
 */
function explorerSideNavDirective($state, contextService) {

    function explorerSideNavController() {
        var vm = this;

        vm.isOpen = false;
        vm.goTo = goTo;
        vm.toggleOpen = toggleOpen;

        /**
         * Toggle whether the sidebar is open.
         */
        function toggleOpen() {
            vm.isOpen = !vm.isOpen;
        }

        /**
         * Transition to the tag specified by tagId in the current project.
         * @param {string} tagId
         */
        function goTo(tagId) {
            var projectName = contextService.getProject().name;
            $state.go('projects.explorer', { projectName: projectName, tagId: tagId });
        }
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