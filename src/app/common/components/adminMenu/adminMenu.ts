module meshAdminUi {

    /**
     * Admin menu component.
     *
     * @param adminMenuService
     * @returns {{restrict: string, templateUrl: string, controller: adminMenuController, controllerAs: string, scope: {}, replace: boolean}}
     */
    function adminMenuDirective(adminMenuService: AdminMenuService) {

        function adminMenuController() {
            var vm = this;
            vm.menu = adminMenuService;
        }

        return {
            restrict: 'E',
            templateUrl: 'common/components/adminMenu/adminMenu.html',
            controller: adminMenuController,
            controllerAs: 'vm',
            scope: {},
            replace: true
        };
    }

    /**
     * Button which toggles the admin menu open/closed.
     *
     * @param adminMenuService
     * @returns {{restrict: string, controller: adminMenuButtonController, controllerAs: string, template: string, scope: {}}}
     */
    function adminMenuButtonDirective(adminMenuService) {

        function adminMenuButtonController() {
            var vm = this;
            vm.menu = adminMenuService;
        }

        return {
            restrict: 'E',
            controller: adminMenuButtonController,
            controllerAs: 'vm',
            template: '<div class="admin-menu-icon" ng-click="vm.menu.toggle()" ng-class="{ open: vm.menu.isOpen() }"><span></span></div>',
            scope: {}
        };
    }

    /**
     * This service provides communication between the admin menu button and the menu itself. It holds the open/closed
     * state of the menu, and performs related actions when that state changes to facilitate the working of the
     * component.
     */
    class AdminMenuService {

        private _isOpen: boolean;
        private closeMenuHandler = event => this.closeAdminMenu(event);

        constructor(private $rootScope: ng.IRootScopeService,
                    private $document: ng.IDocumentService,
                    private $state: ng.ui.IStateService,
                    private contextService: ContextService) {

            $rootScope.$on('$stateChangeSuccess', () => this.openIfAdminState());
        }

        /**
         * Is the admin menu currently open?
         */
        public isOpen() {
            return this._isOpen;
        }

        /**
         * Toggle the open/closed state of the admin menu. Also registers/de-registers a
         * document-level click handler to cause auto-hide when not in one of the
         * admin states.
         */
        public toggle() {
            this._isOpen = !this._isOpen;


            if (this._isOpen) {
                this.$document.on('click', this.closeMenuHandler);
            } else {
                this.$document.off('click', this.closeMenuHandler);
                if (this.isAdminState()) {
                    var projectName = this.contextService.getProject().name,
                        nodeId = this.contextService.getCurrentNode().uuid;

                    if (projectName) {
                        this.$state.go('projects.node', {projectName: projectName, nodeId: nodeId});
                    } else {
                        this.$state.go('projectsList');
                    }
                }
            }
        }

        /**
         * Handler to provide auto-hide when clicking off the menu when not in an admin state.
         * @param event
         */
        public closeAdminMenu(event) {
            var target = event.target,
                appViewport:any = document.querySelector('.app-viewport');

            if (!this.isAdminState() && (target === appViewport || appViewport.contains(target))) {
                this.$rootScope.$apply(() => this.toggle());
            }
        }

        public openIfAdminState() {
            this._isOpen = this.isAdminState();
        }

        /**
         * Returns true is the current router state is one of the "admin" states as defined in
         * the admin.config.js state definitions.
         *
         * @returns {boolean}
         */
        public isAdminState() {
            return !!(this.$state.current.data && this.$state.current.data.isAdminState === true);
        }
    }


    angular.module('meshAdminUi.common')
        .directive('adminMenu', adminMenuDirective)
        .directive('adminMenuButton', adminMenuButtonDirective)
        .service('adminMenuService', AdminMenuService);

}