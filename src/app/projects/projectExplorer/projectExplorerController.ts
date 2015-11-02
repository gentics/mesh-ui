module meshAdminUi {

    /**
     *
     */
    class ProjectExplorerController {

        private itemsPerPage: number = 10;
        private createPermission: boolean;
        private contents = [];
        private childrenSchemas: ISchema[] = [];
        private projectName: string;
        private searchParams: INodeSearchParams = {};

        constructor( private $scope: ng.IScope,
                     private dataService: DataService,
                     private mu: MeshUtils,
                     private contextService: ContextService,
                     private dispatcher: Dispatcher,
                     private currentNode: INode) {

            this.projectName = contextService.getProject().name;
            this.createPermission = -1 < currentNode.permissions.indexOf('create');

            const updateContents = () => this.populateChildNodes();
            const searchTermHandler = (event, term: string) => {
                this.searchParams.searchTerm = term;
                mu.debounce(updateContents, 250)();
            };

            dispatcher.subscribe(dispatcher.events.explorerSearchTermChanged, searchTermHandler);
            dispatcher.subscribe(dispatcher.events.explorerContentsChanged, updateContents);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(updateContents, searchTermHandler));

            this.populateChildNodes();
        }

        public goToPage() {

        }

        /**
         * Fill the vm with the child children of the current node.
         */
        public populateChildNodes(): ng.IPromise<any> {
            var projectName = this.contextService.getProject().name,
                nodeUuid = this.currentNode.uuid,
                queryParams: INodeListQueryParams = {
                    perPage: this.itemsPerPage
                };

            return this.dataService.getNodeChildrenSchemas(nodeUuid)
                .then(response => {
                    this.childrenSchemas = response.data;
                    let bundleParams: INodeBundleParams[] = response.data.map(schema => {
                        return {
                            schema: schema,
                            page: 1
                        };
                    });
                    return this.dataService.getNodeBundles(projectName, nodeUuid, bundleParams, this.searchParams, queryParams);
                })
                .then(response => this.contents = response);
        }

        public pageChanged(newPageNumber: number, schemaUuid: string) {
            let bundleParams: INodeBundleParams[] = [{
                schema: this.childrenSchemas.filter(schema => schema.uuid === schemaUuid)[0],
                page: newPageNumber
            }];

            return this.dataService.getNodeBundles(this.projectName, this.currentNode.uuid, bundleParams, this.searchParams, {
                perPage: this.itemsPerPage
            }).then(result => {
                var index = this.contents.map(bundle => bundle.schema.uuid).indexOf(schemaUuid);
                this.contents[index].data = result[0].data;
                this.contents[index]._metainfo = result[0]._metainfo;
            });
        }
    }

    angular.module('meshAdminUi.projects')
        .controller('ProjectExplorerController', ProjectExplorerController);


}