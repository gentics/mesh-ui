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
        private displayTabs: boolean = true;
        private explorer;

        constructor(private $scope: ng.IScope,
                    private $state: ng.ui.IStateService,
                    private $mdDialog: ng.material.IDialogService,
                    private editorService: EditorService,
                    private i18nService: I18nService,
                    private wipService: WipService,
                    private dataService: DataService,
                    private notifyService: NotifyService) {

            this.lang = i18nService.getCurrentLang().code;

            wipService.registerWipChangeHandler(() => this.wipChangeHandler());
            editorService.registerOnOpenCallback(uuid => this.editorOpenHandler(uuid));
            $scope.$on('$stateChangeStart', (event, toState) => this.stateChangeStartHandler(event, toState));
            $scope.$on('$stateChangeSuccess', (event, toState, toParams) => this.stateChangeSuccessHandler(event, toState, toParams));
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
                projectName = this.wips[index].metadata.projectName;

            event.stopPropagation();
            event.preventDefault();
            this.lastIndex = this.selectedIndex;

            if (this.wipService.isModified(this.wipType, wip)) {
                this.showDialog().then(response => {
                    if (response === 'save') {
                        this.dataService.persistContent(projectName, wip);
                        this.notifyService.toast('SAVED_CHANGES');
                    }
                    this.wipService.closeItem(this.wipType, wip);
                    this.transitionIfCurrentTabClosed(index);
                });
            } else {
                this.wipService.closeItem(this.wipType, wip);
                this.transitionIfCurrentTabClosed(index);
            }
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
         * If the current tab has been closed, go to the explorer state, else stay in current state.
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
         * Establishes the currently-selected tab upon the user transitioning state
         * to a contentEditor view, or deselects all tabs if not in that view.
         */
        private stateChangeSuccessHandler(event: Event, toState: any, toParams: any) {
            if (toParams && toParams.uuid) {
                this.selectedIndex = this.indexByUuid(this.wips, toParams.uuid);
            } else {
                this.selectedIndex = -1;
            }
            this.explorer = toState.name === 'projects.explorer';
        }

        /**
         * Since tab contents are relative to a project, we don't want to display the tabs
         * in the "projects list" view. They should only be visible from within the context a
         * selected project.
         *
         * @param event
         * @param toState
         */
        private stateChangeStartHandler(event, toState) {
            this.displayTabs = toState.name !== 'projects.list';
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