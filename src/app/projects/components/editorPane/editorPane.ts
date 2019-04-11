module meshAdminUi {

    declare var meshUiConfig;

    function editorPaneDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/editorPane/editorPane.html',
            controller: 'EditorPaneController',
            controllerAs: 'vm',
            scope: {}
        };
    }

    interface LiveUrlConfig {
        providePath?: boolean;
        urlResolver?(node: INode, path?: string): string;
    }

    /**
     * Controller for the node edit/create form.
     */
    class EditorPaneController {

        private currentNodeId: string;
        private wipType: string = 'contents';
        private projectName: string;
        private contentModified: boolean;
        private tagsModified: boolean;
        private node: INode;
        private binaryFile: File;
        private selectedLangs: any;
        private isLoaded: boolean;
        private schema: ISchema;
        private liveUrl: string;
        private microschemas: IMicroschema[];

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

            // Save a copy of the current language name to prevent a race condition when switching languages, where
            // this constructor is invoked before the $destroy() handler has a chance to
            // clean up the dispatcher subscriptions, causing init() to be called twice on the
            // newly-opened node.
            let currentLangName = i18nService.getCurrentLang().name;

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

                // see note above at declaration of currentLangName
                if (currentLangName !== i18nService.getCurrentLang().name) {
                    return;
                }

                this.projectName = contextService.getProject().name;
                this.currentNodeId = nodeUuid;
                this.contentModified = false;
                this.tagsModified = false;
                this.node = undefined;
                this.selectedLangs = {};
                this.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
                this.isLoaded = false;
                this.binaryFile = undefined;
                this.getNodeData(schemaUuid, parentNodeUuid)
                    .then(() => this.isLoaded = true)
                    .then(() => $location.search('edit', this.node.uuid))
                    .then(() => this.initLiveUrl());
                this.dataService.getMicroschemas().then(resp => this.microschemas = resp.data);

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
            dispatcher.subscribe(dispatcher.events.nodeUnpublished, (event, node: INode) => {
                if (this.node) {
                    this.node.availableLanguages = node.availableLanguages;
                }
            });

            $scope.$on('$destroy', () => {
                if (this.node !== undefined) {
                    this.saveWipMetadata();
                }
                dispatcher.unsubscribeAll(init, empty, emptyIfOpenNodeDeleted);
            });
        }

        private initLiveUrl() {
            const config: LiveUrlConfig = meshUiConfig.liveUrl;
            if (!config || !(typeof config.urlResolver === 'function')) {
                return;
            }
            let url: ng.IPromise<string>;
            if (config.providePath) {
                url = this.dataService.getPath(this.projectName, this.node.uuid)
                    .then(path => config.urlResolver(this.node, path));
            } else {
                url = this.$q.when(config.urlResolver(this.node));
            }
            url.then(u => this.liveUrl = u);
        }

        public isPublished(): boolean {
            return this.node && this.node.availableLanguages && this.node.language && this.node.version &&
                this.node.availableLanguages[this.node.language].version === this.node.version &&
                this.node.availableLanguages[this.node.language].published;
        }

        public readyToPublish(): boolean {
            const isPublished = this.isPublished();
            return !isPublished || (isPublished && (this.contentModified || this.tagsModified) && this.formIsValid());
        }

        /**
         * Save any changes and then publish the node
         */
        public publish(): void {
            let savePromise: ng.IPromise<any>;
            let savingNode: boolean = false;
            if ((this.contentModified || this.tagsModified) && this.formIsValid()) {
                savePromise = this.persist(this.node);
                savingNode = true;
            } else {
                savePromise = this.$q.when();
            }
            savePromise.then(() => {
                this.dataService.publishNode(this.projectName, this.node)
                    .then(data => {
                        const newVersionInfo = data.availableLanguages[this.node.language];
                        if (newVersionInfo) {
                            this.node.version = newVersionInfo.version;
                            this.node.availableLanguages[this.node.language] = newVersionInfo;
                            this.wipService.updateItem(this.wipType, this.node);
                            this.notifyService.toast('PUBLISHED');
                            if (!savingNode){
                                return this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                            }
                        }
                    })
                    .catch(error => {
                       this.notifyService.toast(error.data.message || error.data);
                   });
            }).catch(error => {
                this.notifyService.toast(error.data.message || error.data);
            });
        }

        /**
         * Save the changes back to the server.
         */
        public persist(originalNode: INode, forceApiCall: boolean = false): ng.IPromise<any> {
            const promises: ng.IPromise<INode>[] = [];
            if (this.contentModified || forceApiCall) {
                promises.push(
                    this.dataService.persistNode(this.projectName, originalNode, { expandAll: true })
                );
            } else {
                promises.push(this.$q.when(originalNode));
            }

            if (this.tagsModified) {
                promises.push(
                    this.dataService.updateNodeTags(this.projectName, this.node, this.node.tags)
                        .then(() => originalNode)
                )
            }

            return this.$q.all<INode>(promises)
                .then((result) => {
                    const node = result[0];
                    this.node = node;
                    if (this.isNew(originalNode)) {
                        this.notifyService.toast('NEW_CONTENT_CREATED');
                        this.wipService.closeItem(this.wipType, originalNode);
                        this.processNewNode(node);
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.wipService.setAsUnmodified(this.wipType, this.node);
                    }
                    if (this.tagsModified) {
                        this.dispatcher.publish(this.dispatcher.events.explorerNodeTagsChanged, this.node.uuid);
                    }
                    this.contentModified = false;
                    this.tagsModified = false;
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                })
                .catch(error => {
                    this.notifyService.toast(error.data.message || error.data);
                    return this.$q.reject(error);
                });
        }


        // TODO: This logic will largely be replaced by a dedicated translation endpoint.
        // See https://jira.gentics.com/browse/CL-396
        public createTranslation(langCode: string, node: INode) {
            let nodeClone = this.mu.safeCloneNode(node, this.schema, langCode.toUpperCase());
            nodeClone.language = langCode;

            // Display a warning if there are any binary fields - these cannot be handled properly
            // until the dedicated translation endpoint is implemented in Mesh.
            let firstBinaryField = this.mu.getFirstBinaryField(node);
            if (firstBinaryField.key !== undefined) {
                console.warn(`Note: binary fields cannot yet be copied to translated version.`);
            }

            this.persist(nodeClone, true)
                .then(() => {
                    this.updateCurrentNodeAvailableLangs(node, langCode);
                    this.i18nService.setCurrentLang(langCode);
                    this.$state.reload();
                    this.$timeout(() => {
                        this.editorService.open(node.uuid);
                    }, 500);
                });
        }

        private updateCurrentNodeAvailableLangs(node: INode, langCode: string) {
            if (node.availableLanguages) {
                node.availableLanguages[langCode] = {
                    published: false,
                    version: '0.1'
                };
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
            this.$location.search('edit', node.uuid);
            this.openInWipService(node);
        }

        public addTag(tag: ITag) {
            if (!tag) {
                return;
            }
            let tagIsDuplicate = -1 < this.node.tags.map(tag => tag.uuid).indexOf(tag.uuid);
            if (!tagIsDuplicate) {
                this.tagsModified = true;
                this.wipService.setAsModified(this.wipType, this.node);
                this.node.tags.push({
                    name: tag.name,
                    uuid: tag.uuid,
                    tagFamily: tag.tagFamily.name
                });
            }
        }

        public removeTag(tag: ITagReference) {
            if (!tag) {
                return;
            }
            this.tagsModified = true;
            this.wipService.setAsModified(this.wipType, this.node);
            let index = this.node.tags.map(tag => tag.uuid).indexOf(tag.uuid);
            this.node.tags.splice(index, 1);
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
                    this.editorService.closeAll();
                    this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged);
                });
        }

        /**
         * Did the user select to delete all available languages?
         */
        private checkDeleteAll(langs: string[], node: INode) {
            const langCount = Object.keys(node.availableLanguages).length;

            if (!node.availableLanguages || langCount < 2) {
                return true;
            }

            return langCount === langs.length;
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
                return node.permissions.delete;
            }
        }

        /**
         * Returns true if the form has changed (contentModified) and all
         * required fields have a non-empty value.
         */
        public formIsValid(): boolean {
            if (!this.contentModified && !this.tagsModified) {
                return false;
            }

            const fieldIsValidReducer = (container: {fields: INodeFields}) => (valid: boolean, field: ISchemaFieldDefinition) => {
                if (field.required) {
                    let nodeField = container.fields[field.name];
                    if (this.fieldIsEmpty(nodeField, field)) {
                        return false;
                    }
                    if (this.numberFieldIsInvalid(nodeField, field)) {
                        return false;
                    }
                }
                if (field.type === 'micronode' && this.microschemas) {
                    const nodeField = container.fields[field.name];
                    const microschema = this.microschemas.filter(m => m.name === nodeField.microschema.name)[0];
                    if (microschema) {
                        return microschema.fields.reduce(fieldIsValidReducer(nodeField), valid);
                    }
                } else if (field.type === 'list' && field.listType === 'micronode') {
                    const listField = container.fields[field.name];
                    if (listField instanceof Array) {
                        return listField.reduce((listValid: boolean, listItem: any) => {
                            const microschema = this.microschemas
                                .filter(m => m.name === listItem.microschema.name)[0];
                            if (microschema) {
                                return microschema.fields.reduce(fieldIsValidReducer(listItem), listValid);
                            } else {
                                return listValid;
                            }
                        }, valid);
                    }
                }
                return valid;
            };

            if (this.schema && this.schema.fields instanceof Array) {
                return this.schema.fields.reduce(fieldIsValidReducer(this.node), true);
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
                let wipContent = this.wipService.getItem(this.wipType, this.currentNodeId);
                let wipIsModified = wipContent && this.wipService.isModified(this.wipType, wipContent);

                if (wipContent && wipIsModified) {
                    return this.populateFromWip(wipContent);
                } else {
                    return this.dataService.getNode(this.projectName, this.currentNodeId, { expandAll: true })
                        .then(node => {
                            this.node = node;
                            this.dispatcher.publish(this.dispatcher.events.nodeLoaded, node);
                            if (!wipContent) {
                                this.openInWipService(this.node);
                            } else {
                                // the node is already open as a wip, but is not modified. Therefore we use the
                                // newly-fetched data to update that wip.
                                this.wipService.updateItem(this.wipType, node);
                            }
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
                permissions: {
                    read: true,
                    create: true,
                    update: true,
                    delete: true,
                    readPublished: true,
                    publish: true
                },
                uuid: this.wipService.generateTempId(),
                parentNode: {
                    uuid: parentNodeUuid
                },
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