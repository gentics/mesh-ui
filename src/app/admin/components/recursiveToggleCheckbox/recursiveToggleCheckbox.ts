module meshAdminUi {

    function recursiveToggleCheckboxDirective() {

        function recursiveToggleCheckboxController() {
            var vm = this;

            vm.recursiveClick = recursiveClick;
            vm.changed = changed;

            function recursiveClick() {
                vm.model = !vm.model;
                vm.onRecursiveClick();
            }

            function changed($event) {
                vm.onChange({ $event: $event });
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
                onChange: '&',
                ngDisabled: '=',
                onRecursiveClick: '&'
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('recursiveToggleCheckbox', recursiveToggleCheckboxDirective);
}