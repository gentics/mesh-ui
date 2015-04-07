angular.module('caiLunAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

/**
 * @param dataService
 * @param contextService
 * @constructor
 */
function ProjectExplorerController(dataService, contextService) {
    var vm = this;

    vm.itemsPerPage = 25;
    vm.totalItems = 0;
    vm.currentPage = 1;

    // TODO: get this data from the server
    vm.tags = ['January News', 'February News', 'March News'];

    vm.getPage = function(newPage) {
        populate(newPage);
    };

    populate(1);

    function populate(page) {
        var projectName = contextService.getProject().name,
            queryParams = {
                page: page,
                per_page: vm.itemsPerPage
            };

        dataService.getContents(projectName, queryParams, true)
            .then(function (data) {
                vm.contents = data;
                vm.totalItems = data.metadata.total_count;
            });
    }
}