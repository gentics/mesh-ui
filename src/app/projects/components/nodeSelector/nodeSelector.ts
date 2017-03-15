module meshAdminUi {

    export interface INodeSelectOptions {
        allow?: string[];
        title?: string;
        multiSelect?: boolean;
        displayMode?: string;
        containersOnly?: boolean;
        includeRootNode?: boolean;
        startingNodeUuid?: string;
    }

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
        public open(options?: INodeSelectOptions) {

            options = options || {};

            return this.$mdDialog.show({
                templateUrl: 'projects/components/nodeSelector/nodeSelectorDialog.html',
                controller: 'NodeSelectDialogController',
                controllerAs: 'dialog',
                locals: {
                    allow: options.allow || [],
                    containersOnly: options.containersOnly || false,
                    title: options.title || 'SELECT_NODE',
                    multiSelect: options.multiSelect || false,
                    displayMode: options.displayMode || 'list',
                    includeRootNode: !!options.includeRootNode,
                    startingNodeUuid: options.startingNodeUuid
                },
                bindToController: true
            });
        }
    }

    class NodeSelectDialogController {

        private selectedNodes = [];

        constructor(private $mdDialog: ng.material.IDialogService) {}


        public select() {
            this.$mdDialog.hide(this.selectedNodes);
        }

        public cancel() {
            this.$mdDialog.cancel();
        }
    }

    class NodeSelectorController {

        private selectedNodesHash;
        private currentProject: IProject;
        private currentNode: INode;
        private selectedNodes: INode[];
        private multiSelect: boolean;
        private allowedSchemas: string[];
        private containersOnly: boolean;
        private includeRootNode: boolean;
        private startingNodeUuid: string;
        private nodes;
        private breadcrumbs: any[];
        private filterNodes;
        private q: string;
        private itemsPerPage = 20;
        private currentPage = 1;

        constructor(private dataService: DataService,
                    private i18nService: I18nService,
                    mu: MeshUtils,
                    private contextService: ContextService) {

            this.selectedNodesHash = {};
            this.currentProject = contextService.getProject();
            this.currentNode = contextService.getCurrentNode();
            this.selectedNodes = this.selectedNodes instanceof Array ? this.selectedNodes : [];

            let initialUuid = this.startingNodeUuid || this.currentProject.rootNode.uuid;

            dataService.getNode(this.currentProject.name, initialUuid)
                .then((node: INode) => {
                    if (this.startingNodeUuid && node.parentNode) {
                        // if the startingNodeUuid was specified, we want to go up a level
                        // in the tree so that it can be selected.
                        return dataService.getNode(this.currentProject.name, node.parentNode.uuid);
                    } else {
                        return node;
                    }
                })
                .then(node => this.currentNode = node)
                .then(() => this.populateContents());

            this.filterNodes = (node: INode) => {
                return mu.nodeFilterFn(node, this.q);
            }
        }


        public toggleSelect(node: INode, event: Event) {
            if (this.isAllowedSchema(node)) {
                if (this.isSelected(node)) {
                    this.deselectNode(node);
                } else {
                    this.selectNode(node);
                }
            } else {
                this.openNode(node, event);
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

        public openNode(node: INode, event: Event) {
            if (node.container !== false) {
                event.stopPropagation();
                this.dataService.getNode(this.currentProject.name, node.uuid)
                    .then(node => {
                        this.currentNode = node;
                        this.populateContents();
                    });
            }
        }

        private populateContents() {
            this.dataService.getChildNodes(this.currentProject.name, this.currentNode.uuid, { perPage: 9999999 })
                .then(response => {
                    this.nodes = response.data.filter(node => this.isAllowedSchemaOrFolder(node));
                    if (this.includeRootNode) {
                       this.addRootNode();
                    }
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
                        uuid: this.currentProject.rootNode.uuid
                    });

                    this.breadcrumbs = breadcrumbLabels.reverse();
                });
        }

        public pageChanged(pageNumber): void {
            this.currentPage = pageNumber;
        }

        /**
         * If we are in the rootNode, add it to the start of the nodes array.
         */
        private addRootNode() {
            if (this.currentProject.rootNode.uuid === this.currentNode.uuid) {
                let rootNode = angular.copy(this.currentNode);
                rootNode.fields['name'] = "Root Node";
                rootNode.displayField = 'name';
                rootNode.schema.name = "rootNode";
                this.nodes.unshift(rootNode);
            }
        }
        
        /**
         * Returns true if the node is not available in the current language
         */
        public isUntranslated(node: INode): boolean {
            return node.language !== this.i18nService.getCurrentLang().code;
        }
        
        public getDisplayName(node: INode): string {
            let displayName = node.fields[node.displayField];
            let langCode = node.language && node.language.toUpperCase();
            let langString = this.isUntranslated(node) && langCode ? ` (${langCode})` : '';
            return displayName + langString;
        }

        public isAllowedSchema(node: INode) {
            if (0 < this.allowedSchemas.length) {
                return -1 < this.allowedSchemas.indexOf(node.schema.name);
            } else {
                return true;
            }
        }

        private isAllowedSchemaOrFolder(node: INode) {
            if (!this.isAllowedSchema(node) && !node.container) {
                return false;
            }
            if (this.containersOnly) {
                return !!node.container;
            }
            return true;
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
                displayMode: '=',
                containersOnly: '=',
                includeRootNode: '=',
                startingNodeUuid: '=',
            }
        };
    }

    angular.module('meshAdminUi.projects')
           .service('nodeSelector', NodeSelector)
           .controller('NodeSelectDialogController', NodeSelectDialogController)
           .controller('nodeSelectorController', NodeSelectorController)
           .directive('nodeSelector', nodeSelectorDirective);


}