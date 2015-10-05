module meshAdminUi {


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
        this.$get = function ($http, $q, selectiveCache, i18nService) {
            return new DataService($http, $q, selectiveCache, i18nService, apiUrl);
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
    class DataService {

        constructor(private $http:ng.IHttpService,
                    private $q:ng.IQService,
                    private selectiveCache,
                    private i18nService,
                    private apiUrl) {
            selectiveCache.setBaseUrl(apiUrl);
            $http.defaults.cache = selectiveCache;
        }


        private meshGet(url:string, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);

            return this.$http.get(this.apiUrl + url, config)
                .then(function (response) {
                    return response.data;
                });
        }

        private meshPut(url:string, data:any, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.put(this.apiUrl + url, data, config);
        }

        private meshPost(url:string, data:any, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.post(this.apiUrl + url, data, config);
        }

        private meshDelete(url:string, params?:any, config?:any):ng.IPromise<any> {
            config = this.makeConfigObject(params, config);
            return this.$http.delete(this.apiUrl + url, config);
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
        public getProjects(queryParams?:any):ng.IPromise<any> {
            return this.meshGet('projects', queryParams);
        }

        /**
         * Get the details of a single project specified by uuid.
         */
        public getProject(uuid:string, queryParams:any):ng.IPromise<any> {
            return this.meshGet('projects/' + uuid, queryParams);
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
        public getUsers(queryParams):ng.IPromise<any> {
            return this.meshGet('users', queryParams);
        }

        /**
         *
         */
        public getUser(uuid, queryParams):ng.IPromise<any> {
            return this.meshGet('users/' + uuid, queryParams);
        }

        /**
         * Persist the user back to the server.
         */
        public persistUser(user):ng.IPromise<any> {
            this.clearCache('users');
            if (user.hasOwnProperty('save')) {
                // this is a Restangular object
                return this.meshPut('users', user);
            } else {
                // this is a plain object (newly-created)
                return this.meshPost('users', user);
            }
        }

        /**
         *
         */
        public deleteUser(user):ng.IPromise<any> {
            this.clearCache('users');
            return this.meshDelete('users/' + user.uuid);
        }

        public addUserToGroup(userId, groupId):ng.IPromise<any> {
            return this.meshPut('users/' + userId + '/groups/' + groupId, {});
        }

        public removeUserFromGroup(userId, groupId):ng.IPromise<any> {
            return this.meshDelete('users/' + userId + '/groups/' + groupId, {});
        }

        /**
         *
         */
        public getGroups(queryParams):ng.IPromise<any> {
            return this.meshGet('groups', queryParams);
        }

        /**
         * Get the child tags for the parentTag in the given project.
         */
        public getChildNodes(projectName, parentNodeId, queryParams):ng.IPromise<any> {
            var url = projectName + '/nodes/' + parentNodeId + '/children';
            return this.meshGet(url, queryParams);
        }

        /**
         *
         */
        public getChildFolders(projectName, parentNodeId, queryParams):ng.IPromise<any> {
            return this.getChildNodes(projectName, parentNodeId, queryParams)
                .then(response => {
                    return response.data.filter(node => node.hasOwnProperty('children'));
                });
        }

        /**
         *
         */
        public getChildContents(projectName, parentNodeId, queryParams):ng.IPromise<any> {
            return this.getChildNodes(projectName, parentNodeId, queryParams)
                .then(response => {
                    return response.data.filter(node => !node.hasOwnProperty('children'));
                });
        }

        /**
         * Get a single node.
         */
        public getNode(projectName, uuid, queryParams):ng.IPromise<any> {
            queryParams = queryParams || {};
            queryParams.lang = this.i18nService.languages.map(lang => lang.code).join(',');
            return this.meshGet(projectName + '/nodes/' + uuid, queryParams);
        }

        /**
         */
        public getTagFamilies(projectName, queryParams):ng.IPromise<any> {
            var url = projectName + '/tagFamilies/';
            return this.meshGet(url, queryParams);
        }

        /**
         *
         */
        public getTags(projectName, tagFamilyUuid, queryParams):ng.IPromise<any> {
            var url;
            if (typeof tagFamilyUuid === 'undefined') {
                url = projectName + '/tags/';
            } else {
                url = projectName + '/tagFamilies/' + tagFamilyUuid + '/tags/';
            }
            return this.meshGet(url, queryParams);
        }

        /**
         * Get the contents of a given project, with optional parameters that specifies query string options.
         */
        public getContents(projectName, parentTagId, queryParams):ng.IPromise<any> {
            var url = projectName + '/tags/' + parentTagId + '/contents/';
            return this.meshGet(url, queryParams)
                .then(result => this.unwrapCurrentLanguage(result));
        }

        /**
         * Get a single content record.
         */
        public getContent(projectName, uuid):ng.IPromise<any> {
            var queryParams = {
                lang: this.i18nService.languages.map(lang => lang.code).join(',')
            };
            return this.meshGet(projectName + '/nodes/' + uuid, queryParams);
        }

        /**
         * Create or update the content object on the server.
         */
        public persistContent(projectName, content):ng.IPromise<any> {
            this.clearCache('contents');
            if (content.hasOwnProperty('save')) {
                // this is a Restangular object
                return this.meshPut(projectName + '/nodes/' + content.uuid, content);
            } else {
                // this is a plain object (newly-created)
                return this.meshPost(projectName + '/nodes/', content);
            }
        }

        /**
         * Remove the content from the server.
         */
        public deleteContent(content):ng.IPromise<any> {
            this.clearCache('contents');
            return this.meshDelete(content.project + '/nodes/' + content.uuid);
        }

        /**
         *
         */
        public getSchemas(queryParams):ng.IPromise<any> {
            return this.meshGet('schemas', queryParams);
        }

        /**
         *
         */
        public getSchema(uuid, queryParams):ng.IPromise<any> {
            return this.meshGet('schemas/' + uuid, queryParams);
        }

        /**
         *
         */
        public getMicroschemas(queryParams):ng.IPromise<any> {
            return this.meshGet('microschemas', queryParams);
        }

        /**
         * Get a microschema by name
         */
        public getMicroschema(name, queryParams):ng.IPromise<any> {
            return this.meshGet('microschemas/' + name, queryParams);
        }

        /**
         *
         */
        public getRoles(queryParams):ng.IPromise<any> {
            return this.meshGet('roles', queryParams);
        }

        /**
         *
         */
        public getRole(uuid, queryParams):ng.IPromise<any> {
            return this.meshGet('roles/' + uuid, queryParams);
        }

        /**
         *
         */
        public getBreadcrumb(projectName, uuid):ng.IPromise<any> {
            return this.meshGet(projectName + '/breadcrumb/' + uuid);
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

        /**
         * Normalize the response to remove the extra language properties
         * and move the content of the currently-selected language up to
         * the "properties" level.
         *
         * @param data
         * @returns {*}
         */
        private unwrapCurrentLanguage(data) {
            var lang = this.i18nService.getCurrentLang().code;

            function extractCurrentLanguage(item) {
                if (item.properties && item.properties[lang]) {
                    item.properties = item.properties[lang];
                }
                return item;
            }

            if (data.constructor === Array) {
                data.forEach(extractCurrentLanguage);
            } else {
                extractCurrentLanguage(data);
            }

            return data;
        }

        /**
         * Re-wraps the object's "properties" in the current language, i.e. "properties" { ... }
         * becomes "properties" { "en": ... }
         * @param obj
         */
        private wrapCurrentLanguage(obj) {
            var properties = angular.copy(obj.properties),
                lang = this.i18nService.getCurrentLang().code;

            obj.properties = {};
            obj.properties[lang] = properties;
            return obj;
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
        $httpProvider.interceptors.push(listResponseInterceptor);

        // define the urls we wish to cache
        var projectName = '^\\/[a-zA-Z\\-]*',
            uuid = '[a-z0-9]{30,32}',
            _ = '\\/',
            projectNameTags = projectName + _ + 'tags' + _ + uuid + _;

        var cacheable = {
            'projects': /^\/projects/,
            'contents': new RegExp(projectNameTags + 'contents\\/', 'gi'),
            'tags': new RegExp(projectNameTags + 'tags\\/', 'gi'),
            'tag': new RegExp(projectName + _ + 'tags' + _ + uuid, 'gi'),
            'schemas': /^\/schemas$/,
            'schema': /^\/schemas\/[a-z0-9]+$/
        };
        selectiveCacheProvider.setCacheableGroups(cacheable);
    }

    /**
     * Extract the payload from the response, which is returned as the value of the "data" key.
     *
     * @param {Object} data
     * @param {string} operation
     * @returns {Object}
     */
    function listResponseInterceptor() {
        return {
            response: function (response) {
                if (response.data._metainfo) {
                    response.data.metadata = response.data._metainfo;
                    delete response.data._metainfo;
                }
                return response;
            }
        };
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