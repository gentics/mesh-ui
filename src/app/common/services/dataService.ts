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

    export interface ISearchQuery {
        sort? : any;
        query? : any;
        filter? : any;
    }

    export interface INodeQueryParams {
        expand?: string;
        expandAll?: boolean;
        lang?: string;
        role?: string;
    }

    export interface INodeListQueryParams extends INodeQueryParams {
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
        public getUsers(queryParams?: INodeListQueryParams): ng.IPromise<any> {
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
        public getGroups(queryParams?: INodeListQueryParams):ng.IPromise<any> {
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
                              searchParams: INodeSearchParams,
                              queryParams?: INodeListQueryParams): ng.IPromise<INodeBundleResponse[]> {

            const sortByIsContainer = (a: INodeBundleParams, b: INodeBundleParams): number => {
                if (a.schema.container === true && b.schema.container === false) {
                    return -1;
                } else if (a.schema.container === false && b.schema.container === true) {
                    return 1;
                }
                return 0;
            };

            let searchOperation;

            if (searchParams.searchAll) {
                const searchAll = () => {
                    let query = this.createNodeSearchQuery(projectName, node, searchParams);
                    let bundleQueryParams = angular.extend(queryParams, { page: bundleParams[0].page });
                    return this.searchNodes(query, bundleQueryParams);
                };
                searchOperation = [searchAll()];
            } else {
                searchOperation = bundleParams
                    .sort(sortByIsContainer)
                    .map(bundleParam => {
                        let query = this.createNodeSearchQuery(projectName, node, searchParams, bundleParam);
                        let bundleQueryParams = angular.extend(queryParams, { page: bundleParam.page });
                        return this.searchNodes(query, bundleQueryParams);
                    });
            }

            return this.$q.all(searchOperation)
                .then(results => {
                    return results
                        .map((listResponse: IListResponse<INode>, index: number) => {
                            return angular.extend(listResponse, { schema: bundleParams[index].schema });
                        })
                        .filter(bundle => 0 < bundle.data.length);
                });
        }

        private createNodeSearchQuery(projectName: string,
                                      node: INode,
                                      searchParams: INodeSearchParams,
                                      bundleParam?: INodeBundleParams): ISearchQuery {
            let query: ISearchQuery = {
                filter: {
                    bool: {
                        must: [
                            { "term": { "project.name": projectName.toLowerCase() } },
                            { "term": { "language": this.i18nService.getCurrentLang().code.toLowerCase() } }
                        ]
                    }
                },
                sort: [
                    { "created": "asc" }
                ]
            };

            if (bundleParam && bundleParam.schema) {
                query.filter.bool.must.push({ "term": { "schema.uuid": bundleParam.schema.uuid } });
            }

            if (!searchParams.searchAll) {
                query.filter.bool.must.push({ "term": { "parentNode.uuid": node.uuid } });
            }

            if (searchParams.searchTerm && searchParams.searchTerm !== '') {
                //let displayField = 'fields.' + bundleParam.schema.displayField;
                query.query = {
                    /* "wildcard": { [displayField] : searchParams.searchTerm.toLowerCase() + '*' }*/
                    "query_string": {
                        "query": 'displayField.value' + ":" + searchParams.searchTerm.toLowerCase() + '*'
                    }
                };
            }

            if (searchParams.tagFilters && 0 < searchParams.tagFilters.length) {
                query.filter.bool.must.push({
                    "terms" : {
                        "tags.name" : searchParams.tagFilters.map((tag: ITag) => tag.fields.name.toLowerCase()),
                        "execution" : "and"
                    }
                });
            }

            return query;
        }

        public searchNodes(query : ISearchQuery, queryParams?: INodeListQueryParams): ng.IPromise<IListResponse<INode>>  {
            return this.meshPost('search/nodes', query, queryParams);
        }

        /**
         * Get a single node.
         */
        public getNode(projectName, uuid, queryParams?: INodeQueryParams):ng.IPromise<any> {
            queryParams = queryParams || {};
            queryParams.lang = this.i18nService.languages.map(lang => lang.code).join(',');
            return this.meshGet(projectName + '/nodes/' + uuid, queryParams);
        }

        /**
         * Create or update the node object on the server.
         */
        public persistNode(projectName: string, node: INode, queryParams?: INodeQueryParams): ng.IPromise<INode> {
            let isNew = !node.hasOwnProperty('created');
            this.clearCache('nodes');
            return isNew ? this.createNode(projectName, node, queryParams) : this.updateNode(projectName, node, queryParams);

        }
        private createNode(projectName: string, node: INode, queryParams?: INodeQueryParams): ng.IPromise<INode> {
            return this.meshPost(projectName + '/nodes', node, queryParams)
                .then(newNode => {
                    return this.uploadBinaryFields(projectName, node.fields, newNode.uuid, 'POST')
                        .then(result => {
                            if (result === false) {
                                // no uploads were required
                                return newNode;
                            } else {
                                return result;
                            }
                        })
                        .then(newNode => {
                            return this.transformBinaryFields(projectName, node.fields, newNode.uuid)
                                .then(() => newNode);
                        });
                });
        }
        private updateNode(projectName: string, node: INode, queryParams?: INodeQueryParams): ng.IPromise<INode> {
            return this.meshPut(projectName + '/nodes/' + node.uuid, node, queryParams)
                .then(newNode => {
                    return this.uploadBinaryFields(projectName, node.fields, newNode.uuid, 'PUT')
                        .then(result => {
                            if (result === false) {
                                // no uploads were required
                                return newNode;
                            } else {
                                return result;
                            }
                        })
                        .then(newNode => {
                            return this.transformBinaryFields(projectName, node.fields, newNode.uuid)
                                .then(() => newNode);
                        });
                });
        }

        /**
         * Given a node, inspect each field for any that have a File value. This means a file has been selected
         * in the editor for upload.
         */
        private uploadBinaryFields(projectName: string, fields: INodeFields, nodeUuid: string, method: string): ng.IPromise<any> {
            let binaryFields = Object.keys(fields)
                .filter(key => fields[key] instanceof File)
                .map(key => {
                    return {
                        name: key,
                        file: fields[key]
                    };
                });

            if (0 < binaryFields.length) {
                let uploads = binaryFields
                    .map(field => this.uploadBinaryFile(projectName, nodeUuid, field.name, field.file, method));

                return this.$q.all(uploads)
                    // re-get the node as it will now contain the correct binary field properties.
                    .then(() => this.getNode(projectName, nodeUuid));
            } else {
                return this.$q.when(false);
            }
        }

        /**
         * Uploads a binary file to a specified field of a node.
         */
        private uploadBinaryFile(projectName: string, nodeUuid: string, fieldName: string, binaryFile: File, method: string = 'POST'): ng.IPromise<INode> {
            let lang = this.i18nService.getCurrentLang().code;
            return this.Upload.upload({
                url: this.apiUrl + projectName + `/nodes/${nodeUuid}/languages/${lang}/fields/${fieldName}`,
                method: method,
                data: {
                    file: binaryFile,
                    filename: binaryFile.name
                }
            });
        }

        /**
         * Check for any binary fields that have a `transform` property, and make a binary transform request
         * for any found.
         */
        private transformBinaryFields(projectName: string, fields: INodeFields, nodeUuid: string): ng.IPromise<any> {
            const isBinary = obj => obj.type === 'binary' || obj instanceof File;
            const hasTransform = obj => obj.hasOwnProperty('transform') && 0 < Object.keys(obj.transform).length;

            let binaryFieldsWithTransform = Object.keys(fields)
                .filter(key => fields[key] && isBinary(fields[key]) && hasTransform(fields[key]))
                .map(key => {
                    return {
                        name: key,
                        value: fields[key]
                    };
                });

            if (0 < binaryFieldsWithTransform.length) {
                let promises = binaryFieldsWithTransform
                    .map(field => this.transformBinary(projectName, nodeUuid, field.name, field.value.transform));

                return this.$q.all(promises);
            } else {
                return this.$q.when(false);
            }
        }

        /**
         * Send a POST request to a binary field's `transform` endpoint.
         */
        public transformBinary(projectName: string, nodeUuid: string, fieldName: string, transformParams: IImageTransformParams): ng.IPromise<any> {
            let lang = this.i18nService.getCurrentLang().code;
            let params = angular.copy(transformParams);
            // set the width and height of the image in pixels according to
            // the crop and scale data.
            params.width = params.cropw * params.scale;
            params.height = params.croph * params.scale;

            return this.meshPost(projectName + `/nodes/${nodeUuid}/languages/${lang}/fields/${fieldName}/transform`, params);
        }

        /**
         * Remove the content from the server.
         */
        public deleteNode(projectName: string, node: INode|string): ng.IPromise<any> {
            this.clearCache('nodes');
            let uuid = this.toUuid(node);
            return this.meshDelete(projectName + '/nodes/' + uuid);
        }

        public deleteNodeLanguage(projectName: string, node: INode|string, langCode: string): ng.IPromise<any> {
            this.clearCache('nodes');
            let uuid = this.toUuid(node);
            return this.meshDelete(projectName + '/nodes/' + uuid + '/languages/' + langCode);
        }

        /**
         * Delete multiple nodes in sequence. Returns the node uuids that were deleted.
         */
        public deleteNodes(projectName: string, nodes: INode[]|string[], deleteAllLanguages: boolean = false): ng.IPromise<string[]> {
            let uuids = this.toUuids(nodes),
                uuidsClone = uuids.slice(0);

            return this.$q.when(this.deleteNext(projectName, uuids, deleteAllLanguages))
                .then(() => uuidsClone);
        }

        /**
         * Recursively deletes the selected content items as specified by the indices in the
         * this.selectedItems array. Done recursively in order to allow each DELETE request to
         * complete before sending the next. When done in parallel, deleting more than a few
         * items at once causes server error.
         */
        private deleteNext(projectName: string, uuids: string[] = [], deleteAllLanguages?: boolean): ng.IPromise<any> {
            if (uuids.length === 0) {
                return;
            } else {
                let uuid = uuids.pop();
                let deleteOperation;

                if (deleteAllLanguages === true) {
                    deleteOperation = () => this.deleteNode(projectName, uuid);
                } else {
                    deleteOperation = () => this.deleteNodeLanguage(projectName, uuid, this.i18nService.getCurrentLang().code);
                }
                return deleteOperation().then(() => this.deleteNext(projectName, uuids, deleteAllLanguages));
            }
        }

        /**
         * Move a node to be a child of another node given by uuid.
         */
        public moveNode(projectName: string, node: INode|string, destinationUuid: string): ng.IPromise<any> {
            this.clearCache('nodes');
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
         * Given a string, this method sends it to the Mesh Link Resolver
         * utility endpoint and returns the text with rendered links.
         */
        public renderLinksInText(contents: string, resolveMode: string): ng.IPromise<string> {
            return this.meshPost(`utilities/linkResolver?resolveLinks=${resolveMode.toUpperCase()}`, contents);
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

        public deleteTagFamily(projectName: string, tagFamily: ITagFamily): ng.IPromise<any> {
            return this.meshDelete(projectName + '/tagFamilies/' + tagFamily.uuid);
        }


        /**
         * Get all tags in a given project.
         */
        public getProjectTags(projectName: string, queryParams?): ng.IPromise<ITag[]> {
            return this.getTagFamilies(projectName, queryParams)
                .then(response => {
                    let promises = response.data.map((tagFamily: ITagFamily) => {
                        return this.getTagFamilyTags(projectName, tagFamily.uuid);
                    });
                    return this.$q.all(promises)
                        .then(responses => {
                            const flatten = arr => arr.reduce((arr, t) => arr.concat(t), []);
                            return flatten(responses.map((res: any) => res.data));
                        });
                });
        }

        public getTagFamilyTags(projectName: string, tagFamilyUuid: string, queryParams?): ng.IPromise<IListResponse<ITag>> {
            var url;
            if (typeof tagFamilyUuid === 'undefined') {
                url = projectName + '/tags';
            } else {
                url = projectName + '/tagFamilies/' + tagFamilyUuid + '/tags';
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
            return this.meshPost(`${projectName}/tagFamilies/${tag.tagFamily.uuid}/tags`, tag);
        }
        private updateTag(projectName: string, tag: ITag): ng.IPromise<ITag> {
            return this.meshPut(`${projectName}/tagFamilies/${tag.tagFamily.uuid}/tags/${tag.uuid}`, tag);
        }

        public deleteTag(projectName: string, tag: ITag): ng.IPromise<any> {
            this.clearCache('tags');
            return this.meshDelete(`${projectName}/tagFamilies/${tag.tagFamily.uuid}/tags/${tag.uuid}`);
        }

        public addTagToNode(projectName: string, node: INode, tag: ITag): ng.IPromise<any> {
            this.clearCache('nodes');
            return this.meshPut(projectName + '/nodes/' + node.uuid + '/tags/' + tag.uuid, {});
        }
        public removeTagFromNode(projectName: string, node: INode, tag: ITag): ng.IPromise<any> {
            this.clearCache('nodes');
            return this.meshDelete(projectName + '/nodes/' + node.uuid + '/tags/' + tag.uuid, {});
        }

        /**
         * Get all the schemas available in Mesh.
         */
        public getSchemas(queryParams?: INodeListQueryParams):ng.IPromise<IListResponse<ISchema>> {
            return this.meshGet('schemas', queryParams);
        }

        public getProjectSchemas(projectName: string): ng.IPromise<IListResponse<ISchema>> {
            return this.meshGet(projectName + '/schemas');
        }

        /**
         *
         */
        public getSchema(uuid: string, queryParams?):ng.IPromise<ISchema> {
            return this.meshGet('schemas/' + uuid, queryParams);
        }

        public addSchemaToProject(schemaUuid: string, projectUuid: string): ng.IPromise<any> {
            this.clearCache('schemas');
            return this.meshPut('schemas/' + schemaUuid + '/projects/' + projectUuid, {});
        }
        public removeSchemaFromProject(schemaUuid: string, projectUuid: string): ng.IPromise<any> {
            this.clearCache('schemas');
            return this.meshDelete('schemas/' + schemaUuid + '/projects/' + projectUuid);
        }

        public diffSchema(schema: ISchema): ng.IPromise<ISchemaChangeset> {
            return this.meshPost(`schemas/${schema.uuid}`, schema);
        }

        public applySchemaChangeset(schema: ISchema, changeset: ISchemaChangeset): ng.IPromise<any> {
            return this.meshPost(`schemas/${schema.uuid}/changes`, changeset);
        }
        public createSchema(schema: ISchema): ng.IPromise<ISchema> {
            this.clearCache('schemas');
            return this.meshPost('schemas', schema);
        }

        /**
         * Forces a schema update without doing a migration. Dangerous as data can be lost or corrupted.
         */
        public forceSchemaUpdate(schema: ISchema): ng.IPromise<ISchema> {
            this.clearCache('schemas');
            return this.meshPut('schemas/' + schema.uuid, schema);
        }

        public deleteSchema(schema: ISchema): ng.IPromise<ISchema> {
            this.clearCache('schemas');
            return this.meshDelete('schemas/' + schema.uuid);
        }


        /**
         * Microschema methods
         */
        public getMicroschemas(queryParams?): ng.IPromise<IListResponse<IMicroschema>> {
            return this.meshGet('microschemas', queryParams);
        }

        public getMicroschema(uuid: string, queryParams?):ng.IPromise<IMicroschema> {
            return this.meshGet('microschemas/' + uuid, queryParams);
        }

        public getMicroschemaByName(name: string, queryParams?): ng.IPromise<IMicroschema> {
            return this.getMicroschemas(queryParams)
                .then(response => response.data.filter(microschema => microschema.name === name)[0]);
        }


        public diffMicroschema(microschema: IMicroschema): ng.IPromise<ISchemaChangeset> {
            return this.meshPost(`microschemas/${microschema.uuid}/diff`, microschema);
        }

        public applyMicroschemaChangeset(microschema: IMicroschema, changeset: ISchemaChangeset): ng.IPromise<any> {
            // TODO: API not yet implemented
            console.warn('Not yet implemented in API');
            return this.meshPost(`microschemas/${microschema.uuid}/changes`, changeset);
        }

        public createMicroschema(microschema: IMicroschema): ng.IPromise<IMicroschema> {
            this.clearCache('microschemas');
            return this.meshPost('microschemas', microschema);
        }
        /**
         * Forces a microschema update without doing a migration. Dangerous as data can be lost or corrupted.
         */
        public forceMicroschemaUpdate(microschema: IMicroschema): ng.IPromise<IMicroschema> {
            this.clearCache('microschemas');
            return this.meshPut('microschemas/' + microschema.uuid, microschema);
        }

        public deleteMicroschema(microschema: IMicroschema): ng.IPromise<IMicroschema> {
            this.clearCache('microschemas');
            return this.meshDelete('microschemas/' + microschema.uuid);
        }

        /**
         *
         */
        public getRoles(queryParams?: INodeListQueryParams):ng.IPromise<any> {
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
            this.clearCache('roles');
            return this.meshDelete('roles/' + role.uuid);
        }


        /**
         * Permissions methods
         */
        public getPermissions(roleUuid: string, path: string) {
            return this.meshGet('roles/' + roleUuid + '/permissions/' + path);
        }

        public setNodePermissions(roleUuid: string, projectUuid: string, nodeUuid: string, permissions: IPermissionsRequest): ng.IPromise<any> {
            this.clearCache('nodes');
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
        public setTagPermissions(roleUuid: string, projectUuid: string, permissions: IPermissionsRequest, tag: ITag): ng.IPromise<any> {
            this.clearCache('tags');
            let path = 'projects/' + projectUuid + '/tagFamilies/' + tag.tagFamily.uuid + '/tags/' + tag.uuid;
            return this.setPermissionsOnPath(roleUuid, path, permissions);
        }
        public setTagFamilyPermissions(roleUuid: string, projectUuid: string, permissions: IPermissionsRequest, tagFamilyUuid?: string): ng.IPromise<any> {
            this.clearCache('tags');
            let pathBase = 'projects/' + projectUuid + '/tagFamilies';
            let path = tagFamilyUuid ? `${pathBase}/${tagFamilyUuid}` : pathBase;
            return this.setPermissionsOnPath(roleUuid, path, permissions);
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
            _ = '\\/';

        var cacheable = {
            'projects': /^projects/,
            'nodes': new RegExp(projectName + _ + 'nodes\\/', 'gi'),
            'tags': new RegExp(projectName + _ + 'tagFamilies\\/?', 'gi'),
            'schemas': /\/?schemas\??/,
            'microschemas': /^microschemas\??/,
            'users': /^users\??/,
            'roles': /^roles\??/,
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