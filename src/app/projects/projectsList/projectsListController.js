angular.module('caiLunAdminUi.projects')
    .controller('ProjectsListController', ProjectsListController);

function ProjectsListController(dataService) {
    var vm = this;

    populate();

    function populate() {
        dataService.getProjects().then(function(data) {
            vm.projects = data;
        });
    }
}