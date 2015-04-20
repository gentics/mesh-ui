angular.module('caiLunAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

/**
 * @param $state
 * @param $location
 * @param dataService
 * @param contextService
 * @constructor
 */
function ProjectExplorerController($state, $location, dataService, contextService) {
    var vm = this;

    vm.totalItems = 0;
    vm.itemsPerPage = $location.search().per_page || 10;
    vm.currentPage = $location.search().page || 1;
    vm.loading = true;

    vm.getPage = getPage;
    vm.setItemsPerPage = setItemsPerPage;
    vm.goToContent = goToContent;

    populate(vm.currentPage);

    /**
     * Called when a page is changed via pagination - update the url query string
     * and get the results from the dataService.
     * @param {number} newPage
     */
    function getPage(newPage) {
        $location.search('page' , newPage);
        populate(newPage);
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
     * Fill the vm with contents & tags data from the server.
     * @param page
     */
    function populate(page) {
        var projectName = contextService.getProject().name,
            queryParams = {
                page: page,
                per_page: vm.itemsPerPage
            };
        vm.loading = true;

        dataService.getContents(projectName, queryParams)
            .then(function (data) {
                vm.contents = data;
                vm.totalItems = data.metadata.total_count;
                vm.loading = false;
            });

        dataService.getTags(projectName)
            .then(function(data) {
                vm.tags = data;
            });
    }
}