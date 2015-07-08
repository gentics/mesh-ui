angular.module('meshAdminUi.projects')
    .directive('explorerContentsList', explorerContentsListDirective);

/**
 * The table used to display the contents of a tag.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function explorerContentsListDirective($state, contextService, editorService) {

    function explorerContentsListController() {
        var vm = this;

        vm.totalItems = 0;
        vm.update = update;
        vm.openNode = openNode;

        vm.selectedItems = [];
        vm.toggleSelect = toggleSelect;
        vm.isSelected = isSelected;
        vm.selectAll = toggleSelectAll;
        vm.areAllSelected = false;
        vm.getBinaryRepresentation = getBinaryRepresentation;

        /**
         * Invoke the callback defined in the `on-update` attribute.
         */
        function update() {
            vm.onUpdate({
                currentPage: vm.currentPage,
                itemsPerPage: vm.itemsPerPage
            });
            vm.selectedItems = [];
        }

        /**
         * Toggle whether the items at index is selected.
         * @param index
         */
        function toggleSelect(index) {
            if (isSelected(index)) {
                var idx = vm.selectedItems.indexOf(index);
                vm.selectedItems.splice(idx, 1);
            } else {
                vm.selectedItems.push(index);
            }
            vm.areAllSelected = areAllSelected();
        }

        /**
         * Toggle between all items being selected or none.
         */
        function toggleSelectAll() {
            if (vm.selectedItems.length === vm.itemsPerPage) {
                vm.selectedItems = [];
                vm.areAllSelected = false;
            } else {
                vm.selectedItems = [];
                for (var i = 0; i < vm.itemsPerPage; i++) {
                    vm.selectedItems.push(i);
                }
                vm.areAllSelected = true;
            }
        }

        /**
         * Is the item at index currently selected?
         * @param $index
         * @returns {boolean}
         */
        function isSelected($index) {
            return -1 < vm.selectedItems.indexOf($index);
        }

        /**
         * Are all items selected?
         * @returns {boolean}
         */
        function areAllSelected() {
            return vm.selectedItems.length === vm.itemsPerPage;
        }

        /**
         * Transition to the contentEditor view for the given uuid
         * @param {Object} node
         */
        function openNode(node) {
            vm.selectedItems = [];
            if (node.hasOwnProperty('children')) {
                $state.go('projects.explorer', {projectName: contextService.getProject().name, nodeId: node.uuid });
            } else {
                editorService.open(node.uuid);
            }
        }

        function getBinaryRepresentation(item) {
            return item.path;
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
            selectedItems: '=',
            onUpdate: '&'
        }
    };
}