angular.module('meshAdminUi.projects')
    .directive('explorerFoldersList', explorerFoldersListDirective);

/**
 * The left-hand side navigation for displaying the sub-tags of the current tag.
 *
 * @param {ng.ui.IStateService} $state
 * @param contextService
 * @returns {ng.IDirective} Directive definition object
 */
function explorerFoldersListDirective($state, contextService) {

    function explorerFoldersListController() {
        var vm = this;
        vm.goTo = goTo;
        vm.editTag = editTag;

        /**
         * Transition to the tag specified by tagId in the current project.
         * @param {string} tagId
         */
        function goTo(tagId) {
            var projectName = contextService.getProject().name;
            $state.go('projects.explorer', { projectName: projectName, tagId: tagId });
        }

        /**
         * Transition to the tag editor state for the specified tagId.
         *
         * @param {Event} event
         * @param {string} tagId
         */
        function editTag(event, tagId) {
            event.preventDefault();
            $state.go('projects.explorer.tag', { uuid: tagId });
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/explorerFoldersList/explorerFoldersList.html',
        controller: explorerFoldersListController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            folders: '='
        }
    };
}