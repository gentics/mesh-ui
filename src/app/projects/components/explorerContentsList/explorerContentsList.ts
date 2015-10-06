module meshAdminUi {

    /**
     * The table used to display the contents of a tag.
     *
     * @returns {ng.IDirective} Directive definition object
     */
    function explorerContentsListDirective() {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'projects/components/explorerContentsList/explorerContentsList.html',
            controller: 'explorerContentsListController',
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

    class ExplorerContentsListController {

        private totalItems: number = 0;
        private selectedItems: any[] = [];
        private _areAllSelected: boolean = false;
        private currentPage: number;
        private itemsPerPage: number;
        private onUpdate: Function;

        constructor(private $state: ng.ui.IStateService,
                    private contextService: ContextService,
                    private editorService: EditorService) {

        }


        /**
         * Invoke the callback defined in the `on-update` attribute.
         */
        public update() {
            this.onUpdate({
                currentPage: this.currentPage,
                itemsPerPage: this.itemsPerPage
            });
            this.selectedItems = [];
        }

        /**
         * Toggle whether the items at index is selected.
         */
        public toggleSelect(index) {
            if (this.isSelected(index)) {
                var idx = this.selectedItems.indexOf(index);
                this.selectedItems.splice(idx, 1);
            } else {
                this.selectedItems.push(index);
            }
            this._areAllSelected = this.areAllSelected();
        }

        /**
         * Toggle between all items being selected or none.
         */
        public toggleSelectAll() {
            if (this.selectedItems.length === this.itemsPerPage) {
                this.selectedItems = [];
                this._areAllSelected = false;
            } else {
                this.selectedItems = [];
                for (var i = 0; i < this.itemsPerPage; i++) {
                    this.selectedItems.push(i);
                }
                this._areAllSelected = true;
            }
        }

        /**
         * Is the item at index currently selected?
         * @param $index
         * @returns {boolean}
         */
        public isSelected($index) {
            return -1 < this.selectedItems.indexOf($index);
        }

        /**
         * Are all items selected?
         * @returns {boolean}
         */
        private areAllSelected() {
            return this.selectedItems.length === this.itemsPerPage;
        }

        /**
         * Transition to the contentEditor view for the given uuid
         * @param {Object} node
         */
        public openNode(node) {
            this.selectedItems = [];
            if (node.hasOwnProperty('children')) {
                this.$state.go('projects.explorer', {projectName: this.contextService.getProject().name, nodeId: node.uuid});
            }
        }

        public editNode(node) {
            this.selectedItems = [];
            this.editorService.open(node.uuid);
        }

        public getBinaryRepresentation(item) {
            return item.path;
        }
    }


    angular.module('meshAdminUi.projects')
        .directive('explorerContentsList', explorerContentsListDirective)
        .controller('explorerContentsListController', ExplorerContentsListController);

}