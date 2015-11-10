module meshAdminUi {

    import Preferences = protractor.logging.Preferences;
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
        private tags: ITag[];
        private binaryFile: File;
        private selectedLangs: any;
        private isLoaded: boolean;
        private schema: ISchema;

        constructor(private $scope: ng.IScope,
                    private $location: ng.ILocationService,
                    private editorService: EditorService,
                    private dispatcher: Dispatcher,
                    private confirmActionDialog: ConfirmActionDialog,
                    private mu: MeshUtils,
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
                this.tags = [];
                this.selectedLangs = {};
                this.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
                this.isLoaded = false;
                this.binaryFile = undefined;

                this.getNodeData(schemaUuid, parentNodeUuid)
                    .then(data => this.populateSchema(data))
                    .then(() => this.isLoaded = true)
                    .then(() => $location.search('edit', this.node.uuid));
            };

            const empty = () => {
                this.isLoaded = false;
            };

            const emptyIfOpenNodeDeleted = () => {
                if (!wipService.isOpen(this.wipType, this.node.uuid)) {
                    empty();
                }
            };

            dispatcher.subscribe(dispatcher.events.editorServiceNodeOpened, init);
            dispatcher.subscribe(dispatcher.events.editorServiceNodeClosed, empty);
            dispatcher.subscribe(dispatcher.events.explorerContentsChanged, emptyIfOpenNodeDeleted);
            $scope.$on('$destroy', () => {
                dispatcher.unsubscribeAll(init, empty, emptyIfOpenNodeDeleted);
                this.saveWipMetadata()
            });
        }

        /**
         * Save the changes back to the server.
         */
        public persist(originalNode: INode) {
            this.dataService.persistNode(this.projectName, originalNode, this.binaryFile)
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
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                })
                .catch(error => {
                    this.notifyService.toast(error.data.message || error.data);
                })
        }

        private processNewNode(node: INode) {
            this.node = node;
            this.$location.search('edit', node.uuid);
            this.wipService.openItem(this.wipType, node, {
                projectName: this.projectName,
                selectedLangs: this.selectedLangs
            });
        }

        public addTag(tag: ITag) {
            if (!tag) {
                return;
            }
            let tagIsDuplicate = -1 < this.tags.map(tag => tag.uuid).indexOf(tag.uuid);
            if (!tagIsDuplicate) {
                this.dataService.addTagToNode(this.projectName, this.node, tag)
                    .then(node => {
                        this.tags.push(tag);
                        this.node.tags = node.tags;
                        this.notifyService.toast(`Added tag "${tag.fields.name}"`)
                    });
            }
        }

        public removeTag(tag: ITag) {
            if (!tag) {
                return;
            }
            this.dataService.removeTagFromNode(this.projectName, this.node, tag)
                .then(node => {
                    let index = this.tags.map(tag => tag.uuid).indexOf(tag.uuid);
                    this.tags.splice(index, 1);
                    this.node.tags = node.tags;
                    this.notifyService.toast(`Removed tag "${tag.fields.name}"`)
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
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                });
        }

        private closeWipAndClearPane(node: INode) {
            this.editorService.close();
            this.wipService.closeItem(this.wipType, node);
            this.$location.search('edit', null);
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
                            this.tags = this.mu.nodeTagsObjectToArray(data.tags);
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

        public getBinaryFileUrl(): string {
            if (this.node && typeof this.node.created !== 'undefined') {
                return meshConfig.apiUrl + this.projectName + '/nodes/' + this.node.uuid + '/bin';
            } else {
                return '';
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
            this.tags = this.mu.nodeTagsObjectToArray(wipContent.tags);
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