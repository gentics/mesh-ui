module meshAdminUi {
    
    /**
     *
     */
    class ProjectExplorerController {

        private schemas: ISchema;
        private totalItems: number = 0;
        private itemsPerPage: number;
        private currentPage: number;
        private createPermission: boolean;
        private selectedItems = [];
        private contents = [];
        private projectName: string;

        constructor( private $scope: ng.IScope,
                     private $q: ng.IQService,
                     private $location: ng.ILocationService,
                     private editorService: EditorService,
                     private confirmActionDialog: ConfirmActionDialog,
                     private dataService: DataService,
                     private contextService: ContextService,
                     private wipService: WipService,
                     private i18nService: I18nService,
                     private notifyService: NotifyService,
                     private parentNode: INode) {

        this.itemsPerPage = $location.search().per_page || 10;
                this.currentPage = $location.search().page || 1;
            this.projectName = contextService.getProject().name;
            this.createPermission = -1 < parentNode.permissions.indexOf('create');

            $scope.$watch(() => $location.search().page, newVal => {
                this.updateContents(newVal, this.itemsPerPage);
                this.populateChildNodes(newVal);
            });

            this.populateSchemas();
        }



        /**
         * Update the URL query params and vm values for
         * current page and items per page. New content will be
         * requested from the server via the watcher.
         */
        public updateContents(currentPage: number, itemsPerPage: number) {
            this.currentPage = currentPage;
            this.itemsPerPage = itemsPerPage;
            this.$location.search('page', currentPage);
            this.$location.search('per_page', itemsPerPage);
        }

        /**
         * Fill the vm with the child contents of the current tag.
         */
        public populateChildNodes(page: number) {
            var projectName = this.contextService.getProject().name,
                parentNodeId = this.parentNode.uuid,
                queryParams = {
                    page: page,
                    per_page: this.itemsPerPage
                };

            this.dataService.getChildNodes(projectName, parentNodeId, queryParams)
                .then(response => {
                    var schemaGroups = {};
                    response.data.forEach(node => {
                        if (!schemaGroups[node.schema.name]) {
                            schemaGroups[node.schema.name] = {schema: node.schema.name, nodes: []};
                        }

                        schemaGroups[node.schema.name].nodes.push(node);
                    });
                    for (var schemaName in schemaGroups) {
                        this.contents.push(schemaGroups[schemaName]);
                    }
                    this.totalItems = response.metadata.totalCount;
                });
        }


        /**
         * Fill the vm with all available schemas.
         */
        public populateSchemas() {
            this.dataService.getSchemas()
                .then(result => this.schemas = result.data);
        }

        public createNewNode(schemaUuid: string) {
            this.editorService.create(schemaUuid, this.parentNode.uuid);
        }

        /**
         * Open the selected content items for editing (i.e. add them to the wipService open items)
         */
        public openSelected() {
            var selectedLangs = {};
            selectedLangs[this.i18nService.getCurrentLang().code] = true;

            this.selectedItems.forEach(function (index) {
                var uuid = this.contents[index].uuid;

                if (!this.wipService.getItem('contents', uuid)) {
                    this.dataService.getContent(this.projectName, uuid)
                        .then(item => {
                            this.wipService.openItem('contents', item, {
                                projectName: this.projectName,
                                parentTagId: this.parentNode.uuid,
                                selectedLangs: selectedLangs
                            });
                        });
                }
            });

            this.selectedItems = [];
        }

        /**
         * Delete the selected content items
         */
        public deleteSelected() {
            var deletedCount = this.selectedItems.length;

            this.showDeleteDialog().then(doDelete);

            function doDelete() {
                this.$q.when(this.deleteNext())
                    .then(function () {
                        this.notifyService.toast('Deleted ' + deletedCount + ' contents');
                        this.populateChildNodes(this.currentPage);
                    });
            }
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
            if (this.selectedItems.length === 0) {
                return;
            } else {
                var index = this.selectedItems.pop(),
                    uuid = this.contents[index].uuid;

                return this.dataService.getContent(this.projectName, uuid)
                    .then(item => this.dataService.deleteNode(this.projectName, item))
                    .then(() => {
                        if (this.wipService.getItem('contents', uuid)) {
                            this.wipService.closeItem('contents', {uuid: uuid});
                        }
                        return this.deleteNext();
                    });
            }
        }
    }
    
    angular.module('meshAdminUi.projects')
           .controller('ProjectExplorerController', ProjectExplorerController);
    

}