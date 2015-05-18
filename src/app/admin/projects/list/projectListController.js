angular.module('meshAdminUi.admin')
    .controller('ProjectListController', ProjectListController);

function ProjectListController(dataService) {
    var vm = this;

    dataService.getProjects()
        .then(function(data) {
            vm.projects = data;
        });
}