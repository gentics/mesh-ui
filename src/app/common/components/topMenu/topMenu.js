angular.module('caiLunAdminUi.common')
    .directive('topMenu', topMenuDirective);

function topMenuDirective(authService) {

    var isLoggedIn = authService.isLoggedIn;

    function topMenuLinkFn(scope) {
        scope.isLoggedIn = isLoggedIn;

        // TODO: get this data from the backend, not hard-coded
        scope.userName = 'John Smith';
        scope.profileImage = 'assets/images/example-profile-pic.jpg';

        scope.logout = function() {
            authService.logOut();
        };

        authService.registerLogInHandler(function() {
            scope.isLoggedIn = true;
        });

        authService.registerLogOutHandler(function() {
            scope.isLoggedIn = false;
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/topMenu/topMenu.html',
        link: topMenuLinkFn
    };
}