angular.module('caiLunAdminUi.common')
    .directive('adminMenu', adminMenuDirective)
    .directive('adminMenuButton', adminMenuButtonDirective)
    .factory('adminMenuService', adminMenuService);


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

function adminMenuButtonDirective(adminMenuService) {

    function adminMenuButtonController() {
        var vm = this;
        vm.menu = adminMenuService;
    }

    return {
        restrict: 'E',
        controller: adminMenuButtonController,
        controllerAs: 'vm',
        template: '<i class="icon-menu admin-menu-icon" ng-click="vm.menu.toggle()" ng-class="{ open: vm.menu.isOpen() }"></i>',
        scope: {}
    };
}

function adminMenuService($rootScope, $document) {
    var _isOpen = false;

    return {
        isOpen: isOpen,
        toggle: toggle
    };

    function isOpen() {
        return _isOpen;
    }

    function toggle() {
        _isOpen = !_isOpen;
        if (_isOpen) {
            $document.on('click', closeAdminMenu);
        }
    }

    function closeAdminMenu(event) {
        var target = event.target,
            appViewport = document.querySelector('.app-viewport');

        if (target === appViewport || appViewport.contains(target)) {
            $rootScope.$apply(function() {
                _isOpen = false;
            });
        }
    }
}