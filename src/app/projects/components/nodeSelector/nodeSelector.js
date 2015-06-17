angular.module('meshAdminUi.projects')
    .factory('nodeSelector', nodeSelector)
    .directive('nodeSelector', nodeSelectorDirective);


/**
 * The nodeSelector service is used to configure and display a node selector modal dialog.
 *
 * @param {ng.material.MDDialogService} $mdDialog
 */
function nodeSelector($mdDialog) {


    return {
        open: open
    };

    /**
     * Opens the node selector dialog. Accepts an `options` object where the following
     * options may be configured:
     *
     * - allow: array, allowed schema types to filter by.
     * - title: string, title of the dialog box.
     * - multiSelect: bool, whether more than one node may be selected.
     * - displayMode: string, either 'list' or 'grid'
     *
     * @memberof nodeSelector
     * @param {{}} [options]
     * @returns {ng.IPromise<Array>}
     */
    function open(options) {
        return $mdDialog.show({
            templateUrl: 'projects/components/nodeSelector/nodeSelectorDialog.html',
            controller: nodeSelectDialogController,
            controllerAs: 'dialog',
            locals: {
                allow: options.allow || [],
                title: options.title || 'Select Node',
                multiSelect: options.multiSelect || false,
                displayMode: options.displayMode || 'list'
            },
            bindToController: true
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
            $mdDialog.hide(dialog.selectedNodes);
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
}

/**
 *
 * @param {DataService} dataService
 * @param contextService
 * @returns {{restrict: string, templateUrl: string, controller: nodeSelectorController, controllerAs: string, bindToController: boolean, scope: {selectedNodes: string, allowedSchemas: string, multiSelect: string, displayMode: string}}}
 */
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
            if (!vm.multiSelect) {
                selectedNodesHash = {};
                vm.selectedNodes = [];
            }
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
                    vm.contents = data.filter(allowedSchemaFilter);
                    return dataService.getBreadcrumb(projectName, currentNodeId);
                })
                .then(function(data) {
                    vm.breadcrumbs = data;
                });
        }

        function allowedSchemaFilter(node) {
            if (0 < vm.allowedSchemas.length) {
                return -1 < vm.allowedSchemas.indexOf(node.schema.name);
            } else {
                return true;
            }
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'projects/components/nodeSelector/nodeSelector.html',
        controller: nodeSelectorController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            selectedNodes: '=',
            allowedSchemas: '=',
            multiSelect: '=',
            displayMode: '='
        }
    };
}