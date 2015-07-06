angular.module('meshAdminUi.admin')
.directive('permissionsTable', permissionsTableDirective);

/**
 *
 * @param mu
 * @returns {{restrict: string, templateUrl: string, controller: permissionsTableController, controllerAs: string, bindToController: boolean, scope: {rootName: string, rootUuid: string, items: string, itemNameField: string}}}
 */
function permissionsTableDirective(mu) {

    function permissionsTableController($scope) {
        var vm = this;

        vm.displayItemName = displayItemName;
        vm.filter = '';
        vm.itemNameFilter = itemNameFilter;

        /**
         * The `item` array will be populated async when the data arrives from the server call, so we
         * need to watch it and once it is populated, process the array and cancel the watcher.
         * @type {Function}
         */
        var cancelItemsWatcher = $scope.$watch('vm.items', function(newVal) {
            if (newVal) {
                vm.items = newVal.map(mu.rolePermissionsArrayToKeys);
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

        /**
         * Filter by item name.
         * @param {Object} item
         * @returns {boolean}
         */
        function itemNameFilter(item) {
            var name;

            if (vm.filter !== '') {
                name = displayItemName(item);
                return name.toLowerCase().indexOf(vm.filter.toLowerCase()) > -1;
            } else {
                return true;
            }
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