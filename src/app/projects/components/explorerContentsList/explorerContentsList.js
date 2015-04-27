angular.module('caiLunAdminUi.projects')
    .directive('explorerContentsList', explorerContentsListDirective);

/**
 * The table used to display the contents of a tag.
 *
 * @returns {{}} Directive Definition Object
 */
function explorerContentsListDirective($state) {

    function explorerContentsListController() {
        var vm = this;

        vm.totalItems = 0;
        vm.update = update;
        vm.goToContent = goToContent;

        /**
         * Invoke the callback defined in the `on-update` attribute.
         */
        function update() {
            vm.onUpdate({
                currentPage: vm.currentPage,
                itemsPerPage: vm.itemsPerPage
            });
        }

        /**
         * Transition to the contentEditor view for the given uuid
         * @param uuid
         */
        function goToContent(uuid) {
            $state.go('projects.explorer.content', { uuid: uuid });
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/explorerContentsList/explorerContentsList.html',
        controller: explorerContentsListController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            contents: '=',
            totalItems: '=',
            itemsPerPage: '=',
            currentPage: '=',
            onUpdate: '&'
        }
    };
}