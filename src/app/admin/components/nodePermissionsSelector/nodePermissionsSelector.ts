module meshAdminUi {

    interface INodeWithEmbeddedProject extends INode {
        name?: string;
        project?: IProject;
    }

    class NodePermissionsSelectorController {

        private currentProject: IProject = null;
        private currentNode: any = null;
        private breadcrumbsBase: any = [{
            name: 'Projects',
            uuid: null
        }];
        private queryParams;
        private collapsed: boolean = true;
        private filter: string = '';
        private nodes: any[] = [];
        private nodePermissions: {
            [itemUuid: string]: any
        } = {};
        private roleId: string;
        private breadcrumbs;
        private onToggle: Function;

        constructor(private dataService: DataService,
                    private $q: ng.IQService,
                    private $timeout: ng.ITimeoutService,
                    private mu: MeshUtils) {
            this.queryParams = { 'role': this.roleId };
            this.populateContents();
        }

        /**
         * Open the selected node and display its child folders and contents.
         */
        public openNode(event: Event, node: any) {
            event.preventDefault();

            if (this.isProjectNode(node)) {
                this.currentProject = node;
                this.currentNode = { uuid: node.rootNode.uuid };
            } else if (node.project) {
                this.currentProject = node.project;
                this.currentNode = node;
            } else {
                this.currentNode = node;
            }
            this.populateContents();
        }

        /**
         * Filter function for matching node names.
         */
        public filterNodes = (node: any): boolean => {
            var name;

            if (this.filter !== '') {
                if (this.isProjectNode(node)) {
                    name = node.name;
                } else {
                    name = node.fields[node.displayField];
                }
                return name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
            } else {
                return true;
            }
        };

        /**
         * Fetch the folders and contents which are children of the currentNodeId, and
         * concatenate into a single array, and populate the breadcrumbs.
         */
        private populateContents() {
            this.nodes.length = 0;
            if (this.currentNode === null || this.currentNode.uuid === null) {
                this.loadProjects();
            } else {
                this.dataService.getChildNodes(this.currentProject.name, this.currentNode.uuid, this.queryParams)
                    .then(data => {
                        this.nodes = data.data;
                        this.createNodePermissionsArray(this.nodes);
                        return this.dataService.getBreadcrumb(this.currentProject, this.currentNode);
                    })
                    .then(breadcrumbs => this.populateBreadcrumbs(breadcrumbs));
            }
        }

        /**
         * Fetch all projects and then get the root node for each, and load the rootNodes into the nodes collection.
         */
        private loadProjects() {
            let projects;

            this.dataService.getProjects(this.queryParams)
                .then(response => {
                    projects = response.data;
                    return this.$q.all(projects.map(project => {
                        return this.dataService.getNode(project.name, project.rootNode.uuid, this.queryParams);
                    }));
                })
                .then(nodes => {
                    this.nodes = nodes;
                    this.nodes.forEach((node: any, i: number) => {
                        node.name = projects[i].name;
                        node.project = projects[i];
                    });
                    this.createNodePermissionsArray(this.nodes);
                    this.breadcrumbs = this.breadcrumbsBase;
                });
        }

        /**
         * populate the NodePermissions object
         * @param nodes
         */
        private createNodePermissionsArray(nodes: INode[]) {
            this.nodePermissions = {};
            nodes.forEach(node => {
                this.nodePermissions[node.uuid] = node.permissions;
            });
        }

        /**
         * Create the breadcrumbs array by concatenating the fetched breadcrumb data with
         *  the `breadcrumbBase` array.
         */
        private populateBreadcrumbs(data: any[]) {
            let breadcrumbs = this.breadcrumbsBase.slice(0);
            if (!this.currentNode.project) {
                breadcrumbs = this.breadcrumbsBase.concat([this.currentProject]);
            }
            this.breadcrumbs = breadcrumbs.concat(data.map(item => this.replaceRootnodeWithProjectName(item)));
        }

        /**
         * Used to map over the breadcrumb array and replace the rootNode with the
         * current project name.
         */
        private replaceRootnodeWithProjectName(item) {
            if (item.name === 'rootNode') {
                item.name = this.currentProject.name;
            }
            return item;
        }

        private isProjectNode(node) {
            return node.hasOwnProperty('rootNode');
        }

        /**
         * Call the onToggle function with the required args. It is inside a $timeout() to ensure that the
         * model has had a chance to update before making the call.
         */
        public toggle(node, recursive: boolean) {
            this.$timeout(() => {
                let permObject = this.nodePermissions[node.uuid];
                let permissions: IPermissionsRequest = {
                    permissions: permObject,
                    recursive: recursive
                };
                let project = (node.project) ? node.project : this.currentProject;
                this.onToggle({ node: node, project: project, permissions: permissions });
            });
        }
    }

    function nodePermissionsSelectorDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/nodePermissionsSelector/nodePermissionsSelector.html',
            controller: 'nodePermissionsSelectorController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                isReadonly: '=',
                roleId: '=',
                onToggle: '&'
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('nodePermissionsSelector', nodePermissionsSelectorDirective)
        .controller('nodePermissionsSelectorController', NodePermissionsSelectorController);

}