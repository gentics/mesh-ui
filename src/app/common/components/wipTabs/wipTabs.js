angular.module('caiLunAdminUi.common')
    .directive('wipTabs', wipTabs)
    .controller('wipTabsDialogController', WipTabsDialogController);

/**
 * Directive work-in-progress (WIP) tabs which allow switching between open editor views.
 *
 * @param $state
 * @param $mdDialog
 * @param i18nService
 * @param wipService
 * @param dataService
 * @param notifyService
 *
 * @returns {{}} Directive Definition Object
 */
function wipTabs($state, $mdDialog, i18nService, wipService, dataService, notifyService) {

    function wipTabsController($scope) {
        var vm = this,
            lastIndex = 0;

        vm.wips = [];
        vm.modified = [];
        vm.selectedIndex = 0;
        vm.isModified = isModified;
        vm.closeWip = closeWip;
        vm.lang = i18nService.getLanguage();

        wipService.registerWipChangeHandler(wipChangeHandler);
        $scope.$on('$stateChangeSuccess', stateChangeHandler);

        function isModified(uuid) {
            return -1 < vm.modified.indexOf(uuid);
        }

        /**
         * Close a WIP tab and remove the WIP item from the wipService, automatically switching to another
         * tab or the list view.
         *
         * @param event
         * @param {number} index
         */
        function closeWip(event, index) {
            var wip = vm.wips[index];

            event.stopPropagation();

            if (wipService.isModified('contents', wip)) {
                showDialog().then(function(response) {
                    if (response === 'save') {
                        dataService.persistContent(wip);
                        notifyService.toast('SAVED_CHANGES');
                    }
                    wipService.closeItem('contents', wip);
                    goToNextTab();
                });
            } else {
                wipService.closeItem('contents', wip);
                goToNextTab();
            }
        }

        /**
         * Display the close confirmation dialog box. Returns a promise which is resolved
         * to 'save', 'discard', or rejected if user cancels.
         * @return {Promise<String>}
         */
        function showDialog() {
            return $mdDialog.show({
                templateUrl: 'common/components/wipTabs/wipTabsCloseDialog.html',
                controller: 'wipTabsDialogController',
                controllerAs: 'vm'
            });
        }

        /**
         * Go to either the next closest tab, or back to the explorer view if all tabs are closed.
         */
        function goToNextTab() {
            var newWip;

            if (0 < vm.wips.length) {
                vm.selectedIndex = lastIndex < vm.wips.length ? lastIndex : vm.wips.length - 1;
                newWip = vm.wips[vm.selectedIndex];
            }

            if (newWip) {
                $state.go('projects.explorer.content', { uuid: newWip.uuid });
            } else {
                $state.go('projects.explorer');
            }
        }

        /**
         * Callback to be invoked whenever the contents of the wipService changes
         * i.e. an item is added or removed. Keeps the UI in sync with the
         * wip store.
         */
        function wipChangeHandler() {
            vm.wips = wipService.getOpenItems('contents');
            vm.modified = wipService.getModifiedItems('contents');
            vm.selectedIndex = indexByUuid(vm.wips, $state.params.uuid);
            if (-1 < vm.selectedIndex) {
                lastIndex = vm.selectedIndex;
            }
        }

        /**
         * Establishes the currently-selected tab upon the user transitioning state
         * to a contentEditor view, or deselects all tabs if not in that view.
         *
         * @param event
         * @param toState
         * @param toParams
         */
        function stateChangeHandler(event, toState, toParams) {
            if (toParams && toParams.uuid) {
                vm.selectedIndex = indexByUuid(vm.wips, toParams.uuid);
            } else {
                vm.selectedIndex = -1;
            }
        }

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

/**
 * Controller used to set the return value of the close dialog box.
 *
 * @param $mdDialog
 * @constructor
 */
function WipTabsDialogController($mdDialog) {
    var vm = this;

    vm.save = function() {
        $mdDialog.hide('save');
    };
    vm.discard = function() {
        $mdDialog.hide('discard');
    };
    vm.cancel = function() {
        $mdDialog.cancel();
    };
}
