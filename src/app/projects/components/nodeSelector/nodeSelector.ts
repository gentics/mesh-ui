module meshAdminUi {

    /**
     * The nodeSelector service is used to configure and display a node selector modal dialog.
     */
    export class NodeSelector{

        constructor(private $mdDialog: ng.material.IDialogService) {
        }

        /**
         * Opens the node selector dialog. Accepts an `options` object where the following
         * options may be configured:
         *
         * - allow: array, allowed schema types to filter by.
         * - title: string, title of the dialog box.
         * - multiSelect: bool, whether more than one node may be selected.
         * - displayMode: string, either 'list' or 'grid'
         */
        public open(options) {

            function nodeSelectDialogController($mdDialog: ng.material.IDialogService) {
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

            return this.$mdDialog.show({
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
    }

    class NodeSelectorController {

        private selectedNodesHash;
        private currentProject: IProject;
        private currentNode: INode;
        private selectedNodes;
        private multiSelect;
        private allowedSchemas;
        private nodes;
        private breadcrumbs: any[];

        constructor(private dataService: DataService,
                    private contextService: ContextService) {

            this.selectedNodesHash = {};
            this.currentProject = contextService.getProject();
            this.currentNode = contextService.getCurrentNode();
            this.selectedNodes = this.selectedNodes instanceof Array ? this.selectedNodes : [];

            this.populateContents();
        }


        public toggleSelect(node) {
            if (this.isAllowedSchema(node)) {
                if (this.isSelected(node)) {
                    this.deselectNode(node);
                } else {
                    this.selectNode(node);
                }
            }
        }

        public selectNode(node) {
            if (!this.multiSelect) {
                this.selectedNodesHash = {};
                this.selectedNodes = [];
            }
            this.selectedNodesHash[node.uuid] = node;
            this.selectedNodes.push(node);
        }

        public deselectNode(node) {
            delete this.selectedNodesHash[node.uuid];
            this.selectedNodes = this.selectedNodes.filter(function (n) {
                return n.uuid !== node.uuid;
            });
        }

        public isSelected(node) {
            if (node && node.uuid) {
                return !!this.selectedNodesHash[node.uuid];
            } else {
                return false;
            }
        }

        public openNode(nodeUuid: string, event: ng.IAngularEvent) {
            event.stopPropagation();
            this.dataService.getNode(this.currentProject.name, nodeUuid)
                .then(node => {
                    this.currentNode = node;
                    this.populateContents();
                });
        }

        private populateContents() {
            this.dataService.getChildNodes(this.currentProject.name, this.currentNode.uuid)
                .then(response => {
                    this.nodes = response.data.filter(node => this.isAllowedSchemaOrFolder(node));
                    return this.dataService.getBreadcrumb(this.currentProject, this.currentNode);
                })
                .then(breadcrumbs => {

                    let breadcrumbLabels = breadcrumbs.map(node => {
                        return {
                            name: node.fields[node.displayField],
                            uuid: node.uuid
                        };
                    });

                    breadcrumbLabels.push({
                        name: this.currentProject.name,
                        uuid: this.currentProject.rootNodeUuid
                    });

                    this.breadcrumbs = breadcrumbLabels.reverse();
                });
        }

        public isAllowedSchema(node: INode) {
            if (0 < this.allowedSchemas.length) {
                return -1 < this.allowedSchemas.indexOf(node.schema.name);
            } else {
                return true;
            }
        }

        private isAllowedSchemaOrFolder(node: INode) {
            return this.isAllowedSchema(node) || node.container;
        }
    }

    function nodeSelectorDirective() {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/nodeSelector/nodeSelector.html',
            controller: 'nodeSelectorController',
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

    angular.module('meshAdminUi.projects')
           .service('nodeSelector', NodeSelector)
           .controller('nodeSelectorController', NodeSelectorController)
           .directive('nodeSelector', nodeSelectorDirective);


}