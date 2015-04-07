angular.module('caiLunAdminUi.projects')
    .controller('ProjectExplorerController', ProjectExplorerController);

function ProjectExplorerController(dataService, contextService) {
    var vm = this;

    // TODO: get this data from the server
    vm.tags = ['January News', 'February News', 'March News'];

    dataService.getContents(contextService.getProject().name)
        .then(function(data) {
            vm.contents = data;
        });
}