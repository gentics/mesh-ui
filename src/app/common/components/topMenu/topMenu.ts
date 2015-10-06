angular.module('meshAdminUi.common')
    .directive('topMenu', topMenuDirective);

/**
 * Directive for the top menu bar which is present on every screen apart from the login.
 *
 * @param $state
 * @param authService
 * @param i18nService
 * @returns {ng.IDirective} Directive definition object
 */
function topMenuDirective($state, authService, i18nService) {

    /**
     * Whether or not the current user is logged in.
     * @type {boolean}
     */
    var isLoggedIn = authService.isLoggedIn();

    function topMenuController() {
        var vm = this;
        
        vm.isLoggedIn = isLoggedIn;
        vm.languages = i18nService.languages;
        vm.lang = i18nService.getCurrentLang();

        // TODO: get this data from the backend, not hard-coded
        vm.userName = 'John Smith';
        vm.profileImage = 'assets/images/example-profile-pic.jpg';

        vm.logout = function() {
            authService.logOut();
        };

        vm.updateLanguage = function(lang) {
            i18nService.setCurrentLang(lang);
            vm.lang = i18nService.getCurrentLang();
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