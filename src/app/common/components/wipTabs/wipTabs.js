angular.module('caiLunAdminUi.common')
    .directive('wipTabs', wipTabs);

/**
 * Directive for the top menu bar which is present on every screen apart from the login.
 *
 * @param $state
 * @param wipService
 * @returns {{}} Directive Definition Object
 */
function wipTabs($state, wipService) {

    function wipTabsController($scope) {
        var vm = this;
        vm.wips = [];
        vm.selectedIndex = 0;

        wipService.registerWipChangeHandler(function() {
            var updatedWips = wipService.getOpenContents();
            for (var i = updatedWips.length - vm.wips.length; 0 < i; i--) {
                var curr = updatedWips[updatedWips.length - i];
                vm.wips.push(curr);
                vm.selectedIndex = indexByUuid(vm.wips, curr.uuid);
            }
        });

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            if (toParams && toParams.uuid) {
                vm.selectedIndex = indexByUuid(vm.wips, toParams.uuid);
            } else {
                vm.selectedIndex = -1;
            }
        });

        function indexByUuid(collection, uuid) {
            return collection.map(function(wip) {
                return wip.uuid;
            }).indexOf(uuid);
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/wipTabs/wipTabs.html',
        controller: wipTabsController,
        controllerAs: 'vm'
    };
}
