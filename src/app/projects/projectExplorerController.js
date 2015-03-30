function ProjectExplorerController() {
    var vm = this;

    // TODO: get this data from the server
    vm.tags = ['Website Pages', 'Products', 'Documentation', 'Jobs'];
    vm.breadcrumbsArray = [];
}

angular.module('caiLunAdminUi')
    .controller('ProjectExplorerController', ProjectExplorerController);