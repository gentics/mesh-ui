module meshAdminUi {

    class NodePermissionsSelectorController {

        private projectName: string = null;
        private currentNodeId: string = null;
        private breadcrumbsBase = [{
            name: 'Projects',
            uuid: null
        }];
        private queryParams;
        private collapsed: boolean = true;
        private filter: string = '';
        private items: any[] = [];
        private roleId: string;
        private breadcrumbs;

        constructor(private dataService: DataService,
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
                this.currentNodeId = node.rootNodeUuid;
                this.projectName = node.name;
            } else {
                this.currentNodeId = node.uuid;
            }
            this.populateContents();
        }

        /**
         * Filter function for matching node names.
         */
        public filterNodes(node: any): boolean {
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
        }

        /**
         * Fetch the folders and contents which are children of the currentNodeId, and
         * concatenate into a single array, and populate the breadcrumbs.
         */
        private populateContents() {
            if (this.currentNodeId === null) {
                this.loadProjects();
            } else {
                this.dataService.getChildNodes(this.projectName, this.currentNodeId, this.queryParams)
                    .then(data => {
                        this.items = data.data.map(node => this.mu.rolePermissionsArrayToKeys(node));
                        return this.dataService.getBreadcrumb(this.projectName, this.currentNodeId);
                    })
                    .then(breadcrumbs => this.populateBreadcrumbs(breadcrumbs));
            }
        }

        /**
         * Fetch all projects and put them into the "items" array.
         */
        private loadProjects() {
            this.dataService.getProjects(this.queryParams)
                .then(data => {
                    this.items = data.data.map(project => this.mu.rolePermissionsArrayToKeys(project));
                    this.breadcrumbs = this.breadcrumbsBase;
                });
        }

        /**
         * Create the breadcrumbs array by concatenating the fetched breadcrumb data with
         *  the `breadcrumbBase` array.
         */
        private populateBreadcrumbs(data: any[]) {
            this.breadcrumbs = this.breadcrumbsBase.concat(data.map(item => this.replaceRootnodeWithProjectName(item)));
        }

        /**
         * Used to map over the breadcrumb array and replace the rootNode with the
         * current project name.
         *
         * @param {Object} item
         * @returns {Object}
         */
        private replaceRootnodeWithProjectName(item) {
            if (item.name === 'rootNode') {
                item.name = this.projectName;
            }
            return item;
        }

        private isProjectNode(node) {
            return node.hasOwnProperty('rootNodeUuid');
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
                roleId: '='
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('nodePermissionsSelector', nodePermissionsSelectorDirective)
        .controller('nodePermissionsSelectorController', NodePermissionsSelectorController);

}