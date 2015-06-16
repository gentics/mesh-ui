angular.module('meshAdminUi.projects')
    .factory('nodeSelector', nodeSelector)
    .directive('nodeSelector', nodeSelectorDirective);

function nodeSelector($mdDialog) {

    return {
        open: open
    };

    function open(options) {
        return $mdDialog.show({
            templateUrl: 'projects/components/nodeSelector/nodeSelectorDialog.html',
            controller: nodeSelectDialogController,
            controllerAs: 'dialog'
        });
    }

    /**
     *
     * @param {ng.material.MDDialogService} $mdDialog
     */
    function nodeSelectDialogController($mdDialog) {
        var dialog = this;
        dialog.select = select;
        dialog.cancel = cancel;
        dialog.selectedNodes = [];

        function select() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
}

function nodeSelectorDirective(dataService, contextService) {

    function nodeSelectorController() {
        var vm = this,
            selectedNodesHash = {},
            projectName = contextService.getProject().name,
            currentNodeId = contextService.getParentNode().id;

        vm.selectedNodes = vm.selectedNodes instanceof Array ? vm.selectedNodes : [];
        vm.openNode = openNode;
        vm.toggleSelect = toggleSelect;
        vm.isSelected = isSelected;

        populateContents();

        function toggleSelect(node) {
            if (isSelected(node)) {
                deselectNode(node);
            } else {
                selectNode(node);
            }
        }

        function selectNode(node) {
            selectedNodesHash[node.uuid] = node;
            vm.selectedNodes.push(node);
        }

        function deselectNode(node) {
            delete selectedNodesHash[node.uuid];
            vm.selectedNodes = vm.selectedNodes.filter(function(n) {
                return n.uuid !== node.uuid;
            });
        }

        function isSelected(node) {
            if (node && node.uuid) {
                return !!selectedNodesHash[node.uuid];
            } else {
                return false;
            }
        }

        function openNode(nodeId) {
            currentNodeId = nodeId;
            populateContents();
        }

        function populateContents() {
            dataService.getChildFolders(projectName, currentNodeId)
                .then(function(data) {
                    vm.folders = data;
                    return dataService.getChildContents(projectName, currentNodeId);
                })
                .then(function(data) {
                    vm.contents = data;
                    return dataService.getBreadcrumb(projectName, currentNodeId);
                })
                .then(function(data) {
                    vm.breadcrumbs = data;
                })
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'projects/components/nodeSelector/nodeSelector.html',
        controller: nodeSelectorController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            selectedNodes: '='
        }
    };
}