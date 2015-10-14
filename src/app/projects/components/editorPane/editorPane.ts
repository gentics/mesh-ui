module meshAdminUi {

    function editorPaneDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/editorPane/editorPane.html',
            controller: 'EditorPaneController',
            controllerAs: 'vm',
            scope: {}
        };
    }

    /**
     * Controller for the node edit/create form.
     */
    class EditorPaneController {
        
        private currentNodeId: string;
        private wipType: string = 'contents';
        private projectName: string;
        private contentModified: boolean;
        private availableLangs: ILanguageInfo[];
        private node: INode;
        private selectedLangs: any;
        private isLoaded: boolean;
        private schema: ISchema;

        constructor(private $scope: ng.IScope,
                    private $location: ng.ILocationService,
                    private editorService: EditorService,
                    private dispatcher: Dispatcher,
                    private confirmActionDialog: ConfirmActionDialog,
                    private $mdDialog: ng.material.IDialogService,
                    private contextService: ContextService,
                    private i18nService: I18nService,
                    private dataService: DataService,
                    private wipService: WipService,
                    private notifyService: NotifyService) {

            const init = (event: ng.IAngularEvent, nodeUuid: string, schemaUuid?: string, parentNodeUuid?: string) => {

                this.projectName = contextService.getProject().name;
                this.currentNodeId = nodeUuid;
                this.contentModified = false;
                this.availableLangs = i18nService.languages;
                this.node = undefined;
                this.selectedLangs = {};
                this.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
                this.isLoaded = false;

                this.getNodeData(schemaUuid, parentNodeUuid)
                    .then(data => this.populateSchema(data))
                    .then(() => this.isLoaded = true)
                    .then(() => $location.search('edit', this.node.uuid));
            };

            const empty = () => {
                this.isLoaded = false;
            };

            dispatcher.subscribe(dispatcher.events.editorServiceNodeOpened, init);
            dispatcher.subscribe(dispatcher.events.editorServiceNodeClosed, empty);
            $scope.$on('$destroy', () => {
                dispatcher.unsubscribeAll(init, empty);
                this.saveWipMetadata()
            });
        }

        /**
         * Save the changes back to the server.
         */
        public persist(originalNode: INode) {
            this.dataService.persistNode(this.projectName, originalNode)
                .then((node: INode) => {
                    if (this.isNew(originalNode)) {
                        this.notifyService.toast('NEW_CONTENT_CREATED');
                        this.wipService.closeItem(this.wipType, originalNode);
                        this.processNewNode(node);
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.wipService.setAsUnmodified(this.wipType, this.node);
                        this.contentModified = false;
                    }
                });
        }

        private processNewNode(node: INode) {
            this.node = node;
            this.$location.search('edit', node.uuid);
            this.wipService.openItem(this.wipType, node, {
                projectName: this.projectName,
                selectedLangs: this.selectedLangs
            });
        }

        /**
         * Delete the open node, displaying a confirmation dialog first before making the API call.
         */
        public remove(node: INode) {

            this.showDeleteDialog()
                .then(() => {
                    if (!this.isNew(node)) {
                        return this.dataService.deleteNode(this.projectName, node)
                    }
                })
                .then(() => {
                    this.notifyService.toast('Deleted');
                    this.closeWipAndClearPane(node);
                });
        }

        /**
         * Close the node, displaying a dialog if it has been modified asking
         * whether to keep or discard the changes.
         */
        public close(content) {
            if (this.wipService.isModified(this.wipType, content)) {
                this.showCloseDialog()
                    .then(response => {
                        if (response === 'save') {
                            this.dataService.persistNode(this.projectName, content);
                            this.notifyService.toast('SAVED_CHANGES');
                        }
                        this.closeWipAndClearPane(content);
                    });
            } else {
                this.closeWipAndClearPane(content);
            }
        }

        private closeWipAndClearPane(node: INode) {
            this.editorService.close();
            this.wipService.closeItem(this.wipType, node);
            this.$location.search('edit', null);
        }


        /**
         * Display the close confirmation dialog box. Returns a promise which is resolved
         * to 'save', 'discard', or rejected if user cancels.
         * TODO: figure out a way to decouple this from the wipTabs component without duplicating all the code.
         * @return {ng.IPromise<String>}
         */
        public showCloseDialog() {
            return this.$mdDialog.show({
                templateUrl: 'common/components/wipTabs/wipTabsCloseDialog.html',
                controller: 'wipTabsDialogController',
                controllerAs: 'vm'
            });
        }

        /**
         * Display a confirmation dialog for the delete action.
         * @returns {angular.IPromise<any>|any|void}
         */
        public showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'Delete Content?',
                message: 'Are you sure you want to delete the selected node?'
            });
        }

        /**
         * Set the wip as modified.
         */
        public setAsModified() {
            this.contentModified = true;
            this.wipService.setAsModified(this.wipType, this.node);

        }

        public saveWipMetadata() {
            this.wipService.setMetadata(this.wipType, this.node.uuid, 'selectedLangs', this.selectedLangs);
        }

        public canDelete(node: INode) {
            if (node) {
                return -1 < node.permissions.indexOf('delete');
            }
        }


        /**
         * Get the node object either from the server if this is being newly opened, or from the
         * wipService if it exists there.
         */
        private getNodeData(schemaUuid?: string, parentNodeUuid?: string): ng.IPromise<any> {

            if (this.currentNodeId) {
                // loading existing node
                var wipContent = this.wipService.getItem(this.wipType, this.currentNodeId);

                if (wipContent) {
                    return this.populateFromWip(wipContent);
                } else {
                    return this.dataService.getNode(this.projectName, this.currentNodeId)
                        .then(data => {
                            this.node = data;
                            this.wipService.openItem(this.wipType, data, {
                                projectName: this.projectName,
                                selectedLangs: this.selectedLangs
                            });
                            return this.dataService.getSchema(data.schema.uuid);
                        });
                }
            } else if (schemaUuid) {
                // creating new node
                return this.dataService.getSchema(schemaUuid)
                    .then((schema: ISchema) => {
                        this.node = this.createEmptyContent(schema, parentNodeUuid);
                        this.wipService.openItem(this.wipType, this.node, {
                            projectName: this.projectName,
                            selectedLangs: this.selectedLangs
                        });
                        return schema;
                    });
            }
        }

        /**
         * Populate the vm based on the node item retrieved from the wipService.
         * @param {Object} wipContent
         * @returns {ng.IPromise}
         */
        private populateFromWip(wipContent) {
            var wipMetadata = this.wipService.getMetadata(this.wipType, wipContent.uuid);
            this.node = wipContent;
            this.contentModified = this.wipService.isModified(this.wipType, this.node);
            this.selectedLangs = wipMetadata.selectedLangs;
            return this.dataService.getSchema(this.node.schema.uuid);
        }

        /**
         * Create an empty node object which is pre-configured according to the arguments passed.
         */
        private createEmptyContent(schema: ISchema, parentNodeUuid: string) {
            return {
                permissions: ['read', 'create', 'update', 'delete'],
                uuid: this.wipService.generateTempId(),
                parentNodeUuid: parentNodeUuid,
                displayField: schema.displayField,
                language : this.i18nService.getCurrentLang().code,
                schema: {
                    uuid: schema.uuid,
                    name: schema.name
                },
                fields: {}
            };
        }

        /**
         * Load the schema data into the this.
         * @param {Object} data
         */
        private populateSchema(data) {
            this.schema = data;
        }

        /**
         * Is the node new, i.e. is has not come from Mesh, but is has been created on the client.
         */
        private isNew(node: INode): boolean {
            return !node || !node.hasOwnProperty('created');
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('editorPane', editorPaneDirective)
        .controller('EditorPaneController', EditorPaneController);
}