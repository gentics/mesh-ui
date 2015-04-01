angular.module('caiLunAdminUi.projects')
    .controller('ProjectsListController', ProjectsListController);

function ProjectsListController(dataService) {
    var vm = this;

    dataService.getProjects().then(function(data) {
        vm.projects = data;
    });
}