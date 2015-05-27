angular.module('meshAdminUi.admin')
    .controller('UserListController', UserListController);

function UserListController(dataService) {
    var vm = this;

    dataService.getUsers()
        .then(function(data) {
            vm.users = data;
        });
}