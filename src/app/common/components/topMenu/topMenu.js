angular.module('caiLunAdminUi.common')
    .directive('topMenu', topMenuDirective);

function topMenuDirective(authService, i18nService) {

    var isLoggedIn = authService.isLoggedIn;

    function topMenuLinkFn(scope) {
        scope.isLoggedIn = isLoggedIn;
        scope.languages = i18nService.languages;
        scope.lang = i18nService.getLanguage();

        // TODO: get this data from the backend, not hard-coded
        scope.userName = 'John Smith';
        scope.profileImage = 'assets/images/example-profile-pic.jpg';

        scope.logout = function() {
            authService.logOut();
        };

        scope.updateLanguage = function(lang) {
            i18nService.setLanguage(lang);
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