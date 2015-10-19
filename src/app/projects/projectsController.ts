module meshAdminUi {

    /**
     *
     */
    class ProjectController {

        private schemas: ISchema;
        private createPermission: boolean;
        private contents = [];
        private projectName: string;

        constructor(private $q: ng.IQService,
                    private explorerContentsListService: ExplorerContentsListService,
                    private editorService: EditorService,
                    private confirmActionDialog: ConfirmActionDialog,
                    private dataService: DataService,
                    private contextService: ContextService,
                    private wipService: WipService,
                    private i18nService: I18nService,
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
            var selectedLangs = {};
            selectedLangs[this.i18nService.getCurrentLang().code] = true;
            this.explorerContentsListService.getSelection().forEach(uuid => this.editorService.open(uuid));
            this.explorerContentsListService.clearSelection();
        }

        /**
         * Delete the selected content items
         */
        public deleteSelected() {
            let deletedCount = this.explorerContentsListService.getSelection().length,
                doDelete = () => {
                    this.$q.when(this.deleteNext())
                        .then(() => {
                            this.notifyService.toast('Deleted ' + deletedCount + ' contents');
                        });
                };

            this.showDeleteDialog().then(doDelete);
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

        /**
         * Recursively deletes the selected content items as specified by the indices in the
         * this.selectedItems array. Done recursively in order to allow each DELETE request to
         * complete before sending the next. When done in parallel, deleting more than a few
         * items at once causes server error.
         */
        private deleteNext(): ng.IPromise<any> {
            let selection = this.explorerContentsListService.getSelection();
            if (selection.length === 0) {
                return;
            } else {
                var uuid = selection.pop();

                return this.dataService.getNode(this.projectName, uuid)
                    .then(item => this.dataService.deleteNode(this.projectName, item))
                    .then(() => {
                        if (this.wipService.getItem('contents', uuid)) {
                            this.wipService.closeItem('contents', {uuid: uuid});
                        }
                        return this.deleteNext();
                    });
            }
        }

        public nodesSelected(): boolean {
            return 0 < this.explorerContentsListService.getSelection().length;
        }
    }

    angular.module('meshAdminUi.projects')
        .controller('projectController', ProjectController);


}