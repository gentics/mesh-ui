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
     * Controller for the content edit/create form.
     */
    class EditorPaneController {
        
        private currentNodeId: string;
        private wipType: string = 'contents';
        private projectName: string;
        private contentModified: boolean;
        private availableLangs: ILanguageInfo[];
        private content: INode;
        private selectedLangs: any;
        private isLoaded: boolean;
        private schema: ISchema;

        constructor(private $scope: ng.IScope,
                    private $location: ng.ILocationService,
                    private $state: ng.ui.IStateService,
                    private editorService: EditorService,
                    private confirmActionDialog: ConfirmActionDialog,
                    private $mdDialog: ng.material.IDialogService,
                    private contextService: ContextService,
                    private i18nService: I18nService,
                    private dataService: DataService,
                    private wipService: WipService,
                    private notifyService: NotifyService) {

            const init = (nodeUuid: string, schemaUuid?: string, parentNodeUuid?: string) => {

                this.projectName = contextService.getProject().name;
                this.currentNodeId = nodeUuid;
                this.contentModified = false;
                this.availableLangs = i18nService.languages;
                this.content = undefined;
                this.selectedLangs = {};
                this.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
                this.isLoaded = false;

                this.getContentData(schemaUuid, parentNodeUuid)
                    .then(data => this.populateSchema(data))
                    .then(() => this.isLoaded = true)
                    .then(() => $location.search('edit', this.content.uuid));
            };

            const empty = () => {
                console.log('running onCloseCallback "empty()"');
                this.isLoaded = false;
            };

            editorService.registerOnOpenCallback(init);
            editorService.registerOnCloseCallback(empty);
            $scope.$on('$destroy', () => this.saveWipMetadata());
        }


        /**
         * Save the changes back to the server.
         */
        public persist(originalNode: INode) {
            this.dataService.persistNode(this.projectName, originalNode)
                .then((node: INode) => {
                    if (this.isNew(node)) {
                        this.notifyService.toast('NEW_CONTENT_CREATED');
                        return this.wipService.closeItem(this.wipType, originalNode)
                            .then(() => node);
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.wipService.setAsUnmodified(this.wipType, this.content);
                        this.contentModified = false;
                        return node;
                    }
                })
                .then(node => {
                    this.content = node;
                    this.$location.search('edit', node.uuid);
                    this.wipService.openItem(this.wipType, node, {
                        projectName: this.projectName,
                        selectedLangs: this.selectedLangs
                    });
                })
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
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
         * Close the content, displaying a dialog if it has been modified asking
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
                message: 'Are you sure you want to delete the selected content?'
            });
        }

        /**
         * Set the wip as modified.
         */
        public setAsModified() {
            this.contentModified = true;
            this.wipService.setAsModified(this.wipType, this.content);

        }

        public saveWipMetadata() {
            this.wipService.setMetadata(this.wipType, this.content.uuid, 'selectedLangs', this.selectedLangs);
        }

        public canDelete(node: INode) {
            if (node) {
                return -1 < node.permissions.indexOf('delete');
            }
        }


        /**
         * Get the content object either from the server if this is being newly opened, or from the
         * wipService if it exists there.
         */
        private getContentData(schemaUuid?: string, parentNodeUuid?: string): ng.IPromise<any> {

            if (this.currentNodeId) {
                // loading existing content
                var wipContent = this.wipService.getItem(this.wipType, this.currentNodeId);

                if (wipContent) {
                    return this.populateFromWip(wipContent);
                } else {
                    return this.dataService
                        .getContent(this.projectName, this.currentNodeId)
                        .then(data => {
                            this.content = data;
                            this.wipService.openItem(this.wipType, data, {
                                projectName: this.projectName,
                                selectedLangs: this.selectedLangs
                            });
                            return this.dataService.getSchema(data.schema.uuid);
                        });
                }
            } else if (schemaUuid) {
                // creating new content
                return this.dataService.getSchema(schemaUuid)
                    .then((schema: ISchema) => {
                        this.content = this.createEmptyContent(schema, parentNodeUuid);
                        this.wipService.openItem(this.wipType, this.content, {
                            projectName: this.projectName,
                            selectedLangs: this.selectedLangs
                        });
                        return schema;
                    });
            }
        }

        /**
         * Populate the vm based on the content item retrieved from the wipService.
         * @param {Object} wipContent
         * @returns {ng.IPromise}
         */
        private populateFromWip(wipContent) {
            var wipMetadata = this.wipService.getMetadata(this.wipType, wipContent.uuid);
            this.content = wipContent;
            this.contentModified = this.wipService.isModified(this.wipType, this.content);
            this.selectedLangs = wipMetadata.selectedLangs;
            return this.dataService.getSchema(this.content.schema.uuid);
        }

        /**
         * Create an empty content object which is pre-configured according to the arguments passed.
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

        private isNew(node: INode) {
            return !node.hasOwnProperty('created');
        }
    }

    export class EditorService {

        private onOpenCallbacks: Function[] = [];
        private onCloseCallbacks: Function[] = [];
        private openNodeId;

        constructor(private $rootScope: ng.IRootScopeService,
                    private $location: ng.ILocationService) {
            /**
             * We need to watch the "edit" query string in order to react to
             * external URL changes, e.g. caused by use of browser back &
             * forward buttons.
             */
            $rootScope.$watch(() => $location.search().edit, newVal => {
                if (newVal && newVal !== this.openNodeId) {
                    this.open(newVal);
                }
            });
        }

        public open(uuid: string) {
            console.log('opening', uuid);
            this.openNodeId = uuid;
            this.onOpenCallbacks.forEach(fn => {
                fn.call(null, uuid);
            });
        }

        public create(schemaId: string, parentNodeUuid: string) {
            this.openNodeId = undefined;
            this.onOpenCallbacks.forEach(fn => {
                fn.call(null, undefined, schemaId, parentNodeUuid);
            });
        }

        public close() {
            this.onCloseCallbacks.forEach(fn => {
                fn.call(null);
            });
        }

        public closeAll() {
            this.$location.search('edit', null);
            this.openNodeId = undefined;
            this.onCloseCallbacks.forEach(fn => {
                fn.call(null);
            });
        }

        public getOpenNodeId() {
            return this.openNodeId;
        }

        public registerOnOpenCallback(callback) {
            this.onOpenCallbacks.push(callback);
        }

        public registerOnCloseCallback(callback) {
            this.onCloseCallbacks.push(callback);
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('editorPane', editorPaneDirective)
        .controller('EditorPaneController', EditorPaneController)
        .service('editorService', EditorService);
}