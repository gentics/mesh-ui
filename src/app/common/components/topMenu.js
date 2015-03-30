function topMenuDirective(authService) {

    var isLoggedIn = authService.isLoggedIn;

    function topMenuLinkFn(scope) {
        scope.isLoggedIn = isLoggedIn;

        authService.onLogIn(function() {
            scope.isLoggedIn = true;
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/topMenu.html',
        link: topMenuLinkFn
    };
}

angular.module('caiLunAdminUi')
    .directive('topMenu', topMenuDirective);