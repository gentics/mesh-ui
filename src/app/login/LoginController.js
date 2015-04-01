angular.module('caiLunAdminUi.login')
    .controller('LoginController', LoginController);

function LoginController($state, $mdDialog, authService) {
    var vm = this;

    vm.submitForm = function(event, userName, password) {
        if (authService.logIn(userName, password)) {
            $state.go('projects');
        } else {
            showErrorDialog(event);
        }
    };

    function showErrorDialog(event) {
        var logInErrorDialog = $mdDialog.alert()
            .title('Error')
            .content('Please check your login details and try again.')
            .ariaLabel('Log In Error')
            .ok('Okay')
            .targetEvent(event);

        $mdDialog.show(logInErrorDialog);
    }
}