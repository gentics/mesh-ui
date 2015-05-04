angular.module('caiLunAdminUi.common')
    .directive('wipTabs', wipTabs)
    .controller('wipTabsDialogController', WipTabsDialogController);

/**
 * Directive work-in-progress (WIP) tabs which allow switching between open editor views.
 *
 * @param {ng.ui.IStateService} $state
 * @param {ng.material.MDDialogService} $mdDialog
 * @param i18nService
 * @param wipService
 * @param dataService
 * @param notifyService
 *
 * @returns {ng.IDirective} Directive definition object
 */
function wipTabs($state, $mdDialog, i18nService, wipService, dataService, notifyService) {

    /**
     * @param {ng.IScope} $scope
     */
    function wipTabsController($scope) {
        var vm = this,
            wipType = 'contents',
            lastIndex = 0;
        vm.wips = [];
        vm.modified = [];
        vm.selectedIndex = 0;
        vm.isModified = isModified;
        vm.closeWip = closeWip;
        vm.lang = i18nService.getCurrentLang().code;

        wipService.registerWipChangeHandler(wipChangeHandler);
        $scope.$on('$stateChangeSuccess', stateChangeHandler);

        wipChangeHandler(); // populate with WIPs on load.

        /**
         * Has the WIP with the specified uuid been modified?
         * @param {string} uuid
         * @returns {boolean}
         */
        function isModified(uuid) {
            return -1 < vm.modified.indexOf(uuid);
        }

        /**
         * Close a WIP tab and remove the WIP item from the wipService,
         * automatically switching to another tab or the list view.
         *
         * @param {Event} event
         * @param {number} index
         */
        function closeWip(event, index) {
            var wip = vm.wips[index].item,
                projectName = vm.wips[index].metadata.projectName;

            event.stopPropagation();

            if (wipService.isModified(wipType, wip)) {
                showDialog().then(function(response) {
                    if (response === 'save') {
                        dataService.persistContent(projectName, wip);
                        notifyService.toast('SAVED_CHANGES');
                    }
                    wipService.closeItem(wipType, wip);
                    goToNextTab();
                });
            } else {
                wipService.closeItem(wipType, wip);
                goToNextTab();
            }
        }

        /**
         * Display the close confirmation dialog box. Returns a promise which is resolved
         * to 'save', 'discard', or rejected if user cancels.
         * @return {ng.IPromise<String>}
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
         * TODO: fix the logic so that it acts more like a "back" button, but without opening closed tabs
         */
        function goToNextTab() {
            var newWip;

            if (0 < vm.wips.length) {
                vm.selectedIndex = lastIndex < vm.wips.length ? lastIndex : vm.wips.length - 1;
                newWip = vm.wips[vm.selectedIndex].item;
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
            vm.wips = wipService.getOpenItems(wipType);
            vm.modified = wipService.getModifiedItems(wipType);
            vm.selectedIndex = indexByUuid(vm.wips, $state.params.uuid);
            if (-1 < vm.selectedIndex) {
                lastIndex = vm.selectedIndex;
            }
        }

        /**
         * Establishes the currently-selected tab upon the user transitioning state
         * to a contentEditor view, or deselects all tabs if not in that view.
         *
         * @param {Object} event
         * @param {Object} toState
         * @param {Object} toParams
         */
        function stateChangeHandler(event, toState, toParams) {
            if (toParams && toParams.uuid) {
                vm.selectedIndex = indexByUuid(vm.wips, toParams.uuid);
            } else {
                vm.selectedIndex = -1;
            }
            vm.explorer = toState.name === 'projects.explorer';
        }

        /**
         * Get the index of a given WIP item in the collection by its uuid.
         * @param {Array} collection
         * @param {String} uuid
         * @returns {number}
         */
        function indexByUuid(collection, uuid) {
            return collection.map(function(wip) {
                return wip.item.uuid;
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
 * @param {ng.material.MDDialogService} $mdDialog
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
