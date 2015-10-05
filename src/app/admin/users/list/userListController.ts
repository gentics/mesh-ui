angular.module('meshAdminUi.admin')
    .controller('UserListController', UserListController);

function UserListController($q, dataService) {
    var vm = this;

    vm.validateGroup = validateGroup;
    vm.validateRole = validateRole;
    vm.filterBy = filterBy;

    $q.all([
        dataService.getGroups(),
        dataService.getUsers(),
        dataService.getRoles()
    ])
        .then(function(dataArray) {
            vm.groups = dataArray[0];
            vm.users = dataArray[1];
            vm.roles = dataArray[2];
        });



    function validateGroup(group, user) {
        var userAlreadyInGroup = user.groups.map(function(group) {
            return group.name;
        }).indexOf(group.name) > -1;

        if (userAlreadyInGroup || !group.name) {
           return {
               name: "invalid group name"
           };
        } else {
            return group;
        }
    }

    function validateRole(role, group) {
        var groupAlreadyHasRole = group.roles.map(function(role) {
            return role.name;
        }).indexOf(role.name) > -1;

        if (groupAlreadyHasRole || !role.name) {
           return {
               name: "invalid role"
           };
        } else {
            return role;
        }
    }

    /**
     * Search for thing.
     */
    function filterBy(collection, query) {
        return query ? collection.filter(createFilterFor(query)) : [];
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }
}