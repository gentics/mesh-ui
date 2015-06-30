angular.module('meshAdminUi.admin')
.directive('permissionsTable', permissionsTableDirective);


function permissionsTableDirective($timeout) {

    function permissionsTableController($scope) {
        var vm = this;

        vm.displayItemName = displayItemName;


        var cancelItemsWatcher = $scope.$watch('vm.items', function(newVal) {
            if (newVal) {
                permissionsToProperties();
                cancelItemsWatcher();
            }
        });

        /**
         * Expand the permissions array into a series of key: value pairs so
         * they can be easily bound to the view via ng-model.
         */
        function permissionsToProperties() {
            vm.items.forEach(function(item) {
                item.create = item.perms.indexOf('create') > -1;
                item.read = item.perms.indexOf('read') > -1;
                item.update = item.perms.indexOf('update') > -1;
                item['delete'] = item.perms.indexOf('delete') > -1;
            });
        }

        function displayItemName(item) {
            var name = $scope.$eval(vm.itemNameField, { item: item });
            return name;
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