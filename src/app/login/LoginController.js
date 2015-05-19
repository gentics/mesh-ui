angular.module('meshAdminUi.login')
    .controller('LoginController', LoginController);

/**
 * @param $timeout
 * @param $state
 * @param $mdDialog
 * @param authService
 * @constructor
 */
function LoginController($timeout, $state, $mdDialog, authService) {
    var vm = this;

    vm.success = false;
    vm.logoVisible = false;

    $timeout(function() { vm.logoVisible = true; }, 1500);

    vm.submitForm = submitForm;

    /**
     *
     * @param {Event} event
     * @param {string} userName
     * @param {string} password
     */
    function submitForm(event, userName, password) {
        if (authService.logIn(userName, password)) {
            vm.success = true;
            $timeout(function() {
                $state.go('projects.list');
            }, 2000);
        } else {
            showErrorDialog(event);
        }
    }

    /**
     * Displays an error message on login failure.
     */
    function showErrorDialog() {
        return $mdDialog.show({
            templateUrl: 'login/loginErrorDialog.html',
            controller: function($mdDialog) {
                this.cancel = function() { $mdDialog.cancel(); };
            },
            controllerAs: 'vm'
        });
    }
}