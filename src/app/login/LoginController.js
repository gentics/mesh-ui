angular.module('caiLunAdminUi.login')
    .controller('LoginController', LoginController);

/**
 * @param $state
 * @param $mdDialog
 * @param i18n
 * @param authService
 * @constructor
 */
function LoginController($state, $mdDialog, i18n, authService) {
    var vm = this;

    vm.submitForm = function(event, userName, password) {
        if (authService.logIn(userName, password)) {
            $state.go('projects.list');
        } else {
            showErrorDialog(event);
        }
    };

    /**
     * Displays an error message on login failure.
     * @param event
     */
    function showErrorDialog(event) {
        var logInErrorDialog = $mdDialog.alert()
            .title(i18n('ERROR'))
            .content(i18n('ERR_CHECK_LOGIN_DETAILS'))
            .ariaLabel(i18n('ERR_CHECK_LOGIN_DETAILS'))
            .ok('Okay')
            .targetEvent(event);

        $mdDialog.show(logInErrorDialog);
    }
}