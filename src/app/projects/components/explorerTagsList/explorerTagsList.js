angular.module('meshAdminUi.projects')
    .directive('explorerTagsList', explorerTagsListDirective);

/**
 * The left-hand side navigation for displaying the sub-tags of the current tag.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function explorerTagsListDirective($state, contextService) {

    function explorerTagsListController() {
        var vm = this;
        vm.goTo = goTo;

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
        templateUrl: 'projects/components/explorerTagsList/explorerTagsList.html',
        controller: explorerTagsListController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            tags: '='
        }
    };
}