module meshAdminUi {

    /**
     *
     */
    class ProjectController {

        private schemas: ISchema;
        private createPermission: boolean;
        private contents = [];
        private projectName: string;
        private wipType: string = 'contents';

        constructor(private explorerContentsListService: ExplorerContentsListService,
                    private editorService: EditorService,
                    private confirmActionDialog: ConfirmActionDialog,
                    private dataService: DataService,
                    private contextService: ContextService,
                    private wipService: WipService,
                    private dispatcher: Dispatcher,
                    private nodeSelector: NodeSelector,
                    private notifyService: NotifyService) {

            this.projectName = contextService.getProject().name;
            this.createPermission = -1 < contextService.getCurrentNode().permissions.indexOf('create');
            this.populateSchemas();
        }


        /**
         * Fill the vm with all available schemas.
         */
        public populateSchemas() {
            this.dataService.getSchemas()
                .then(result => this.schemas = result.data);
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

            this.nodeSelector.open({ containersOnly: true })
                .then((selection: INode[]) => this.dataService.moveNodes(this.projectName, uuids, selection[0].uuid))
                .then(movedUuids => this.notifyService.toast('Moved ' + movedUuids.length + ' nodes'))
                .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged));
        }

        /**
         * Delete the selected content items
         */
        public deleteSelected() {
            let uuids = this.explorerContentsListService.getSelection();

            this.showDeleteDialog()
                .then(() => this.dataService.deleteNodes(this.projectName, uuids))
                .then(deletedUuids => {
                    deletedUuids.forEach(uuid => {
                        if (this.wipService.isOpen(this.wipType, uuid)) {
                            this.wipService.closeItem(this.wipType, {uuid: uuid});
                        }
                    });
                    this.notifyService.toast('Deleted ' + deletedUuids.length + ' nodes')
                })
                .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged));
        }

        /**
         * Display a confirmation dialog for the group delete action
         */
        private showDeleteDialog(): ng.IPromise<any> {
            return this.confirmActionDialog.show({
                title: 'Delete Content?',
                message: 'Are you sure you want to delete the selected contents?'
            });
        }

        public nodesSelected(): boolean {
            return 0 < this.explorerContentsListService.getSelection().length;
        }
    }

    angular.module('meshAdminUi.projects')
        .controller('projectController', ProjectController);


}