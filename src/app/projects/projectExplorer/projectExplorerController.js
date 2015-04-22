angular.module('caiLunAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

/**
 * @param $scope
 * @param $state
 * @param $location
 * @param dataService
 * @param contextService
 * @param parentTag injected from the router resolve function
 * @constructor
 */
function ProjectExplorerController($scope, $state, $location, dataService, contextService, parentTag) {
    var vm = this;

    vm.totalItems = 0;
    vm.itemsPerPage = $location.search().per_page || 10;
    vm.currentPage = $location.search().page || 1;
    vm.loading = true;
    vm.createPermission = -1 < parentTag.perms.indexOf('create');

    vm.getPage = getPage;
    vm.setItemsPerPage = setItemsPerPage;
    vm.goToContent = goToContent;

    $scope.$watch(function() {
        return $location.search().page;
    }, updateCurrentPage);

    populateTags();
    populateSchemas();

    /**
     * Populate the contents in accordance with the current page.
     */
    function updateCurrentPage(newVal) {
        vm.currentPage = newVal;
        populateContent(vm.currentPage);
    }

    /**
     * Called when a page is changed via pagination - update the url query string.
     * @param {number} newPage
     */
    function getPage(newPage) {
        $location.search('page' , newPage);
    }

    /**
     * When the number of items per page is changed, update the url query string.
     */
    function setItemsPerPage() {
        $location.search('per_page' , vm.itemsPerPage);
    }

    /**
     * Transition to the contentEditor view for the given uuid
     * @param uuid
     */
    function goToContent(uuid) {
        $state.go('projects.explorer.content', { uuid: uuid });
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

        vm.loading = true;

        dataService.getContents(projectName, tagId, queryParams)
            .then(function (data) {
                vm.contents = data;
                vm.totalItems = data.metadata.total_count;
                vm.loading = false;
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

    function populateSchemas() {
        dataService.getSchemas()
            .then(function(schemas) {
                vm.schemas = schemas;
            });
    }
}