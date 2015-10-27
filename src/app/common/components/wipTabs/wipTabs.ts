module meshAdminUi {

    /**
     * Directive work-in-progress (WIP) tabs which allow switching between open editor views.
     */
    function wipTabs() {

        return {
            restrict: 'E',
            templateUrl: 'common/components/wipTabs/wipTabs.html',
            controller: 'wipTabsController',
            controllerAs: 'vm',
            scope: {}
        };
    }

    class WipTabsController {
        private wipType: string = 'contents';
        private lastIndex: number = 0;
        private wips: any[] = [];
        private modified: string[] = [];
        private selectedIndex: number = 0;
        private lang: string;

        constructor($scope: ng.IScope,
                    private $q: ng.IQService,
                    private $mdDialog: ng.material.IDialogService,
                    private dispatcher: Dispatcher,
                    private editorService: EditorService,
                    private i18nService: I18nService,
                    private wipService: WipService,
                    private dataService: DataService,
                    private notifyService: NotifyService) {

            const changeHandler = () => this.wipChangeHandler();
            const openHandler = (event, uuid) => this.editorOpenHandler(uuid);

            this.lang = i18nService.getCurrentLang().code;
            this.dispatcher.subscribe(this.dispatcher.events.wipsChanged, changeHandler);
            this.dispatcher.subscribe(this.dispatcher.events.editorServiceNodeOpened, openHandler);
            $scope.$on('$destroy', () => {
                this.dispatcher.unsubscribeAll(changeHandler, openHandler);
            });
            window.addEventListener('beforeunload', () => this.persistOpenWipsLocally());

            this.wipChangeHandler(); // populate with WIPs on load.
        }

        /**
         * Has the WIP with the specified uuid been modified?
         */
        public isModified(uuid: string): boolean {
            return -1 < this.modified.indexOf(uuid);
        }

        public open(uuid: string) {
            this.editorService.open(uuid);
            this.editorOpenHandler(uuid);
        }

        /**
         * Close a WIP tab and remove the WIP item from the wipService,
         * automatically switching to another tab or the list view.
         */
        public closeWip(event: Event, index: number) {
            var wip = this.wips[index].item,
                projectName = this.wips[index].metadata.projectName,
                action;

            event.stopPropagation();
            event.preventDefault();
            this.lastIndex = this.selectedIndex;

            if (this.wipService.isModified(this.wipType, wip)) {
                action = this.showDialog().then(response => {
                    if (response === 'save') {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.dataService.persistNode(projectName, wip)
                            .then(() => this.dispatcher.publish(this.dispatcher.events.explorerContentsChanged));
                    }
                });
            } else {
                action = this.$q.when();
            }

            action.then(() => {
                this.wipService.closeItem(this.wipType, wip);
                this.transitionIfCurrentTabClosed(index);
            });
        }

        /**
         * Display the close confirmation dialog box. Returns a promise which is resolved
         * to 'save', 'discard', or rejected if user cancels.
         */
        public showDialog(): ng.IPromise<string> {
            return this.$mdDialog.show({
                templateUrl: 'common/components/wipTabs/wipTabsCloseDialog.html',
                controller: 'wipTabsDialogController',
                controllerAs: 'vm'
            });
        }

        /**
         * If the current tab has been closed, select the next tab in the editor pane.
         */
        private transitionIfCurrentTabClosed(closedTabIndex: number) {
            if (closedTabIndex === this.lastIndex) {
                if (0 < this.wips.length) {
                    let selectedIndex = this.selectedIndex !== -1 ? this.selectedIndex : 0;
                    this.editorService.open(this.wips[selectedIndex].item.uuid)
                } else {
                    this.editorService.closeAll();
                }
            }
        }

        /**
         * Callback to be invoked whenever the contents of the wipService changes
         * i.e. an item is added or removed. Keeps the UI in sync with the
         * wip store.
         */
        private wipChangeHandler() {
            this.wips = this.wipService.getOpenItems(this.wipType);
            this.modified = this.wipService.getModifiedItems(this.wipType);
            this.selectedIndex = this.indexByUuid(this.wips, this.editorService.getOpenNodeId());
        }

        private editorOpenHandler(uuid: string) {
            this.selectedIndex = this.indexByUuid(this.wips, uuid);
        }

        /**
         * Persist any open WIPs to the browser's localStorage.
         */
        private persistOpenWipsLocally() {
            this.wipService.persistLocal();
        }

        /**
         * Get the index of a given WIP item in the collection by its uuid.
         */
        private indexByUuid(collection: any[], uuid: string): number {
            return collection.map(wip => wip.item.uuid).indexOf(uuid);
        }
    }

    /**
     * Controller used to set the return value of the close dialog box.
     */
    class WipTabsDialogController {

        constructor(private $mdDialog: ng.material.IDialogService) {}

        public save() {
            this.$mdDialog.hide('save');
        }

        public discard() {
            this.$mdDialog.hide('discard');
        }

        public cancel() {
            this.$mdDialog.cancel();
        }
    }

    angular.module('meshAdminUi.common')
        .directive('wipTabs', wipTabs)
        .controller('wipTabsController', WipTabsController)
        .controller('wipTabsDialogController', WipTabsDialogController);

}