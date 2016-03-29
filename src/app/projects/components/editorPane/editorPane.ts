module meshAdminUi {

    declare var meshConfig: any;

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
        private node: INode;
        private tags: ITag[];
        private binaryFile: File;
        private selectedLangs: any;
        private isLoaded: boolean;
        private schema: ISchema;

        constructor(private $scope: ng.IScope,
                    private $q: ng.IQService,
                    private $state: ng.ui.IStateService,
                    private $timeout: ng.ITimeoutService,
                    private $location: ng.ILocationService,
                    private deleteNodeDialog: DeleteNodeDialog,
                    private editorService: EditorService,
                    private dispatcher: Dispatcher,
                    private mu: MeshUtils,
                    private contextService: ContextService,
                    private i18nService: I18nService,
                    private dataService: DataService,
                    private wipService: WipService,
                    private notifyService: NotifyService) {

            let ignoreNext = false;

            const init = (event: ng.IAngularEvent, nodeUuid: string, schemaUuid?: string, parentNodeUuid?: string) => {
                /**
                 * When a new node is created, this init function will first be called when the editorService.create()
                 * is invoked and publishes the editorServiceNodeOpened event. In this case, nodeUuid is undefined.
                 *
                 * Next, the url will change to the new  temp id of the new node. This will trigger a watcher in the
                 * editorService which then opens that temp id, triggering a new editorServiceNodeOpened event.
                 * In order to prevent this init function being called twice, we set the `ignoreNext` value to
                 * true (at the bottom of this function), and then the next call to init() will set it
                 * back to false and return.
                 */
                if (ignoreNext) {
                    ignoreNext = false;
                    return;
                }

                this.projectName = contextService.getProject().name;
                this.currentNodeId = nodeUuid;
                this.contentModified = false;
                this.node = undefined;
                this.tags = [];
                this.selectedLangs = {};
                this.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
                this.isLoaded = false;
                this.binaryFile = undefined;
                this.getNodeData(schemaUuid, parentNodeUuid)
                    .then(() => this.isLoaded = true)
                    .then(() => $location.search('edit', this.node.uuid));

                ignoreNext = (typeof nodeUuid === 'undefined');
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
        public persist(originalNode: INode): ng.IPromise<any> {
            return this.dataService.persistNode(this.projectName, originalNode, { expandAll: true })
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
                });
        }



        public createTranslation(langCode: string, node: INode) {
            let nodeClone = angular.copy(node);
            nodeClone.language = langCode;
            if (typeof node.fields[node.displayField] === 'string') {
                nodeClone.fields[node.displayField] += ` (${langCode.toUpperCase()})`
            }
            this.persist(nodeClone)
                .then(() => {
                    this.updateCurrentNodeAvailableLangs(node, langCode);
                    this.i18nService.setCurrentLang(langCode);
                    this.$state.reload();
                    this.$timeout(() => {
                        //this.editorService.open(node.uuid);
                    }, 500);
                });
        }

        private updateCurrentNodeAvailableLangs(node: INode, langCode: string) {
            if (node.availableLanguages instanceof Array) {
                node.availableLanguages.push(langCode);
            } else {
                node.availableLanguages = [node.language, langCode];
            }
        }

        public openInLanguage(langCode: string, node: INode) {
            this.i18nService.setCurrentLang(langCode);
            this.$state.reload();
            this.$timeout(() => {
                this.editorService.open(node.uuid);
            }, 500);
        }

        private processNewNode(node: INode) {
            this.node = node;
            this.$location.search('edit', node.uuid);
            this.openInWipService(node);
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
                        this.notifyService.toast('ADDED_TAG', { name: tag.fields.name });
                        this.dispatcher.publish(this.dispatcher.events.explorerNodeTagsChanged, node.uuid);
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
                    this.notifyService.toast('REMOVED_TAG', { name: tag.fields.name });
                    this.dispatcher.publish(this.dispatcher.events.explorerNodeTagsChanged, node.uuid);
                });
        }

        /**
         * Delete the open node, displaying a confirmation dialog first before making the API call.
         */
        public remove(node: INode) {
            this.deleteNodeDialog.show(node)
                .then((langs: string[]) => {
                    if (!this.isNew(node)) {
                        if (this.checkDeleteAll(langs, node)) {
                            return this.dataService.deleteNode(this.projectName, node);
                        } else {
                            let promises = langs.map(code => {
                                return this.dataService.deleteNodeLanguage(this.projectName, node, code);
                            });
                            return this.$q.all(promises);
                        }
                    }
                })
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.closeWipAndClearPane(node);
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                });
        }

        /**
         * Did the user select to delete all available languages?
         */
        private checkDeleteAll(langs: string[], node: INode) {
            if (!node.availableLanguages || node.availableLanguages.length < 2) {
                return true;
            }

            return node.availableLanguages.length === langs.length;
        }

        private closeWipAndClearPane(node: INode) {
            this.wipService.closeItem(this.wipType, node);
            this.editorService.close();
            this.$location.search('edit', null);
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
         * Returns true if the form has changed (contentModified) and all
         * required fields have a non-empty value.
         */
        public formIsValid(): boolean {
            if (!this.contentModified) {
                return false;
            }

            const fieldIsValidReducer = (valid: boolean, field: ISchemaFieldDefinition) => {
                if (field.required) {
                    let nodeField = this.node.fields[field.name];
                    if (this.fieldIsEmpty(nodeField, field)) {
                        return false;
                    }
                    if (this.numberFieldIsInvalid(nodeField, field)) {
                        return false;
                    }
                }
                return valid;
            };

            if (this.schema && this.schema.fields instanceof Array) {
                return this.schema.fields.reduce(fieldIsValidReducer, true);
            }
        }

        /**
         * Returns true if the field has an "empty" value - definition of which varies according to the
         * field type.
         */
        private fieldIsEmpty(field: any, fieldDef: ISchemaFieldDefinition): boolean {
            if (fieldDef.type === 'binary') {
                // binary fields have a special check for "emptiness"
                if (field && !(field instanceof File) && !field.hasOwnProperty('sha512sum')) {
                    return true;
                }
            }
            if (!field || field === '') {
                return true;
            }
            return false;
        }

        /**
         * Returns true if the value of a number field is within any specified `min` and `max` limits.
         */
        private numberFieldIsInvalid(field: any, fieldDef: ISchemaFieldDefinition): boolean {
            if (fieldDef.type === 'number') {
                if (fieldDef.min && field < fieldDef.min ||
                        fieldDef.max && fieldDef.max < field) {
                    return false;
                }
            }
            return false;
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
                    return this.dataService.getNode(this.projectName, this.currentNodeId, { expandAll: true })
                        .then(node => {
                            this.node = node;
                            this.tags = this.mu.nodeTagsObjectToArray(node.tags);
                            this.openInWipService(this.node);
                            return this.dataService.getSchema(node.schema.uuid);
                        })
                        .then(schema => this.schema = schema);
                }
            } else if (schemaUuid) {
                // creating new node
                return this.dataService.getSchema(schemaUuid)
                    .then((schema: ISchema) => {
                        this.node = this.createEmptyContent(schema, parentNodeUuid);
                        this.openInWipService(this.node);
                        this.schema = schema;
                    });
            }
        }

        private openInWipService(node: INode) {
            this.wipService.openItem(this.wipType, node, {
                projectName: this.projectName,
                selectedLangs: this.selectedLangs
            });
        }

        /**
         * Populate the vm based on the node item retrieved from the wipService.
         */
        private populateFromWip(wipContent): ng.IPromise<any> {
            var wipMetadata = this.wipService.getMetadata(this.wipType, wipContent.uuid);
            this.node = wipContent;
            this.tags = this.mu.nodeTagsObjectToArray(wipContent.tags);
            this.contentModified = this.wipService.isModified(this.wipType, this.node);
            this.selectedLangs = wipMetadata.selectedLangs;
            return this.dataService.getSchema(this.node.schema.uuid)
                .then(schema => this.schema = schema);
        }

        /**
         * Create an empty node object which is pre-configured according to the arguments passed.
         */
        private createEmptyContent(schema: ISchema, parentNodeUuid: string): INode {
            return {
                permissions: ['read', 'create', 'update', 'delete'],
                uuid: this.wipService.generateTempId(),
                parentNodeUuid: parentNodeUuid,
                displayField: schema.displayField,
                published: false,
                language : this.i18nService.getCurrentLang().code,
                schema: {
                    uuid: schema.uuid,
                    name: schema.name
                },
                fields: {}
            };
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