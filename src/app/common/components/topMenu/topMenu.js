function topMenuDirective(authService) {

    var isLoggedIn = authService.isLoggedIn;

    function topMenuLinkFn(scope) {
        scope.isLoggedIn = isLoggedIn;

        // TODO: get this data from the backend, not hard-coded
        scope.userName = 'John Smith';
        scope.profileImage = 'assets/images/example-profile-pic.jpg';

        authService.onLogIn(function() {
            scope.isLoggedIn = true;
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/topMenu/topMenu.html',
        link: topMenuLinkFn
    };
}

angular.module('caiLunAdminUi')
    .directive('topMenu', topMenuDirective);