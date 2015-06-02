angular.module('meshAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

/**
 * @param {ng.IScope} $scope
 * @param {ng.IQService} $q
 * @param {ng.ILocationService} $location
 * @param {ConfirmActionDialog} confirmActionDialog
 * @param dataService
 * @param contextService
 * @param wipService
 * @param i18nService
 * @param notifyService
 * @param {Object} parentNode injected from the router resolve function
 * @constructor
 */
function ProjectExplorerController($scope, $q, $location, confirmActionDialog, dataService, contextService, wipService, i18nService, notifyService, parentNode) {
    var vm = this,
        projectName = contextService.getProject().name;

    vm.totalItems = 0;
    vm.itemsPerPage = $location.search().per_page || 10;
    vm.currentPage = $location.search().page || 1;
    vm.createPermission = -1 < parentNode.perms.indexOf('create');
    vm.updateContents = updateContents;
    vm.selectedItems = [];
    vm.openSelected = openSelected;
    vm.deleteSelected = deleteSelected;

    $scope.$watch(function() {
        return $location.search().page;
    }, function(newVal) {
        updateContents(newVal, vm.itemsPerPage);
        populateChildNodes(newVal);
    });

    populateSchemas();

    /**
     * Update the URL query params and vm values for
     * current page and items per page. New content will be
     * requested from the server via the watcher.
     */
    function updateContents(currentPage, itemsPerPage) {
        vm.currentPage = currentPage;
        vm.itemsPerPage = itemsPerPage;
        $location.search('page' , currentPage);
        $location.search('per_page' , itemsPerPage);
    }

    /**
     * Fill the vm with the child contents of the current tag.
     * @param {number} page
     */
    function populateChildNodes(page) {
        var projectName = contextService.getProject().name,
            parentNodeId = parentNode.uuid,
            queryParams = {
                page: page,
                per_page: vm.itemsPerPage
            };

        dataService.getChildFolders(projectName, parentNodeId, queryParams)
            .then(function (data) {
                vm.folders = data;
                return dataService.getChildContents(projectName, parentNodeId, queryParams);
            })
            .then(function(data) {
                vm.contents = data;
                vm.totalItems = data.metadata.total_count;
            });
    }


    /**
     * Fill the vm with all available schemas.
     */
    function populateSchemas() {
        dataService.getSchemas()
            .then(function(schemas) {
                vm.schemas = schemas;
            });
    }

    /**
     * Open the selected content items for editing (i.e. add them to the wipService open items)
     */
    function openSelected() {
        var selectedLangs = {};
        selectedLangs[i18nService.getCurrentLang().code] = true;

        vm.selectedItems.forEach(function(index) {
            var uuid = vm.contents[index].uuid;

            if (!wipService.getItem('contents', uuid)) {
                dataService.getContent(projectName, uuid)
                    .then(function (item) {
                        wipService.openItem('contents', item, {
                            projectName: projectName,
                            parentTagId: parentNode.uuid,
                            selectedLangs: selectedLangs
                        });
                    });
            }
        });

        vm.selectedItems = [];
    }

    /**
     * Delete the selected content items
     */
    function deleteSelected() {
        var deletedCount = vm.selectedItems.length;

        showDeleteDialog().then(doDelete);

        function doDelete() {
            $q.when(deleteNext())
                .then(function () {
                    notifyService.toast('Deleted ' + deletedCount + ' contents');
                    populateChildNodes(vm.currentPage);
                });
        }
    }

    /**
     * Display a confirmation dialog for the group delete action.
     * @returns {angular.IPromise<any>|any|void}
     */
    function showDeleteDialog() {
        return confirmActionDialog.show({
            title: 'Delete Content?',
            message: 'Are you sure you want to delete the selected contents?'
        });
    }

    /**
     * Recursively deletes the selected content items as specified by the indices in the
     * vm.selectedItems array. Done recursively in order to allow each DELETE request to
     * complete before sending the next. When done in parallel, deleting more than a few
     * items at once causes server error.
     *
     * @returns {ng.IPromise<undefined>}
     */
    function deleteNext() {
        if (vm.selectedItems.length === 0) {
            return;
        } else {
            var index = vm.selectedItems.pop(),
                uuid = vm.contents[index].uuid;

            return dataService.getContent(projectName, uuid)
                .then(function (item) {
                    return dataService.deleteContent(item);
                })
                .then(function () {
                    if (wipService.getItem('contents', uuid)) {
                        wipService.closeItem('contents', {uuid: uuid});
                    }
                    return deleteNext();
                });
        }
    }
}