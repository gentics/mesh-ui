angular.module('caiLunAdminUi.projects')
    .controller('ProjectsListController', ProjectsListController);

function ProjectsListController(dataService) {
    var vm = this;

    populate();

    /**
     * Populate the vm with a list of available projects.
     */
    function populate() {
        dataService.getProjects().then(function(data) {
            vm.projects = data;
        });
    }
}