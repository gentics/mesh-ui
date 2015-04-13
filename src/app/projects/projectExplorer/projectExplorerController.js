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

    // TODO: get this data from the server
    vm.tags = ['January News', 'February News', 'March News'];

    /**
     * Called when a page is changed via pagination - update the url query string
     * and get the results from the dataService.
     * @param {number} newPage
     */
    vm.getPage = function(newPage) {
        $location.search('page' , newPage);
        populate(newPage);
    };

    /**
     * When the number of items per page is changed, update the url query string.
     */
    vm.setItemsPerPage = function() {
        $location.search('per_page' , vm.itemsPerPage);
    };

    /**
     * Transition to the contentEditor view for the given uuid
     * @param uuid
     */
    vm.goToContent = function(uuid) {
        $state.go('projects.explorer.content', { uuid: uuid });
    };

    populate(vm.currentPage);

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
    }
}