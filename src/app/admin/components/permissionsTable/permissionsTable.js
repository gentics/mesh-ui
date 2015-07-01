angular.module('meshAdminUi.admin')
.directive('permissionsTable', permissionsTableDirective);


function permissionsTableDirective(mu) {

    function permissionsTableController($scope) {
        var vm = this;

        vm.displayItemName = displayItemName;

        /**
         * The `item` array will be populated async when the data arrives from the server call, so we
         * need to watch it and once it is populated, process the array and cancel the watcher.
         * @type {Function}
         */
        var cancelItemsWatcher = $scope.$watch('vm.items', function(newVal) {
            if (newVal) {
                vm.items = newVal.map(mu.permissionsArrayToKeys);
                cancelItemsWatcher();
            }
        });

        /**
         * Evaluate the expression provided in the `itemNameField` field against the provided
         * `item` object and return the result.
         *
         * @param {Object} item
         * @returns {any}
         */
        function displayItemName(item) {
            return $scope.$eval(vm.itemNameField, {item: item});
        }

    }

    return {
        restrict: 'E',
        templateUrl: 'admin/components/permissionsTable/permissionsTable.html',
        controller: permissionsTableController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            rootName: '@',
            rootUuid: '=',
            items: '=',
            itemNameField: '@'
        }
    };
}