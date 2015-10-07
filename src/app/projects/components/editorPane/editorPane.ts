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
        private isNew: boolean;
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

            const init = (nodeUuid) => {

                this.projectName = contextService.getProject().name;
                this.currentNodeId = nodeUuid;
                $location.search('edit', nodeUuid);

                this.isNew = false;
                this.contentModified = false;
                this.availableLangs = i18nService.languages;
                this.content = undefined;
                this.selectedLangs = {};
                this.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
                this.isLoaded = false;

                this.getContentData()
                    .then(data => this.populateSchema(data))
                    .then(() => this.isLoaded = true);
            };

            editorService.registerOnOpenCallback(init);
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
                            selectedLangs: this.selectedLangs
                        });
                        this.isNew = false;
                        this.$state.go('projects.explorer.content', {projectName: this.projectName, uuid: content.uuid});
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
         *
         * @param content
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
            if (this.content) {
                return -1 < this.content.permissions.indexOf('delete') && !this.isNew;
            }
        }


        /**
         * Get the content object either from the server if this is being newly opened, or from the
         * wipService if it exists there.
         *
         * @returns {ng.IPromise}
         */
        private getContentData() {
            var schemaId = this.$location.search().schemaId;

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
            } else if (schemaId) {
                // creating new content
                this.isNew = true;
                return this.dataService.getSchema(schemaId)
                    .then(schema => {
                        this.content = this.createEmptyContent(schema.uuid, schema.title);
                        this.wipService.openItem(this.wipType, this.content, {
                            projectName: this.projectName,
                            isNew: true,
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
         *
         * @param {string} schemaId
         * @param {string} schemaName
         * @returns {{tagUuid: *, perms: string[], uuid: *, schema: {schemaUuid: *}, schemaName: *}}
         */
        private createEmptyContent(schemaId, schemaName) {
            return {
                perms: ['read', 'create', 'update', 'delete'],
                uuid: this.wipService.generateTempId(),
                schema: {
                    uuid: schemaId,
                    name: schemaName
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
    }

    export class EditorService {

        private onOpenCallbacks = [];
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
                    open(newVal);
                }
            });
        }

        public open(uuid) {
            this.openNodeId = uuid;
            this.onOpenCallbacks.forEach(function (fn) {
                fn.call(null, uuid);
            });
        }

        public getOpenNodeId() {
            return this.openNodeId;
        }

        public registerOnOpenCallback(callback) {
            this.onOpenCallbacks.push(callback);
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('editorPane', editorPaneDirective)
        .controller('EditorPaneController', EditorPaneController)
        .service('editorService', EditorService);
}