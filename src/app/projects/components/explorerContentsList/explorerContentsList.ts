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

        public totalItems: number = 0;
        public selectedItems: string[] = [];
        private _areAllSelected: boolean = false;
        public currentPage: number;
        public itemsPerPage: number;
        public onUpdate: Function;

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
        public toggleSelect(uuid: string) {
            if (this.isSelected(uuid)) {
                var idx = this.selectedItems.indexOf(uuid);
                this.selectedItems.splice(idx, 1);
            } else {
                this.selectedItems.push(uuid);
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
         */
        public isSelected(uuid: string): boolean {
            return -1 < this.selectedItems.indexOf(uuid);
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
         */
        public openNode(node, event: ng.IAngularEvent) {
            event.preventDefault();
            event.stopPropagation();
            this.selectedItems = [];
            if (node.hasOwnProperty('children')) {
                this.$state.go('projects.explorer', {projectName: this.contextService.getProject().name, nodeId: node.uuid});
            }
        }

        /**
         * Open the node up in the editor pane
         */
        public editNode(node: INode, event: ng.IAngularEvent) {
            event.preventDefault();
            event.stopPropagation();
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