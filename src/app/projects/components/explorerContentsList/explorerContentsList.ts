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
            }
        };
    }

    class ExplorerContentsListController {

        constructor(private $state: ng.ui.IStateService,
                    private explorerContentsListService: ExplorerContentsListService,
                    private contextService: ContextService,
                    private editorService: EditorService) {
        }


        /**
         * Toggle whether the items at index is selected.
         */
        public toggleSelect(uuid: string) {
            this.explorerContentsListService.toggleSelect(uuid);
        }

        /**
         * Is the item at index currently selected?
         */
        public isSelected(uuid: string): boolean {
            return this.explorerContentsListService.isSelected(uuid);
        }

        /**
         * Transition to the contentEditor view for the given uuid
         */
        public openNode(node, event: ng.IAngularEvent) {
            event.preventDefault();
            event.stopPropagation();
            if (node.hasOwnProperty('children')) {
                this.$state.go('projects.node', {projectName: this.contextService.getProject().name, nodeId: node.uuid});
            }
        }

        /**
         * Open the node up in the editor pane
         */
        public editNode(node: INode, event: ng.IAngularEvent) {
            event.preventDefault();
            event.stopPropagation();
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