module meshAdminUi {

    /**
     * Controller for the content edit/create form.
     */
    class ContentEditorController{
        private wipType = 'contents';
        private projectName: string;
        private parentNodeId: string;

        private isNew: boolean = false;
        private contentModified: boolean = false;
        private availableLangs: ILanguageInfo[];
        private selectedLangs = {};
        private isLoaded: boolean = false;
        private content: INode;
        private schema: any;

        constructor(private $scope: ng.IScope,
                    private $state: ng.ui.IStateService,
                    private $stateParams: any,
                    private confirmActionDialog: ConfirmActionDialog,
                    private $mdDialog: ng.material.IDialogService,
                    private contextService: ContextService,
                    private i18nService: I18nService,
                    private dataService: DataService,
                    private wipService: WipService,
                    private notifyService: NotifyService,
                    private parentNode)  {

            this.parentNodeId = $stateParams.nodeId;
            this.availableLangs = i18nService.languages;
            this.projectName = contextService.getProject().name;
            this.selectedLangs[i18nService.getCurrentLang().code] = true;

            this.getContentData()
                .then(data => this.populateSchema(data))
                .then(() => this.getParentNode())
                .then(() => this.isLoaded = true);

            $scope.$watch('this.contentModified', val => this.modifiedWatchHandler(val));
            $scope.$on('$destroy', () => this.saveWipMetadata());
        }


        /**
         * Save the changes back to the server.
         * @param {Object} content
         */
        public persist(content) {
            this.dataService.persistContent(this.projectName, content)
                .then(response => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_CONTENT_CREATED');
                        this.wipService.closeItem(this.wipType, content);
                        content = response;
                        this.wipService.openItem(this.wipType, content, {
                            projectName: this.projectName,
                            parentTagId: this.parentNodeId,
                            selectedLangs: this.selectedLangs
                        });
                        this.isNew = false;
                        this.$state.go('projects.explorer.content', {
                            projectName: this.projectName,
                            tagId: this.parentNodeId,
                            uuid: content.uuid
                        });
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.wipService.setAsUnmodified(this.wipType, this.content);
                        this.contentModified = false;
                    }
                });
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         * @param content
         */
        public remove(content) {

            this.showDeleteDialog()
                .then(() => this.dataService.deleteContent(content))
                .then(() => {
                    this.wipService.closeItem(this.wipType, content);
                    this.notifyService.toast('Deleted');
                    this.$state.go('projects.explorer');
                });
        }

        /**
         * Close the content, displaying a dialog if it has been modified asking
         * whether to keep or discard the changes.
         */
        public close(content) {
            if (this.wipService.isModified(this.wipType, content)) {
                this.showCloseDialog()
                    .then(response => {
                        if (response === 'save') {
                            this.dataService.persistContent(this.projectName, content);
                            this.notifyService.toast('SAVED_CHANGES');
                        }
                        this.wipService.closeItem(this.wipType, content);
                        this.$state.go('projects.explorer');
                    });
            } else {
                this.wipService.closeItem(this.wipType, content);
                this.$state.go('projects.explorer');
            }
        }


        /**
         * Display the close confirmation dialog box. Returns a promise which is resolved
         * to 'save', 'discard', or rejected if user cancels.
         * TODO: figure out a way to decouple this from the wipTabs component without duplicating all the code.
         */
        public showCloseDialog(): ng.IPromise<string> {
            return this.$mdDialog.show({
                templateUrl: 'common/components/wipTabs/wipTabsCloseDialog.html',
                controller: 'wipTabsDialogController',
                controllerAs: 'vm'
            });
        }

        /**
         * Display a confirmation dialog for the delete action.
         */
        public showDeleteDialog(): ng.IPromise<any> {
            return this.confirmActionDialog.show({
                title: 'Delete Content?',
                message: 'Are you sure you want to delete the selected content?'
            });
        }

        /**
         * When the value of this.contentModified evaluates to true, set the wip as
         * modified.
         * @param val
         */
        public modifiedWatchHandler(val) {
            if (val === true) {
                this.wipService.setAsModified(this.wipType, this.content);
            }
        }

        public saveWipMetadata() {
            this.wipService.setMetadata(this.wipType, this.content.uuid, 'selectedLangs', this.selectedLangs);
        }

        public canDelete() {
            if (this.content && this.content.permissions) {
                return -1 < this.content.permissions.indexOf('delete') && !this.isNew;
            }
        }


        public getParentNode() {
            this.wipService.setMetadata(this.wipType, this.content.uuid, 'parentNodeId', this.parentNodeId);
            this.parentNode = this.parentNode;
        }

        /**
         * Get the content object either from the server if this is being newly opened, or from the
         * wipService if it exists there.
         */
        public getContentData(): ng.IPromise<any> {
            var currentTagId = this.$stateParams.uuid,
                schemaId = this.$stateParams.schemaId;

            if (currentTagId) {
                // loading existing content
                var wipContent = this.wipService.getItem(this.wipType, currentTagId);

                if (wipContent) {
                    return this.populateFromWip(wipContent);
                } else {
                    return this.dataService
                        .getContent(this.projectName, currentTagId)
                        .then(data => {
                            this.content = data;
                            this.wipService.openItem(this.wipType, data, {
                                projectName: this.projectName,
                                parentTagId: this.parentNodeId,
                                selectedLangs: this.selectedLangs
                            });
                            return this.dataService.getSchema(data.schema.uuid);
                        });
                }
            } else if (schemaId) {
                // creating new content
                this.isNew = true;
                return this.dataService.getSchema(schemaId)
                    .then(schema => {
                        this.content = this.createEmptyContent(this.parentNodeId, schema.uuid, schema.title);
                        this.wipService.openItem(this.wipType, this.content, {
                            projectName: this.projectName,
                            parentTagId: this.parentNodeId,
                            isNew: true,
                            selectedLangs: this.selectedLangs
                        });
                        return schema;
                    });
            }
        }

        /**
         * Populate the vm based on the content item retrieved from the wipService.
         */
        public populateFromWip(wipContent: any): ng.IPromise<any> {
            var wipMetadata = this.wipService.getMetadata(this.wipType, wipContent.uuid);
            this.content = wipContent;
            this.contentModified = this.wipService.isModified(this.wipType, this.content);
            this.selectedLangs = wipMetadata.selectedLangs;
            return this.dataService.getSchema(this.content.schema.uuid);
        }

        /**
         * Create an empty content object which is pre-configured according to the arguments passed.
         * @returns {{tagUuid: *, perms: string[], uuid: *, schema: {schemaUuid: *}, schemaName: *}}
         */
        public createEmptyContent(parentTagId: string, schemaId: string, schemaName: string) {
            return {
                tagUuid: parentTagId,
                perms: ['read', 'create', 'update', 'delete'],
                uuid: this.wipService.generateTempId(),
                schema: {
                    schemaUuid: schemaId,
                    schemaName: schemaName
                }
            };
        }

        /**
         * Load the schema data into the this.
         * @param {Object} data
         */
        public populateSchema(data) {
            this.schema = data;
        }
    }

    angular.module('meshAdminUi.projects')
        .controller('ContentEditorController', ContentEditorController);
}