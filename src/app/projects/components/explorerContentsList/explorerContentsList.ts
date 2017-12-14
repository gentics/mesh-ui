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
        private wipType: string = 'contents';

        constructor($scope: ng.IScope,
                    private $state: ng.ui.IStateService,
                    private $q: ng.IQService,
                    private dispatcher: Dispatcher,
                    private mu: MeshUtils,
                    private searchService: SearchService,
                    private explorerContentsListService: ExplorerContentsListService,
                    private contextService: ContextService,
                    private editorService: EditorService,
                    private i18nService: I18nService,
                    private i18n: I18nFilter,
                    private $timeout: ng.ITimeoutService,
                    private nodeSelector: NodeSelector,
                    private dataService: DataService,
                    private notifyService: NotifyService,
                    private deleteNodeDialog: DeleteNodeDialog,
                    private unpublishNodeDialog: UnpublishNodeDialog,
                    private wipService: WipService,
                    private confirmActionDialog: ConfirmActionDialog,
                    private selectiveCache: SelectiveCache,
                    private $mdDialog: ng.material.IDialogService) {

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
        public toggleSelect(node: INode, event: MouseEvent) {
            if ((<HTMLElement> event.target).classList.contains('node-item-menu-icon')) {
                return false;
            }
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
            return !!node.availableLanguages[this.i18nService.getCurrentLang().code];
        }

        /**
         * Transition to the contentEditor view for the given uuid
         */
        public openNode(node: INode, event?: ng.IAngularEvent, asFolder: boolean = false) {
            event.preventDefault();
            event.stopPropagation();

            if (node.container || asFolder) {
                this.$state.go('projects.node', {
                    projectName: this.contextService.getProject().name, nodeId: node.uuid
                });
            } else if (this.isAvailableInCurrentLang(node)) {
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
            this.selectiveCache.remove('nodes');

            // Reload explorer list if node was loaded during this button click
            const loaded = (event, changedNode: INode) => {
                if (changedNode.uuid === node.uuid) {
                    this.dispatcher.unsubscribeAll(loaded);
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                }
            }
            this.dispatcher.subscribe(this.dispatcher.events.nodeLoaded, loaded);

            const projectName = this.contextService.getProject().name;
            let wip = this.wipService.getItem(this.wipType, node.uuid);
            let action : ng.IPromise<any>;
            if (wip && this.wipService.isModified(this.wipType, wip)) {
                action = this.openChangedDialog(wip).then(response => {
                    if (response === 'save') {
                        this.notifyService.toast('SAVED_CHANGES');
                        return this.dataService.persistNode(projectName, wip)
                            .then(() => this.dataService.updateNodeTags(projectName, wip, wip.tags))
                            .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged));
                    } else if (response === 'discard') {
                        return this.wipService.closeItem(this.wipType, wip);
                    }
                });
            } else {
                action = this.$q.when();
            }
            action.then(() => this.editorService.open(node.uuid));
        }

        private openChangedDialog(node: INode): ng.IPromise<'save' | 'discard'> {
            return this.$mdDialog.show({
                templateUrl: 'common/components/wipTabs/wipTabsCloseDialog.html',
                controller: 'wipTabsDialogController',
                controllerAs: 'vm',
                locals: { node }
            });
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

        public isPublished(node: INode): boolean {
            return node && node.availableLanguages && node.language && node.version &&
                node.availableLanguages[node.language].version === node.version &&
                node.availableLanguages[node.language].published;
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

        /**
         * Create a copy of the selected node to some location selected from the dialog.
         */
        public copyNode(node: INode, schema: ISchema, event: MouseEvent) {
            event.preventDefault();
            let nodeClone = this.mu.safeCloneNode(node, schema, 'copy');
            let projectName = this.contextService.getProject().name;
            let destinationNode: INode;
            delete nodeClone.created;
            delete nodeClone.uuid;

            this.nodeSelector.open({
                containersOnly: true,
                includeRootNode: true,
                title: 'SELECT_DESTINATION',
                startingNodeUuid: node.parentNode.uuid
            })
                .then((selection:INode[]) => {
                    destinationNode = selection[0];
                    nodeClone.parentNode.uuid = destinationNode.uuid;
                    return this.dataService.persistNode(projectName, nodeClone);
                })
                .then(() => {
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                    this.$state.go('projects.node', {
                        projectName: projectName, nodeId: destinationNode.uuid
                    });
                    this.notifyService.toast('COPIED_NODE');
                })
                .catch(response => {
                    if (response) {
                        this.notifyService.toast(response.data.message)
                    }
                });
        }

        /**
         * Show the node selector dialog and move selected nodes to that folder.
         */
        public moveNode(node: INode, event: MouseEvent) {
            event.preventDefault();
            let projectName = this.contextService.getProject().name;
            let destinationNode: INode;

            this.nodeSelector.open({
                containersOnly: true,
                includeRootNode: true,
                title: 'SELECT_DESTINATION',
                startingNodeUuid: node.parentNode.uuid
            })
                .then((selection: INode[]) => {
                    destinationNode = selection[0];
                    return this.dataService.moveNode(projectName, node.uuid, destinationNode.uuid);
                })
                .then(() => {
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                    this.$state.go('projects.node', {
                        projectName: projectName, nodeId: destinationNode.uuid
                    });
                    this.notifyService.toast('MOVED_NODES', { count: 1 });
                })
                .catch(response => {
                    if (response) {
                        this.notifyService.toast(response.data.message)
                    }
                });
        }

        /**
         * Show the delete node dialog and delete the node.
         */
        deleteNode(node: INode, event: MouseEvent) {
            event.preventDefault();
            let projectName = this.contextService.getProject().name;

            this.deleteNodeDialog.show(node)
                .then((langs: string[]) => {
                    if (this.checkDeleteAll(langs, node)) {
                        return this.dataService.deleteNode(projectName, node);
                    } else {
                        let promises = langs.map(code => {
                            return this.dataService.deleteNodeLanguage(projectName, node, code);
                        });
                        return this.$q.all(promises);
                    }
                })
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.editorService.closeAll();
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                    if (this.wipService.isOpen(this.wipType, node.uuid)) {
                        this.wipService.closeItem(this.wipType, node);
                    }
                    this.editorService.close();
                });
        }

        /**
         * Show the unpublish node dialog and unpublish the node.
         */
        unpublishNode(node: INode, event: MouseEvent) {
            event.preventDefault();
            let projectName = this.contextService.getProject().name;

            this.unpublishNodeDialog.show(node)
                .then((langs: string[]) => {
                    if (this.checkDeleteAll(langs, node)) {
                        return this.dataService.unpublishNode(projectName, node);
                    } else {
                        let promises = langs.map(code => {
                            return this.dataService.unpublishNodeLanguage(projectName, node, code);
                        });
                        return this.$q.all(promises);
                    }
                })
                .then(() => this.dataService.getNode(projectName, node.uuid))                
                .then((unpublishedNode: INode) => {
                    this.notifyService.toast('UNPUBLISHED');
                    node.availableLanguages = unpublishedNode.availableLanguages;
                    this.dispatcher.publish(this.dispatcher.events.nodeUnpublished, unpublishedNode);
                });
        }

        /**
         * Did the user select to delete all available languages?
         */
        private checkDeleteAll(langs: string[], node: INode) {
            if (!node.availableLanguages || Object.keys(node.availableLanguages).length < 2) {
                return true;
            }

            return Object.keys(node.availableLanguages).length === langs.length;
        }
    }


    angular.module('meshAdminUi.projects')
        .directive('explorerContentsList', explorerContentsListDirective)
        .controller('explorerContentsListController', ExplorerContentsListController);

}