angular.module('meshAdminUi.admin')
    .directive('nodePermissionsSelector', nodePermissionsSelectorDirective);

/**
 *
 * @param {DataService} dataService
 * @returns {{}}
 */
function nodePermissionsSelectorDirective(dataService) {

    function nodePermissionsSelectorController() {
        var vm = this,
            projectName = null,
            currentNodeId = null,
            breadcrumbsBase = [{
                    name: 'Projects',
                    uuid: null
                }];

        vm.selectedNodes = vm.selectedNodes instanceof Array ? vm.selectedNodes : [];
        vm.openNode = openNode;
        vm.items = [];

        populateContents();

        function openNode(event, node) {
            event.preventDefault();

            if (node.rootNodeUuid) {
                currentNodeId = node.rootNodeUuid;
                projectName = node.name;
            } else {
                currentNodeId = node.uuid;
            }
            populateContents();
        }

        function populateContents() {

            if (currentNodeId === null) {
                dataService.getProjects()
                    .then(function(data) {
                        vm.items = data;
                        vm.breadcrumbs = breadcrumbsBase;
                    });
            } else {
                dataService.getChildFolders(projectName, currentNodeId)
                    .then(function(data) {
                        vm.items = data;
                        return dataService.getChildContents(projectName, currentNodeId);
                    })
                    .then(function(data) {
                        vm.items = vm.items.concat(data).map(function(item) {
                            item.create = item.perms.indexOf('create') > -1;
                            item.read = item.perms.indexOf('read') > -1;
                            item.update = item.perms.indexOf('update') > -1;
                            item['delete'] = item.perms.indexOf('delete') > -1;
                            return item;
                        });
                        return dataService.getBreadcrumb(projectName, currentNodeId);
                    })
                    .then(function(data) {
                        vm.breadcrumbs = breadcrumbsBase.concat(data.map(function(item) {
                            if (item.name === 'rootNode') {
                                item.name = projectName;
                            }
                            return item;
                        }));
                    });
            }
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'admin/components/nodePermissionsSelector/nodePermissionsSelector.html',
        controller: nodePermissionsSelectorController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {}
    };
}