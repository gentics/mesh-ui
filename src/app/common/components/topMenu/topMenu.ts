module meshAdminUi {


    class TopMenuController {

        private isLoggedIn: boolean;
        private languages: ILanguageInfo[];
        private lang: ILanguageInfo;
        private profileImage: string;

        constructor(private $state: ng.ui.IStateService,
                    private editorService: EditorService,
                    private dispatcher: Dispatcher,
                    private authService: AuthService,
                    private i18nService: I18nService) {

            this.isLoggedIn = authService.isLoggedIn();
            this.languages = i18nService.languages;
            this.lang = i18nService.getCurrentLang();
            this.profileImage = 'assets/images/example-profile-pic.jpg';

            dispatcher.subscribe(dispatcher.events.loginSuccess, () => {
                this.isLoggedIn = true;
            });

            dispatcher.subscribe(dispatcher.events.logoutSuccess, () => {
                this.isLoggedIn = false;
            });

            dispatcher.subscribe(dispatcher.events.languageChanged, (event, lang: ILanguageInfo) => {
                this.lang = lang;
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

        public getInitials() {
            let currentUser = this.authService.getCurrentUser();
            if (!currentUser) {
                return;
            }
            if (currentUser.firstname && currentUser.lastname) {
                return currentUser.firstname[0] + currentUser.lastname[0];
            } else {
                return currentUser.username.substr(0, 2);
            }
        }

        public logout() {
            this.authService.logOut();
        }

        public updateLanguage(event: Event, lang) {
            event.preventDefault();
            if (lang !== this.i18nService.getCurrentLang().code) {
                this.i18nService.setCurrentLang(lang);
                this.editorService.closeAll();
                this.$state.reload();
            }
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