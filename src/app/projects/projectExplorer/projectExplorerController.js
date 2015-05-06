angular.module('caiLunAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

/**
 * @param {ng.IScope} $scope
 * @param {ng.ILocationService} $location
 * @param dataService
 * @param contextService
 * @param wipService
 * @param i18nService
 * @param {Object} parentTag injected from the router resolve function
 * @constructor
 */
function ProjectExplorerController($scope, $location, dataService, contextService, wipService, i18nService, parentTag) {
    var vm = this;

    vm.totalItems = 0;
    vm.itemsPerPage = $location.search().per_page || 10;
    vm.currentPage = $location.search().page || 1;
    vm.createPermission = -1 < parentTag.perms.indexOf('create');
    vm.updateContents = updateContents;
    vm.selectedItems = [];
    vm.openSelected = openSelected;

    $scope.$watch(function() {
        return $location.search().page;
    }, function(newVal) {
        updateContents(newVal, vm.itemsPerPage);
        populateContent(newVal);
    });

    populateTags();
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
    function populateContent(page) {
        var projectName = contextService.getProject().name,
            tagId = contextService.getTag().id,
            queryParams = {
                page: page,
                per_page: vm.itemsPerPage
            };

        dataService.getContents(projectName, tagId, queryParams)
            .then(function (data) {
                vm.contents = data;
                vm.totalItems = data.metadata.total_count;
            });
    }

    /**
     * Fill the vm with the child tags of the current tag.
     */
    function populateTags() {
        var projectName = contextService.getProject().name,
            tagId = contextService.getTag().id;

        dataService.getTags(projectName, tagId)
            .then(function(data) {
                vm.tags = data;
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
     * Open the selected items for editing (i.e. add them to the wipService open items)
     */
    function openSelected() {
        var projectName = contextService.getProject().name,
            parentTagId = contextService.getTag().id,
            selectedLangs = {};

        selectedLangs[i18nService.getCurrentLang().code] = true;

        vm.selectedItems.forEach(function(index) {
            var uuid = vm.contents[index].uuid;

            if (!wipService.getItem('contents', uuid)) {
                dataService.getContent(projectName, uuid)
                    .then(function (item) {
                        wipService.openItem('contents', item, {
                            projectName: projectName,
                            parentTagId: parentTagId,
                            selectedLangs: selectedLangs
                        });
                    });
            }
        });

        vm.selectedItems = [];
    }
}