module meshAdminUi {


    /**
     * Interface used to specify which nodes to retrieve in each bundle.
     */
    export interface INodeBundleParams {
        schema: ISchema;
        page: number;
    }

    export interface INodeBundleResponse {
        schema: INodeReference;
        _metainfo: IListMetaInfo;
        data: INode[];
    }

    export interface INodeSearchParams {
        searchTerm?: string;
        tags?: string[]
    }

    export interface ISearchQuery {
        sort? : any;
        query? : any;
        filter? : any;
    }

    export interface INodeListQueryParams {
        expand?: string;
        page?: number;
        perPage?: number;
        orderBy?: string;
    }

    export interface IPermissionsRequest {
        permissions: string[];
        recursive?: boolean;
    }

    angular.module('meshAdminUi.common')
        .config(dataServiceConfig)
        .provider('dataService', dataServiceProvider);

    /**
     * The dataServiceProvider is used to configure and create the DataService which is used
     * for all requests to the API.
     */
    function dataServiceProvider(): any {

        var apiUrl;

        this.setApiUrl = setApiUrl;
        this.$get = function ($http, $q, Upload, selectiveCache, i18nService) {
            return new DataService($http, $q, Upload, selectiveCache, i18nService, apiUrl);
        };

        /**
         * Allow config of the API url in the app's config phase.
         * @param value
         */
        function setApiUrl(value) {
            apiUrl = value;
        }
    }

    /**
     * The data service itself which is responsible for all requests to the API.
     */
    export class DataService {

        constructor(private $http: ng.IHttpService,
                    private $q: ng.IQService,
                    private Upload: any,
                    private selectiveCache: SelectiveCache,
                    private i18nService: I18nService,
                    private apiUrl: string) {

            selectiveCache.setBaseUrl(apiUrl);
            $http.defaults.cache = selectiveCache;
        }


        private meshGet(url:string, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.get(this.makeFullUrl(url), config)
                .then(response => response.data);
        }

        private meshPut(url:string, data:any, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.put(this.makeFullUrl(url), data, config)
                .then(response => response.data);
        }

        private meshPost(url:string, data:any, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.post(this.makeFullUrl(url), data, config)
                .then(response => response.data);
        }

        private meshDelete(url:string, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.delete(this.makeFullUrl(url), config)
                .then(response => response.data);
        }

        /**
         * Attach the given URL to the configured API URL and url-encode it.
         */
        private makeFullUrl(url: string): string {
            return this.apiUrl + encodeURI(url);
        }

        private makeConfigObject(params?:any, config?:any) {
            params = params || {};
            params.lang = params.lang || this.i18nService.getCurrentLang().code;
            config = config || {};
            config.params = params;
            return config;
        }

        /**
         * Get all projects as a list.
         */
        public getProjects(queryParams?:any): ng.IPromise<IListResponse<IProject>> {
            return this.meshGet('projects', queryParams);
        }

        /**
         * Get the details of a single project specified by uuid.
         */
        public getProject(uuid:string, queryParams?:any): ng.IPromise<IProject> {
            return this.meshGet('projects/' + uuid, queryParams);
        }

        public getProjectByName(name: string, queryParams?): ng.IPromise<IProject> {
            return this.getProjects(queryParams)
                .then(response => response.data.filter(project => project.name === name)[0]);
        }

        /**
         * Persist the project back to the server.
         */
        public persistProject(project):ng.IPromise<any> {
            this.clearCache('projects');
            this.clearCache('tags');
            if (project.hasOwnProperty('save')) {
                // this is a Restangular object
                return this.meshPut('projects', project);
            } else {
                // this is a plain object (newly-created)
                return this.meshPost('projects', project);
            }
        }

        /**
         * Delete the project from the server.
         */
        public deleteProject(project):ng.IPromise<any> {
            this.clearCache('projects');
            return this.meshDelete('projects/' + project.uuid);
        }

        /**
         * Get the uuid of the specified project.
         */
        public getProjectId(projectName):ng.IPromise<string> {
            return this.getProjectProperty(projectName, 'uuid');
        }

        /**
         * Get the root tag uuid of the specified project.
         */
        public getProjectRootNodeId(projectName):ng.IPromise<string> {
            return this.getProjectProperty(projectName, 'rootNodeUuid');
        }

        /**
         * Get the value of the specified property for a project matching
         * projectName. If no matching project is found, the promise is
         * rejected.
         */
        public getProjectProperty(projectName, propertyName):ng.IPromise<any> {
            var deferred = this.$q.defer();

            this.getProjects().then(function (projects) {
                var filtered = projects.data.filter(function (project) {
                    return project.name === projectName;
                });

                if (filtered[0] && filtered[0][propertyName]) {
                    deferred.resolve(filtered[0][propertyName]);
                } else {
                    deferred.reject('Property "' + propertyName + '" of project "' + projectName + '" not found.');
                }
            });

            return deferred.promise;
        }

        /**
         *
         */
        public getUsers(queryParams?): ng.IPromise<any> {
            return this.meshGet('users', queryParams);
        }

        /**
         *
         */
        public getUser(uuid: string, queryParams?): ng.IPromise<any> {
            return this.meshGet('users/' + uuid, queryParams);
        }

        /**
         * Persist the user back to the server.
         */
        public persistUser(user: IUser): ng.IPromise<IUser> {
            let isNew = !user.hasOwnProperty('created');
            this.clearCache('users');
            return isNew ? this.createUser(user) : this.updateUser(user);
        }

        private createUser(user: IUser): ng.IPromise<IUser> {
            return this.meshPost('users', user);
        }

        private updateUser(user: IUser): ng.IPromise<IUser> {
            return this.meshPut('users/' + user.uuid, user);
        }

        public deleteUser(user): ng.IPromise<any> {
            this.clearCache('users');
            return this.meshDelete('users/' + user.uuid);
        }

        public addUserToGroup(userId: string, groupId: string): ng.IPromise<any> {
            return this.meshPut('groups/' + groupId + '/users/' + userId, {});
        }

        public removeUserFromGroup(userId: string, groupId: string): ng.IPromise<any> {
            return this.meshDelete('groups/' + groupId + '/users/' + userId);
        }

        /**
         *
         */
        public getGroups(queryParams?):ng.IPromise<any> {
            return this.meshGet('groups', queryParams);
        }

        public getGroup(uuid: string, queryParams?: any) {
            return this.meshGet('groups/' + uuid, queryParams);
        }

        public deleteGroup(uuid: string, queryParams?: any) {
            this.clearCache('groups');
            return this.meshDelete('groups/' + uuid, queryParams);
        }
        /**
         * Persist the group back to the server.
         */
        public persistGroup(group: IUserGroup): ng.IPromise<IUserGroup> {
            let isNew = !group.hasOwnProperty('created');
            this.clearCache('users');
            return isNew ? this.createGroup(group) : this.updateGroup(group);
        }
        private createGroup(group: IUserGroup): ng.IPromise<IUserGroup> {
            return this.meshPost('groups', group);
        }
        private updateGroup(group: IUserGroup): ng.IPromise<IUserGroup> {
            return this.meshPut('groups/' + group.uuid, group);
        }

        public addGroupToRole(groupUuid: string, roleUuid: string): ng.IPromise<any> {
            return this.meshPut('groups/' + groupUuid + '/roles/' + roleUuid, {});
        }
        public removeGroupFromRole(groupUuid: string, roleUuid: string): ng.IPromise<any> {
            return this.meshDelete('groups/' + groupUuid + '/roles/' + roleUuid);
        }


        /**
         * Get the child nodes for the parent node in the given project.
         */
        public getChildNodes(projectName: string, parentNodeId: string, queryParams?): ng.IPromise<IListResponse<INode>> {
            var url = projectName + '/nodes/' + parentNodeId + '/children';

            return this.meshGet(url, queryParams)
                .then(result => {
                    result.data.sort(this.sortNodesBySchemaName);
                    return result;
                });
        }

        /**
         */
        public getNodeBundles(projectName: string,
                              node: INode,
                              bundleParams: INodeBundleParams[],
                              searchParams?: INodeSearchParams,
                              queryParams?: INodeListQueryParams): ng.IPromise<INodeBundleResponse[]> {

            const sortByIsContainer = (a: INodeBundleParams, b: INodeBundleParams): number => {
                if (a.schema.folder === true && b.schema.folder === false) {
                    return -1;
                } else if (a.schema.folder === false && b.schema.folder === true) {
                    return 1;
                }
                return 0;
            };

            let promises = bundleParams
                .sort(sortByIsContainer)
                .map(bundleParam => {
                    let query: ISearchQuery = {
                        filter: {
                            bool: {
                                must: [
                                    { "term": { "project.name": projectName.toLowerCase() } },
                                    { "term": { "parentNode.uuid": node.uuid } },
                                    { "term": { "schema.uuid": bundleParam.schema.uuid } }
                                ]
                            }
                        },
                        sort: [
                            { "created": "asc" }
                        ]
                    };

                    if (searchParams.searchTerm) {
                        let displayField = 'fields.' + bundleParam.schema.displayField;
                        query.query = {
                            /* "wildcard": { [displayField] : searchParams.searchTerm.toLowerCase() + '*' }*/
                            "query_string": {
                                "query": displayField + ":" + searchParams.searchTerm.toLowerCase() + '*'
                            }
                        };
                    }

                    let bundleQueryParams = angular.extend(queryParams, { page: bundleParam.page });
                    return this.searchNodes(query, bundleQueryParams);
                });

            return this.$q.all(promises)
                .then(results => {
                    return results
                        .map((listResponse: IListResponse<INode>, index: number) => {
                            return angular.extend(listResponse, { schema: bundleParams[index].schema });
                        })
                        .filter(bundle => 0 < bundle.data.length);
                });
        }

        public searchNodes(query : ISearchQuery, queryParams?: INodeListQueryParams): ng.IPromise<IListResponse<INode>>  {
            return this.meshPost('search/nodes', query, queryParams);
        }

        /**
         * Get a single node.
         */
        public getNode(projectName, uuid, queryParams?):ng.IPromise<any> {
            queryParams = queryParams || {};
            queryParams.lang = this.i18nService.languages.map(lang => lang.code).join(',');
            return this.meshGet(projectName + '/nodes/' + uuid, queryParams);
        }

        /**
         * Create or update the node object on the server.
         */
        public persistNode(projectName: string, node: INode, binaryFile?: File): ng.IPromise<INode> {
            let isNew = !node.hasOwnProperty('created');
            this.clearCache('contents');
            return isNew ? this.createNode(projectName, node, binaryFile) : this.updateNode(projectName, node, binaryFile);

        }
        private createNode(projectName: string, node: INode, binaryFile?: File): ng.IPromise<INode> {
            return this.meshPost(projectName + '/nodes', node)
                .then(newNode => {
                    if (typeof binaryFile !== 'undefined') {
                        return this.uploadBinaryFile(projectName, newNode, binaryFile, 'POST');
                    } else {
                        return newNode;
                    }
                });
        }
        private updateNode(projectName: string, node: INode, binaryFile?: File): ng.IPromise<INode> {
            return this.meshPut(projectName + '/nodes/' + node.uuid, node)
                .then(newNode => {
                    if (typeof binaryFile !== 'undefined') {
                        return this.uploadBinaryFile(projectName, newNode, binaryFile, 'PUT');
                    } else {
                        return newNode;
                    }
                });
        }

        private uploadBinaryFile(projectName: string, node: INode, binaryFile: File, method: string = 'POST'): ng.IPromise<INode> {
            return this.Upload.upload({
                    url: this.apiUrl + projectName + '/nodes/' + node.uuid + '/bin',
                    method: method,
                    data: {
                        file: binaryFile,
                        filename: binaryFile.name
                    }
                })
                .then(() => {
                    // re-get the node as it will now contain the correct binaryProperties, fileName etc.
                    return this.getNode(projectName, node.uuid);
                });
        }

        /**
         * Remove the content from the server.
         */
        public deleteNode(projectName: string, node: INode|string): ng.IPromise<any> {
            this.clearCache('contents');
            let uuid = this.toUuid(node);
            return this.meshDelete(projectName + '/nodes/' + uuid);
        }

        /**
         * Delete multiple nodes in sequence. Returns the node uuids that were deleted.
         */
        public deleteNodes(projectName: string, nodes: INode[]|string[]): ng.IPromise<string[]> {
            let uuids = this.toUuids(nodes),
                uuidsClone = uuids.slice(0);

            return this.$q.when(this.deleteNext(projectName, uuids))
                .then(() => uuidsClone);
        }

        /**
         * Recursively deletes the selected content items as specified by the indices in the
         * this.selectedItems array. Done recursively in order to allow each DELETE request to
         * complete before sending the next. When done in parallel, deleting more than a few
         * items at once causes server error.
         */
        private deleteNext(projectName: string, uuids: string[] = []): ng.IPromise<any> {
            if (uuids.length === 0) {
                return;
            } else {
                var uuid = uuids.pop();
                return this.deleteNode(projectName, uuid)
                    .then(() => this.deleteNext(projectName, uuids));
            }
        }

        /**
         * Move a node to be a child of another node given by uuid.
         */
        public moveNode(projectName: string, node: INode|string, destinationUuid: string): ng.IPromise<any> {
            this.clearCache('contents');
            let uuid = this.toUuid(node);
            return this.meshPut(projectName + '/nodes/' + uuid + '/moveTo/' + destinationUuid, {});
        }

        /**
         * Recursively moves a list of nodes to the destination node given by uuid.
         */
        public moveNodes(projectName: string, nodes: (INode|string)[], destinationUuid: string): ng.IPromise<string[]> {
            let uuids = this.toUuids(nodes),
                uuidsClone = uuids.slice(0);

            return this.$q.when(this.moveNext(projectName, destinationUuid, uuids))
                .then(() => uuidsClone);
        }

        /**
         * Recursively move nodes to a destination node.
         */
        private moveNext(projectName: string, destinationUuid: string, uuids: string[] = []): ng.IPromise<any> {
            if (uuids.length === 0) {
                return;
            } else {
                var uuid = uuids.pop();
                return this.moveNode(projectName, uuid, destinationUuid)
                    .then(() => this.moveNext(projectName, destinationUuid, uuids));
            }
        }

        /**
         * Takes an array of either uuid strings or nodes, and returns an array of uuid strings.
         */
        private toUuids(nodes: (INode|string)[]): string[] {
            return nodes.map(node => this.toUuid(node))
        }

        /**
         * Takes either a node or a uuid string, and returns a uuid string.
         */
        private toUuid(node: INode|string): string {
            return (typeof node === 'string') ? node : node.uuid;
        }

        /**
         */
        public getTagFamilies(projectName, queryParams?): ng.IPromise<IListResponse<ITagFamily>> {
            var url = projectName + '/tagFamilies';
            return this.meshGet(url, queryParams);
        }
        public persistTagFamily(projectName: string, tagFamily: ITagFamily): ng.IPromise<ITagFamily> {
            let isNew = !tagFamily.hasOwnProperty('created');
            this.clearCache('tagFamilies');
            return isNew ? this.createTagFamily(projectName, tagFamily) : this.updateTagFamily(projectName, tagFamily)
        }
        private createTagFamily(projectName: string, tagFamily: ITagFamily): ng.IPromise<ITagFamily> {
            return this.meshPost(projectName + '/tagFamilies', tagFamily);
        }
        private updateTagFamily(projectName: string, tagFamily: ITagFamily): ng.IPromise<ITagFamily> {
            return this.meshPut(projectName + '/tagFamilies/' + tagFamily.uuid, tagFamily);
        }


        /**
         *
         */
        public getTags(projectName, tagFamilyUuid?, queryParams?):ng.IPromise<any> {
            var url;
            if (typeof tagFamilyUuid === 'undefined') {
                url = projectName + '/tags/';
            } else {
                url = projectName + '/tagFamilies/' + tagFamilyUuid + '/tags/';
            }
            return this.meshGet(url, queryParams);
            // TODO: use the search code below one the elasticsearch index allows us to query tag.project.name
            /*let query: ISearchQuery = {
             filter: {
             bool: {
             must: [
             { "term": { "project.name": projectName.toLowerCase() } }
             ]
             }
             },
             sort: [
             { "tagFamily.name": "asc" },
             { "fields.name": "asc" }
             ]
             };

             if (tagFamilyUuid) {
             query.filter.bool.must.push({ "term": { "tagFamily.uuid": tagFamilyUuid } });
             }
             return this.searchTags(query, queryParams);*/
        }

        public searchTags(query : ISearchQuery, queryParams?: INodeListQueryParams): ng.IPromise<IListResponse<ITag>>  {
            return this.meshPost('search/tags', query, queryParams);
        }

        public persistTag(projectName: string, tag: ITag): ng.IPromise<ITag> {
            let isNew = !tag.hasOwnProperty('created');
            this.clearCache('tags');
            return isNew ? this.createTag(projectName, tag) : this.updateTag(projectName, tag)
        }
        private createTag(projectName: string, tag: ITag): ng.IPromise<ITag> {
            return this.meshPost(projectName + '/tags', tag);
        }
        private updateTag(projectName: string, tag: ITag): ng.IPromise<ITag> {
            return this.meshPut(projectName + '/tags/' + tag.uuid, tag);
        }

        public addTagToNode(projectName: string, node: INode, tag: ITag): ng.IPromise<any> {
            return this.meshPut(projectName + '/nodes/' + node.uuid + '/tags/' + tag.uuid, {});
        }
        public removeTagFromNode(projectName: string, node: INode, tag: ITag): ng.IPromise<any> {
            return this.meshDelete(projectName + '/nodes/' + node.uuid + '/tags/' + tag.uuid, {});
        }

        /**
         * Get all the schemas available in Mesh.
         */
        public getSchemas(queryParams?):ng.IPromise<IListResponse<ISchema>> {
            return this.meshGet('schemas', queryParams);
        }

        public getProjectSchemas(projectName: string): ng.IPromise<IListResponse<ISchema>> {
            return this.meshGet(projectName + '/schemas');
        }

        /**
         * Get a list of schemas which are used by the children of a given node.
         */
        public getNodeChildrenSchemas(uuid: string): ng.IPromise<IListResponse<ISchema>> {
            // TODO: there will be a proper Mesh API for this. for now just get all of them.
            return this.getSchemas();
        }

        /**
         *
         */
        public getSchema(uuid, queryParams?):ng.IPromise<ISchema> {
            return this.meshGet('schemas/' + uuid, queryParams);
        }

        public addSchemaToProject(schemaUuid: string, projectUuid: string): ng.IPromise<any> {
            return this.meshPut('schemas/' + schemaUuid + '/projects/' + projectUuid, {});
        }
        public removeSchemaFromProject(schemaUuid: string, projectUuid: string): ng.IPromise<any> {
            return this.meshDelete('schemas/' + schemaUuid + '/projects/' + projectUuid);
        }

        public persistSchema(schema: ISchema): ng.IPromise<ISchema> {
            let isNew = !schema.hasOwnProperty('created');
            this.clearCache('schemas');
            return isNew ? this.createSchema(schema) : this.updateSchema(schema);

        }
        private createSchema(schema: ISchema): ng.IPromise<ISchema> {
            return this.meshPost('schemas', schema);
        }
        private updateSchema(schema: ISchema): ng.IPromise<ISchema> {
            return this.meshPut('schemas/' + schema.uuid, schema);
        }

        public deleteSchema(schema: ISchema): ng.IPromise<ISchema> {
            this.clearCache('schemas');
            return this.meshDelete('schemas/' + schema.uuid);
        }


        /**
         * TODO: not yet implemented in Mesh.
         */
        public getMicroschemas(queryParams?):ng.IPromise<any> {
            return this.meshGet('microschemas', queryParams);
        }

        /**
         * Get a microschema by name
         */
        public getMicroschema(name, queryParams?):ng.IPromise<any> {
            return this.meshGet('microschemas/' + name, queryParams);
        }

        /**
         *
         */
        public getRoles(queryParams?):ng.IPromise<any> {
            return this.meshGet('roles', queryParams);
        }
        public getRole(uuid, queryParams?):ng.IPromise<any> {
            return this.meshGet('roles/' + uuid, queryParams);
        }
        public persistRole(role: IUserRole): ng.IPromise<IUserRole> {
            let isNew = !role.hasOwnProperty('created');
            this.clearCache('roles');
            return isNew ? this.createRole(role) : this.updateRole(role);
        }
        private createRole(role: IUserRole): ng.IPromise<IUserRole> {
            return this.meshPost('roles', role);
        }
        private updateRole(role: IUserRole): ng.IPromise<IUserRole> {
            return this.meshPut('roles/' + role.uuid, role);
        }
        public deleteRole(role: IUserRole): ng.IPromise<any> {
            return this.meshDelete('roles/' + role.uuid);
        }


        /**
         * Permissions setting methods
         */
        public setNodePermissions(roleUuid: string, projectUuid: string, nodeUuid: string, permissions: IPermissionsRequest): ng.IPromise<any> {
            return this.setPermissionsOnPath(roleUuid, 'projects/' + projectUuid + '/nodes/' + nodeUuid, permissions);
        }
        public setProjectPermissions(roleUuid: string, permissions: IPermissionsRequest, projectUuid?: string): ng.IPromise<any> {
            return this.setPermissionsOnRootOrNode('projects', roleUuid, permissions, projectUuid);
        }
        public setSchemaPermissions(roleUuid: string, permissions: IPermissionsRequest, schemaUuid?: string): ng.IPromise<any> {
            return this.setPermissionsOnRootOrNode('schemas', roleUuid, permissions, schemaUuid);
        }
        public setUserPermissions(roleUuid: string, permissions: IPermissionsRequest, userUuid?: string): ng.IPromise<any> {
            return this.setPermissionsOnRootOrNode('users', roleUuid, permissions, userUuid);
        }
        public setGroupPermissions(roleUuid: string, permissions: IPermissionsRequest, groupUuid?: string): ng.IPromise<any> {
            return this.setPermissionsOnRootOrNode('groups', roleUuid, permissions, groupUuid);
        }
        public setRolePermissions(roleUuid: string, permissions: IPermissionsRequest, targetRoleUuid?: string): ng.IPromise<any> {
            return this.setPermissionsOnRootOrNode('roles', roleUuid, permissions, targetRoleUuid);
        }

        /**
         * Sets the permissions on a particular node if specified by a uuid, else sets the permissions on the
         * root (aggregation) node for that type as given by pathBase.
         */
        private setPermissionsOnRootOrNode(pathBase: string,
                                           roleUuid: string,
                                           permissions: IPermissionsRequest,
                                           nodeUuid?: string): ng.IPromise<any> {
            let path = nodeUuid ? `${pathBase}/${nodeUuid}` : pathBase;
            return this.setPermissionsOnPath(roleUuid, path, permissions);
        }

        private setPermissionsOnPath(roleUuid: string, path: string, permissions: IPermissionsRequest): ng.IPromise<any> {
            return this.meshPut('roles/' + roleUuid + '/permissions/' + path, permissions);
        }



        /**
         *
         */
        public getBreadcrumb(project: IProject, currentNode: INode):ng.IPromise<INode[]> {
            //return this.meshGet(projectName + '/breadcrumb/' + uuid);

            /**
             * TODO: implement dedicated breadcrumbs endpoint when one becomes available.
             * This is a recursive promise-based solution which is inefficient in that it
             * needs to make a call for each level of the breadcrumb hierarchy.
             */
            const getBreadcrumbs = (project: IProject, currentNode:INode, breadcrumbs: any = []): ng.IPromise<INode[]> => {
                let complete = breadcrumbs;
                breadcrumbs.push(currentNode);

                if (currentNode.parentNode && currentNode.parentNode.uuid !== project.rootNodeUuid) {
                    complete = this.getNode(project.name, currentNode.parentNode.uuid)
                        .then(node => getBreadcrumbs(project, node, breadcrumbs));
                }

                return this.$q.when(complete);
            };

            return getBreadcrumbs(project, currentNode);
        }

        /**
         * Sort function to be used with array.sort()
         */
        private sortNodesBySchemaName(a: INode, b: INode): number {
            if (a.schema.name < b.schema.name) {
                return -1;
            }
            if (a.schema.name > b.schema.name) {
                return 1;
            }
            return 0;
        }

        /**
         * Clear the $http cache of all keys matching groupName. Proper use of this method
         * depends on the use of the selectiveCache service, which allows selective removal
         * of only certain groups of cached keys at a time. The groupName parameter must
         * match a groupName registered with the `selectiveCacheProvider.setCacheableGroups()`
         * config method.
         */
        private clearCache(groupName:string) {
            this.selectiveCache.remove(groupName);
        }
    }

    /**
     * Configure the dataService
     *
     * @param $httpProvider
     * @param selectiveCacheProvider
     */
    function dataServiceConfig($httpProvider, selectiveCacheProvider) {

        $httpProvider.interceptors.push(languageRequestInterceptor);

        // define the urls we wish to cache
        var projectName = '^[a-zA-Z\\-]*',
            uuid = '[a-z0-9]{30,32}',
            _ = '\\/',
            projectNameTags = projectName + _ + 'tags' + _ + uuid + _;

        var cacheable = {
            'projects': /^projects/,
            'contents': new RegExp(projectName + _ + 'nodes\\/', 'gi'),
            'tags': new RegExp(projectNameTags + 'tags\\/', 'gi'),
            'tag': new RegExp(projectName + _ + 'tags' + _ + uuid, 'gi'),
            'schemas': /^schemas\??/,
            'schema': /^schemas\/[a-z0-9]+/,
            'users': /^users\??/,
            'user': /^users\/[a-z0-9]+/,
            'roles': /^roles\??/,
            'role': /^roles\/[a-z0-9]+/,
        };
        selectiveCacheProvider.setCacheableGroups(cacheable);
    }

    function languageRequestInterceptor(i18nService) {
        return {
            request: function (config) {
                // TODO: need to read the API URL from the config file
                if (config.url.indexOf('/api') > -1) {
                    config.params = config.params || {};
                    config.params.lang = i18nService.getCurrentLang().code;
                }
                return config;
            }
        };
    }

}