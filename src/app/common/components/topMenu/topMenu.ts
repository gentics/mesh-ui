module meshAdminUi {


    class TopMenuController {

        private isLoggedIn: boolean;
        private languages: ILanguageInfo[];
        private lang: ILanguageInfo;
        private profileImage: string;

        constructor(private $state: ng.ui.IStateService,
                    private authService: AuthService,
                    private i18nService: I18nService) {

            this.isLoggedIn = authService.isLoggedIn();
            this.languages = i18nService.languages;
            this.lang = i18nService.getCurrentLang();
            this.profileImage = 'assets/images/example-profile-pic.jpg';

            authService.registerLogInHandler(() => {
                this.isLoggedIn = true;
            });

            authService.registerLogOutHandler(() => {
                this.isLoggedIn = false;
            });
        }

        public getUserName() {
            let currentUser = this.authService.getCurrentUser();
            if (!currentUser) {
                return;
            }
            if (currentUser.firstname && currentUser.lastname) {
                return currentUser.firstname + ' ' + currentUser.lastname;
            } else {
                return currentUser.username;
            }
        }

        public logout() {
            this.authService.logOut();
        }

        public updateLanguage(lang) {
            this.i18nService.setCurrentLang(lang);
            this.lang = this.i18nService.getCurrentLang();
            this.$state.reload();
        };
    }

    /**
     * Directive for the top menu bar which is present on every screen apart from the login.
     */
    function topMenuDirective() {
        return {
            restrict: 'E',
            templateUrl: 'common/components/topMenu/topMenu.html',
            controller: 'TopMenuController',
            controllerAs: 'vm'
        };
    }

    angular.module('meshAdminUi.common')
           .directive('topMenu', topMenuDirective)
           .controller('TopMenuController', TopMenuController);

}