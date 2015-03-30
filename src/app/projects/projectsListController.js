function ProjectsListController() {
    var vm = this;

    // TODO: get from server
    vm.projects = [
        {
            name: 'Project One',
            roles: 'Editor',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            name: 'Project Two',
            roles: 'Editor',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ];
}

angular.module('caiLunAdminUi')
    .controller('ProjectsListController', ProjectsListController);