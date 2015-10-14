module meshAdminUi {

    /**
     *
     */
    class ProjectExplorerController {

        private totalItems: number = 0;
        private itemsPerPage: number;
        private currentPage: number;
        private createPermission: boolean;
        private contents = [];
        private projectName: string;

        constructor( private $scope: ng.IScope,
                     private $location: ng.ILocationService,
                     private dataService: DataService,
                     private contextService: ContextService,
                     private parentNode: INode) {

            this.itemsPerPage = $location.search().per_page || 10;
            this.currentPage = $location.search().page || 1;
            this.projectName = contextService.getProject().name;
            this.createPermission = -1 < parentNode.permissions.indexOf('create');

            $scope.$watch(() => $location.search().page, newVal => {
                this.updateContents(newVal, this.itemsPerPage);
                this.populateChildNodes(newVal);
            });
        }

        /**
         * Update the URL query params and vm values for
         * current page and items per page. New content will be
         * requested from the server via the watcher.
         */
        public updateContents(currentPage: number, itemsPerPage: number) {
            this.currentPage = currentPage;
            this.itemsPerPage = itemsPerPage;
            this.$location.search('page', currentPage);
            this.$location.search('per_page', itemsPerPage);
        }

        /**
         * Fill the vm with the child children of the current node.
         */
        public populateChildNodes(page: number): ng.IPromise<any> {
            var projectName = this.contextService.getProject().name,
                parentNodeId = this.parentNode.uuid,
                queryParams = {
                    page: page,
                    per_page: this.itemsPerPage
                };

            return this.dataService.getChildNodes(projectName, parentNodeId, queryParams)
                .then(response => {
                    var schemaGroups = {};
                    response.data.forEach(node => {
                        if (!schemaGroups[node.schema.name]) {
                            schemaGroups[node.schema.name] = {schema: node.schema.name, nodes: []};
                        }
                        schemaGroups[node.schema.name].nodes.push(node);
                    });
                    this.contents.length = 0;
                    for (var schemaName in schemaGroups) {
                        this.contents.push(schemaGroups[schemaName]);
                    }
                    this.totalItems = response.metadata.totalCount;
                });
        }
    }

    angular.module('meshAdminUi.projects')
        .controller('ProjectExplorerController', ProjectExplorerController);


}