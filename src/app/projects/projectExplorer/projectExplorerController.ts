module meshAdminUi {

    /**
     *
     */
    class ProjectExplorerController {

        private totalItems: number = 0;
        private itemsPerPage: number = 3;
        private currentPage: any;
        private createPermission: boolean;
        private contents = [];
        private projectName: string;

        constructor( private $scope: ng.IScope,
                     private $location: ng.ILocationService,
                     private explorerContentsListService: ExplorerContentsListService,
                     private dataService: DataService,
                     private contextService: ContextService,
                     private dispatcher: Dispatcher,
                     private currentNode: INode) {

            this.currentPage = {};
            this.projectName = contextService.getProject().name;
            this.createPermission = -1 < currentNode.permissions.indexOf('create');

            const updateContents = (pageNumber?) => {
                this.populateChildNodes();
            };

            $scope.$watch(() => $location.search().page, updateContents);
            dispatcher.subscribe(dispatcher.events.explorerContentsChanged, updateContents);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(updateContents));
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
                    let bundleParams: INodeBundleParams[] = response.data.map(schema => {
                        return {
                            schema: {
                                name: schema.name,
                                uuid: schema.uuid
                            },
                            page: 1
                        };
                    });
                    return this.dataService.getNodeBundles(projectName, nodeUuid, bundleParams, queryParams);
                })
                .then(response => {
                    this.contents = response;
                    this.explorerContentsListService.init(this.totalItems, this.itemsPerPage);
                });
        }

        public pageChanged(newPageNumber: number, schemaUuid: string) {
            let bundleParams: INodeBundleParams[] = [{
                schema: {
                    name: '',
                    uuid: schemaUuid
                },
                page: newPageNumber
            }];

            return this.dataService.getNodeBundles(this.projectName, this.currentNode.uuid, bundleParams, {
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