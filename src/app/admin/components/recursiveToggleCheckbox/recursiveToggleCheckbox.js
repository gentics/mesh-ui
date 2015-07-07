angular.module('meshAdminUi.admin')
.directive('recursiveToggleCheckbox', recursiveToggleCheckboxDirective);

/**
 *
 * @returns {{restrict: string, templateUrl: string, controller: permissionsTableController, controllerAs: string, bindToController: boolean, scope: {rootName: string, rootUuid: string, items: string, itemNameField: string}}}
 */
function recursiveToggleCheckboxDirective() {

    function recursiveToggleCheckboxController() {
        var vm = this;

        vm.recursiveClick = recursiveClick;

        function recursiveClick() {
            vm.model = !vm.model;
            vm.onRecursiveClick();
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'admin/components/recursiveToggleCheckbox/recursiveToggleCheckbox.html',
        controller: recursiveToggleCheckboxController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            model: '=',
            label: '@',
            onRecursiveClick: '&'
        }
    };
}