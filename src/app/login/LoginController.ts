module meshAdminUi {

    class LoginController {

        private success: boolean = false;
        private loggingIn: boolean = false;

        constructor( private $timeout: ng.ITimeoutService,
                     private $state: ng.ui.IStateService,
                     private $mdDialog: ng.material.IDialogService,
                     private authService: AuthService) {
        }

        public submitForm(event: Event, userName: string, password: string) {
            this.loggingIn = true;
            // The user may already be "logged in" as a public user from viewing the front-end
            // (if that is on the same domain as the admin app), so we must explicitly log out
            // to ensure the user is not then logged in as the public uer.
            this.authService.logOut()
                .catch(err => {})
                .then(() => this.authService.logIn(userName, password))
                .then(() => {
                    this.success = true;
                    this.$timeout(() => this.$state.go('projectsList'), 1500);
                })
                .catch(() => {
                    this.showErrorDialog();
                    this.loggingIn = false;
                });
        }

        /**
         * Displays an error message on login failure.
         */
        private showErrorDialog() {
            return this.$mdDialog.show({
                templateUrl: 'login/loginErrorDialog.html',
                controller: 'LoginDialogController',
                controllerAs: 'vm'
            });
        }
    }

    class LoginDialogController {

        constructor(private $mdDialog: ng.material.IDialogService) {}

        cancel() {
            this.$mdDialog.cancel();
        }
    }

    angular.module('meshAdminUi.login')
        .controller('LoginDialogController', LoginDialogController)
        .controller('LoginController', LoginController);

}