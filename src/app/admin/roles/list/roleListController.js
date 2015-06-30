angular.module('meshAdminUi.admin')
    .controller('RoleListController', RoleListController);

function RoleListController(dataService) {
    var vm = this;

    dataService.getRoles()
        .then(function(data) {
            vm.roles = data;
        });
}