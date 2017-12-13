module meshAdminUi {

    /**
     *
     */
    class ProjectController {

        public mobileEditView: boolean = false;
        private schemas: ISchema[];
        private tags: ITag[];
        private createPermission: boolean;
        private contents = [];
        private projectName: string;
        private wipType: string = 'contents';
        private uploadSchemaAvailable: boolean;

        constructor($scope: ng.IScope,
                    private explorerContentsListService: ExplorerContentsListService,
                    private editorService: EditorService,
                    private deleteNodeDialog: DeleteNodeDialog,
                    private dataService: DataService,
                    private contextService: ContextService,
                    private wipService: WipService,
                    private dispatcher: Dispatcher,
                    private nodeSelector: NodeSelector,
                    private notifyService: NotifyService,
                    private multiFileUpload: MultiFileUpload) {

            this.projectName = contextService.getProject().name;
            this.createPermission = contextService.getCurrentNode().permissions.create;
            this.populateSchemas();
            this.populateTags();

            const nodeOpenedHandler = () => {
                this.mobileEditView = true;
            };
            const nodeClosedHandler = () => {
                if (wipService.getOpenItems(this.wipType).length === 0) {
                    this.mobileEditView = false;
                }
            };
            dispatcher.subscribe(dispatcher.events.editorServiceNodeOpened, nodeOpenedHandler);
            dispatcher.subscribe(dispatcher.events.editorServiceNodeClosed, nodeClosedHandler);
            $scope.$on('$destroy', () => {
                dispatcher.unsubscribeAll(nodeClosedHandler, nodeOpenedHandler);
            })
        }


        /**
         * Fill the vm with all available schemas.
         */
        public populateSchemas() {
            this.dataService.getProjectSchemas(this.projectName)
                .then(result => {
                    this.schemas = result.data;
                    this.uploadSchemaAvailable = this.schemas.some(MeshUtils.hasBinaryField);
                });
        }

        public populateTags() {
            this.dataService.getProjectTags(this.projectName)
                .then(tags => this.tags = tags);
        }

        public createNewNode(schemaUuid: string) {
            this.editorService.create(schemaUuid, this.contextService.getCurrentNode().uuid);
        }

        /**
         * Open the selected content items for editing (i.e. add them to the wipService open items)
         */
        public openSelected() {
            this.explorerContentsListService.getSelection().forEach(uuid => this.editorService.open(uuid));
            this.explorerContentsListService.clearSelection();
        }

        /**
         * Show the node selector dialog and move selected nodes to that folder.
         */
        public moveSelected() {
            let uuids = this.explorerContentsListService.getSelection();
            const parent = this.contextService.getCurrentNode().parentNode;

            this.nodeSelector.open({ 
                containersOnly: true, 
                includeRootNode: true, 
                title: 'SELECT_DESTINATION',
                startingNodeUuid: parent && parent.uuid
            })
                .then((selection: INode[]) => this.dataService.moveNodes(this.projectName, uuids, selection[0].uuid))
                .then(movedUuids => this.notifyService.toast('MOVED_NODES', { count: movedUuids.length }))
                .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged))
                .catch(response => {
                    if (response) {
                        this.notifyService.toast(response.data.message)
                    }
                });
        }

        /**
         * Delete the selected content items
         */
        public deleteSelected() {
            let uuids = this.explorerContentsListService.getSelection();

            this.deleteNodeDialog.showMulti()
                .then(result => {
                    let deleteAllLanguages = !!result.deleteAllLangs;
                    return this.dataService.deleteNodes(this.projectName, uuids, deleteAllLanguages);
                })
                .then(deletedUuids => {
                    deletedUuids.forEach(uuid => {
                        if (this.wipService.isOpen(this.wipType, uuid)) {
                            this.wipService.closeItem(this.wipType, {uuid: uuid});
                        }
                        if (this.explorerContentsListService.isSelected(uuid)) {
                            this.explorerContentsListService.toggleSelect(uuid);
                        }
                    });
                    this.notifyService.toast('DELETED_NODES', { count: deletedUuids.length });
                })
                .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged));
        }

        /**
         * Upload multiple files at once
         */
        public uploadFiles(): void {
            this.multiFileUpload.open(this.contextService.getCurrentNode().uuid)
            .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged));
        }

        public nodesSelected(): boolean {
            return 0 < this.explorerContentsListService.getSelection().length;
        }

        public getOpenWips() {
            return this.wipService.getOpenItems(this.wipType);
        }
    }

    angular.module('meshAdminUi.projects')
        .controller('projectController', ProjectController);


}