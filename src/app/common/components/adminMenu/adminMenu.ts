angular.module('meshAdminUi.common')
    .directive('adminMenu', adminMenuDirective)
    .directive('adminMenuButton', adminMenuButtonDirective)
    .factory('adminMenuService', adminMenuService);

/**
 * Admin menu component.
 *
 * @param adminMenuService
 * @returns {{restrict: string, templateUrl: string, controller: adminMenuController, controllerAs: string, scope: {}, replace: boolean}}
 */
function adminMenuDirective(adminMenuService) {

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
 *
 * @param {ng.IRootScopeService} $rootScope
 * @param {ng.IDocumentService} $document
 * @param {ng.ui.IStateService} $state
 * @param contextService
 * @returns {{isOpen: isOpen, toggle: toggle}}
 */
function adminMenuService($rootScope, $document, $state, contextService) {
    var _isOpen = false;
    $rootScope.$on('$stateChangeSuccess', openIfAdminState);

    return {
        isOpen: isOpen,
        toggle: toggle
    };

    /**
     * Is the admin menu currently open?
     *
     * @returns {boolean}
     */
    function isOpen() {
        return _isOpen;
    }

    /**
     * Toggle the open/closed state of the admin menu. Also registers/de-registers a
     * document-level click handler to cause auto-hide when not in one of the
     * admin states.
     */
    function toggle() {
        _isOpen = !_isOpen;

        if (_isOpen) {
            $document.on('click', closeAdminMenu);
        } else {
            $document.off('click', closeAdminMenu);
            if (isAdminState()) {
                var projectName = contextService.getProject().name,
                    nodeId = contextService.getCurrentNode().id;

                if (projectName) {
                    $state.go('projects.explorer', {projectName: projectName, nodeId: nodeId});
                } else {
                    $state.go('projects.list');
                }
            }
        }
    }

    /**
     * Handler to provide auto-hide when clicking off the menu when not in an admin state.
     * @param event
     */
    function closeAdminMenu(event) {
        var target = event.target,
            appViewport: any = document.querySelector('.app-viewport');

        if (!isAdminState() && (target === appViewport || appViewport.contains(target))) {
            $rootScope.$apply(function() {
                toggle();
            });
        }
    }

    function openIfAdminState() {
        _isOpen = isAdminState();
    }

    /**
     * Returns true is the current router state is one of the "admin" states as defined in
     * the admin.config.js state definitions.
     *
     * @returns {boolean}
     */
    function isAdminState() {
        return !!($state.current.data && $state.current.data.isAdminState === true);
    }
}