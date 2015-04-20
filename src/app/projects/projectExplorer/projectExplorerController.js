angular.module('caiLunAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

/**
 * @param $scope
 * @param $state
 * @param $location
 * @param dataService
 * @param contextService
 * @constructor
 */
function ProjectExplorerController($scope, $state, $location, dataService, contextService) {
    var vm = this;

    vm.totalItems = 0;
    vm.itemsPerPage = $location.search().per_page || 10;
    vm.currentPage = $location.search().page || 1;
    vm.loading = true;

    vm.getPage = getPage;
    vm.setItemsPerPage = setItemsPerPage;
    vm.goToContent = goToContent;

    $scope.$on('$locationChangeSuccess', updateCurrentPage);

    populateContent(vm.currentPage);
    populateTags();

    /**
     * Populate the contents in accordance with the current page.
     */
    function updateCurrentPage() {
        vm.currentPage = $location.search().page;
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
}