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
                tagsArray: '=',
                itemsPerPage: '=',
                onPageChange: '&'
            }
        };
    }

    class ExplorerContentsListController {

        public searchQuery: string = '';
        private onPageChange: Function;
        public tagsArray: { [nodeUuid: string]: ITag[] } = {};
        private contents: INodeBundleResponse[];

        constructor($scope: ng.IScope,
                    private $state: ng.ui.IStateService,
                    private dispatcher: Dispatcher,
                    private mu: MeshUtils,
                    private searchService: SearchService,
                    private explorerContentsListService: ExplorerContentsListService,
                    private contextService: ContextService,
                    private editorService: EditorService,
                    private i18nService: I18nService,
                    private i18n: I18nFilter,
                    private $timeout: ng.ITimeoutService,
                    private confirmActionDialog: ConfirmActionDialog) {

            explorerContentsListService.clearSelection();
            const searchTermHandler = (event, params: INodeSearchParams) => {
                this.searchQuery = params.searchTerm;
            };
            dispatcher.subscribe(dispatcher.events.explorerSearchParamsChanged, searchTermHandler);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(searchTermHandler));

            if (editorService.getOpenNodeId()) {
                editorService.open(editorService.getOpenNodeId());
            }
        }

        public filterNodes = (node: INode) => {
            return this.mu.nodeFilterFn(node, this.searchQuery);
        };

        /**
         * Toggle whether the items at index is selected.
         */
        public toggleSelect(node: INode) {
            if (this.isAvailableInCurrentLang(node)) {
                this.explorerContentsListService.toggleSelect(node.uuid);
            }
        }

        /**
         * Is the item at index currently selected?
         */
        public isSelected(uuid: string): boolean {
            return this.explorerContentsListService.isSelected(uuid);
        }

        /**
         * Returns true if the node is available in the current language.
         */
        public isAvailableInCurrentLang(node: INode): boolean {
            return 0 < node.availableLanguages.filter(lang => this.i18nService.getCurrentLang().code === lang).length;
        }

        /**
         * Transition to the contentEditor view for the given uuid
         */
        public openNode(node: INode, event: ng.IAngularEvent) {
            event.preventDefault();
            event.stopPropagation();
            if (node.container || node.hasOwnProperty('displayName')) {
                this.$state.go('projects.node', {
                    projectName: this.contextService.getProject().name, nodeId: node.uuid
                });
            } else {
                this.editNode(node, event);
            }
        }
        
        public openNodeInLanguage(code: string, node: INode) {
            let languageName = this.i18nService.getLanguageInfo(code).name;
            this.confirmActionDialog.show({
                title: this.i18n('SWITCH_LANGUAGE_AND_OPEN_TITLE', { lang: `${languageName} (${code})`}),
                message: this.i18n('SWITCH_LANGUAGE_AND_OPEN_MESSAGE', { lang: languageName }),
                confirmLabel: 'OKAY',
                cancelLabel: 'CANCEL',
                confirmButtonClass: 'btn-primary'
            }).then(() => {
                this.i18nService.setCurrentLang(code);
                this.$state.reload();
                this.$timeout(() => {
                    this.editorService.open(node.uuid);
                }, 500);
            })
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

        public isGlobal(): boolean {
            return this.searchService.getParams().searchAll;
        }

        public pageChanged(newPageNumber: number, schemaUuid: string) {
            this.onPageChange({ newPageNumber: newPageNumber, schemaUuid: schemaUuid });
        }

        /**
         * Returns true if the node has at least one binary field.
         */
        public hasBinaryField(node: INode): boolean {
            let firstBinaryField = this.mu.getFirstBinaryField(node);
            return !!(firstBinaryField && firstBinaryField.value);
        }

        /**
         * Returns true is the node has a binary field and that field is an image type.
         */
        public isImageNode(node: INode): boolean {
            let binaryField = this.mu.getFirstBinaryField(node);
            if (binaryField.value) {
                return this.mu.isImageField(binaryField.value);
            }
            return false;
        }
    }


    angular.module('meshAdminUi.projects')
        .directive('explorerContentsList', explorerContentsListDirective)
        .controller('explorerContentsListController', ExplorerContentsListController);

}