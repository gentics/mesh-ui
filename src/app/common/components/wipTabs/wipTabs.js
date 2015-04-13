angular.module('caiLunAdminUi.common')
    .directive('wipTabs', wipTabs);

/**
 * Directive work-in-progress (WIP) tabs which allow switching between open editor views.
 *
 * @param $state
 * @param wipService
 * @returns {{}} Directive Definition Object
 */
function wipTabs($state, wipService) {

    function wipTabsController($scope) {
        var vm = this,
            lastIndex = 0;

        vm.wips = [];
        vm.selectedIndex = 0;

        /**
         * Close a WIP tab and remove the WIP item from the wipService, automatically switching to another
         * tab or the list view.
         *
         * @param {number} index
         */
        vm.closeWip = function(index) {
            var wip = vm.wips[index],
                newWip;
            wipService.closeContent(wip);

            if (0 < vm.wips.length) {
                vm.selectedIndex = lastIndex < vm.wips.length ? lastIndex : vm.wips.length - 1;
                newWip = vm.wips[vm.selectedIndex];
            }

            if (newWip) {
                $state.go('projects.explorer.content', { uuid: newWip.uuid });
            } else {
                $state.go('projects.explorer');
            }
        };

        wipService.registerWipChangeHandler(function() {
            var updatedWips = wipService.getOpenContents();
            console.log('number of wips: ' + updatedWips.length);

            vm.wips = updatedWips;
            vm.selectedIndex = indexByUuid(vm.wips, $state.params.uuid);
            if (-1 < vm.selectedIndex) {
                lastIndex = vm.selectedIndex;
            }

        });

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            if (toParams && toParams.uuid) {
                vm.selectedIndex = indexByUuid(vm.wips, toParams.uuid);
            } else {
                vm.selectedIndex = -1;
            }
        });

        /**
         * Get the index of a given WIP item in the collection by its uuid.
         * @param {Array} collection
         * @param {String} uuid
         * @returns {number}
         */
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
        controllerAs: 'vm',
        scope: {}
    };
}
