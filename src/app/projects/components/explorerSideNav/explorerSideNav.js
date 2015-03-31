function explorerSideNavDirective() {

    function explorerSideNavLinkFn(scope) {
        scope.isOpen = false;
        scope.toggleOpen = function() {
            scope.isOpen = !scope.isOpen;
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/explorerSideNav/explorerSideNav.html',
        link: explorerSideNavLinkFn
    };
}

angular.module('caiLunAdminUi')
    .directive('explorerSideNav', explorerSideNavDirective);