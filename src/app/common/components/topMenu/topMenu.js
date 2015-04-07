angular.module('caiLunAdminUi.common')
    .directive('topMenu', topMenuDirective);

/**
 * Directive for the top menu bar which is present on every screen apart from the login.
 *
 * @param $state
 * @param authService
 * @param i18nService
 * @returns {{}} Directive Definition Object
 */
function topMenuDirective($state, authService, i18nService) {

    var isLoggedIn = authService.isLoggedIn;

    function topMenuController() {
        var vm = this;
        
        vm.isLoggedIn = isLoggedIn;
        vm.languages = i18nService.languages;
        vm.lang = i18nService.getLanguage();

        // TODO: get this data from the backend, not hard-coded
        vm.userName = 'John Smith';
        vm.profileImage = 'assets/images/example-profile-pic.jpg';

        vm.logout = function() {
            authService.logOut();
        };

        vm.updateLanguage = function(lang) {
            i18nService.setLanguage(lang);
            $state.reload();
        };

        authService.registerLogInHandler(function() {
            vm.isLoggedIn = true;
        });

        authService.registerLogOutHandler(function() {
            vm.isLoggedIn = false;
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/topMenu/topMenu.html',
        controller: topMenuController,
        controllerAs: 'vm'
    };
}