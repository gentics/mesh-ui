angular.module('meshAdminUi.admin')
    .directive('nodePermissionsSelector', nodePermissionsSelectorDirective);

/**
 *
 * @param {DataService} dataService
 * @param {meshUtils} mu
 * @returns {{}}
 */
function nodePermissionsSelectorDirective(dataService, mu) {

    function nodePermissionsSelectorController() {
        var vm = this,
            projectName = null,
            currentNodeId = null,
            breadcrumbsBase = [{
                    name: 'Projects',
                    uuid: null
                }];

        vm.openNode = openNode;
        vm.filterNodes = filterNodes;
        vm.filter = '';
        vm.items = [];

        populateContents();

        /**
         * Open the selected node and display its child folders and contents.
         *
         * @param {Event} event
         * @param {Object} node
         */
        function openNode(event, node) {
            event.preventDefault();

            if (isProjectNode(node)) {
                currentNodeId = node.rootNodeUuid;
                projectName = node.name;
            } else {
                currentNodeId = node.uuid;
            }
            populateContents();
        }

        /**
         * Filter function for matching node names.
         * @param {Object} node
         * @returns {boolean}
         */
        function filterNodes(node) {
            var name;

            if (vm.filter !== '') {
                if (isProjectNode(node)) {
                    name = node.name;
                } else {
                    name = node.fields[node.displayField];
                }
                return name.toLowerCase().indexOf(vm.filter.toLowerCase()) > -1;
            } else {
                return true;
            }
        }

        /**
         * Fetch the folders and contents which are children of the currentNodeId, and
         * concatenate into a single array, and populate the breadcrumbs.
         */
        function populateContents() {
            if (currentNodeId === null) {
                loadProjects();
            } else {
                dataService.getChildFolders(projectName, currentNodeId)
                    .then(function(data) {
                        vm.items = data;
                        return dataService.getChildContents(projectName, currentNodeId);
                    })
                    .then(function(data) {
                        vm.items = vm.items.concat(data).map(mu.rolePermissionsArrayToKeys);
                        return dataService.getBreadcrumb(projectName, currentNodeId);
                    })
                    .then(populateBreadcrumbs);
            }
        }

        /**
         * Fetch all projects and put them into the "items" array.
         */
        function loadProjects() {
            dataService.getProjects()
                .then(function(data) {
                    vm.items = data.map(mu.rolePermissionsArrayToKeys);
                    vm.breadcrumbs = breadcrumbsBase;
                });
        }

        /**
         * Create the breadcrumbs array by concatenating the fetched breadcrumb data with
         *  the `breadcrumbBase` array.
         * @param {Array<Object>} data
         */
        function populateBreadcrumbs(data) {
            vm.breadcrumbs = breadcrumbsBase.concat(data.map(replaceRootnodeWithProjectName));
        }

        /**
         * Used to map over the breadcrumb array and replace the rootNode with the
         * current project name.
         *
         * @param {Object} item
         * @returns {Object}
         */
        function replaceRootnodeWithProjectName(item) {
            if (item.name === 'rootNode') {
                item.name = projectName;
            }
            return item;
        }

        function isProjectNode(node) {
            return node.hasOwnProperty('rootNodeUuid');
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