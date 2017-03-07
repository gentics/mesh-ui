module meshAdminUi {

    /**
     *
     */
    class ProjectExplorerController {

        private itemsPerPage: number = 10;
        private createPermission: boolean;
        private contents: INodeBundleResponse[] = [];
        private childrenSchemas: ISchema[] = [];
        private projectName: string;
        public tagsArray: { [nodeUuid: string]: ITag[] } = {};

        constructor(private $scope: ng.IScope,
                    private $q: ng.IQService,
                    private dataService: DataService,
                    private searchService: SearchService,
                    private mu: MeshUtils,
                    private contextService: ContextService,
                    private dispatcher: Dispatcher,
                    private currentNode: INode) {

            this.projectName = contextService.getProject().name;
            this.createPermission = currentNode.permissions.create;

            const updateContents = () => {
                dataService.getNode(contextService.getProject().name, currentNode.uuid)
                    .then((node: INode) => {
                        this.currentNode = node;
                        return this.getChildrenSchemas();
                    })
                    .then(() => this.populateChildNodes());
            };

            const updateNode = (event, nodeUuid: string) => {
                dataService.getNode(contextService.getProject().name, nodeUuid)
                .then(node => {
                    let bundleIndex = this.contents.map(bundle => bundle.schema.uuid).indexOf(node.schema.uuid);
                    if (-1 < bundleIndex) {
                        let nodeIndex = this.contents[bundleIndex].data.map(node => node.uuid).indexOf(node.uuid);
                        this.contents[bundleIndex].data[nodeIndex] = node;
                        this.tagsArray[node.uuid] = mu.nodeTagsObjectToArray(node.tags);
                    }
                })
            };

            const searchParamsHandler = () => this.populateChildNodes();

            dispatcher.subscribe(dispatcher.events.explorerSearchParamsChanged, searchParamsHandler);
            dispatcher.subscribe(dispatcher.events.explorerContentsChanged, updateContents);
            dispatcher.subscribe(dispatcher.events.explorerNodeTagsChanged, updateNode);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(updateContents, searchParamsHandler, updateNode));

            this.getChildrenSchemas()
                .then(() => this.populateChildNodes());
        }

        /**
         * The node.childrenInfo property contains the name and uuid of the children's schemas, but we need the
         * full schema object in order to do proper search queries, since we need to know the displayField of
         * each child type.
         */
        private getChildrenSchemas() {
            let promises = Object.keys(this.currentNode.childrenInfo).map((schemaName: string) => {
                return this.dataService.getSchema(this.currentNode.childrenInfo[schemaName].schemaUuid);
            });
            return this.$q.all<ISchema>(promises)
                .then((results: ISchema[]) => {
                    this.childrenSchemas = results;
                });
        }


        /**
         * Converts the tags object for each node in the bundle into an array
         * and stores them in this.tagsArray[nodeUuid].
         */
        private populateTagsArray(bundles: INodeBundleResponse[]) {
            return bundles.forEach(bundle => {
                bundle.data.forEach(node => {
                    this.tagsArray[node.uuid] = this.mu.nodeTagsObjectToArray(node.tags);
                })
            });
        }

        /**
         * Fill the vm with the child children of the current node.
         */
        public populateChildNodes(): ng.IPromise<any> {
            let projectName = this.contextService.getProject().name,
                searchParams = this.searchService.getParams(),
                queryParams: INodeListQueryParams = {
                    perPage: this.itemsPerPage
                };

            let bundleParams: INodeBundleParams[] = this.childrenSchemas.map(schemaRef => {
                return {
                    schema: schemaRef,
                    page: 1
                };
            });
            return this.dataService.getNodeBundles(projectName, this.currentNode, bundleParams, searchParams, queryParams)
                .then(response => {
                    this.contents = response;
                    this.populateTagsArray(response);
                });
        }

        /**
         * Reload a single bundle with a new page of data and update the contents list.
         */
        public pageChanged(newPageNumber: number, schemaUuid: string) {
            let bundleParams: INodeBundleParams[] = [{
                schema: this.childrenSchemas.filter(schema => schema.uuid === schemaUuid)[0],
                page: newPageNumber
            }];
            let searchParams = this.searchService.getParams();

            return this.dataService.getNodeBundles(this.projectName, this.currentNode, bundleParams, searchParams, {
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