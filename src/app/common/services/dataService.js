angular.module('meshAdminUi.common')
    .config(dataServiceConfig)
    .provider('dataService', dataServiceProvider);

/**
 * The dataServiceProvider is used to configure and create the DataService which is used
 * for all requests to the API.
 */
function dataServiceProvider() {

    var apiUrl;

    this.setApiUrl = setApiUrl;
    this.$get = function($http, $q, selectiveCache, i18nService) {
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
 *
 * @param $http
 * @param $q
 * @param selectiveCache
 * @param i18nService
 * @param {string} apiUrl
 * @constructor
 */
function DataService($http, $q, selectiveCache, i18nService, apiUrl) {

    selectiveCache.setBaseUrl(apiUrl);
    $http.defaults.cache = selectiveCache;

    // public API
    // ==========
    // Projects
    this.getProjects = getProjects;
    this.getProject = getProject;
    this.persistProject = persistProject;
    this.deleteProject = deleteProject;
    this.getProjectId = getProjectId;
    this.getProjectRootNodeId = getProjectRootNodeId;
    // Users
    this.getUsers = getUsers;
    this.getUser = getUser;
    this.persistUser = persistUser;
    this.deleteUser = deleteUser;
    this.addUserToGroup = addUserToGroup;
    this.removeUserFromGroup = removeUserFromGroup;
    // Groups
    this.getGroups = getGroups;
    // Tags
    this.getTagFamilies = getTagFamilies;
    this.getTags = getTags;
    // Nodes
    this.getChildNodes = getChildNodes;
    this.getChildFolders = getChildFolders;
    this.getChildContents = getChildContents;
    this.getNode = getNode;
    // Contents
    this.getContents = getContents;
    this.getContent = getContent;
    this.persistContent = persistContent;
    this.deleteContent = deleteContent;
    // Schemas
    this.getSchemas = getSchemas;
    this.getSchema = getSchema;
    // Microschemas
    this.getMicroschemas = getMicroschemas;
    this.getMicroschema = getMicroschema;
    // Roles
    this.getRoles = getRoles;
    this.getRole = getRole;
    // Breadcrumbs
    this.getBreadcrumb = getBreadcrumb;


    function meshGet(url, params, config) {
        config = makeConfigObject(params, config);
        return $http.get(apiUrl + url, config)
            .then(function(response) {
                return response.data;
            })
    }

    function meshPut(url, data, params, config) {
        config = makeConfigObject(params, config);
        return $http.put(apiUrl + url, data, config);
    }

    function meshPost(url, data, params, config) {
        config = makeConfigObject(params, config);
        return $http.post(apiUrl + url, data, config);
    }

    function meshDelete(url, params, config) {
        config = makeConfigObject(params, config);
        return $http.delete(apiUrl + url, config);
    }

    function makeConfigObject(params, config) {
        params = params || {};
        params.lang = params.lang || i18nService.getCurrentLang().code;
        config = config || {};
        config.params = params;
        return config;
    }

    /**
     * Get all projects as a list.
     * @param {Object=} queryParams
     * @returns {*}
     */
    function getProjects(queryParams) {
        return meshGet('projects', queryParams);
    }

    /**
     * Get the details of a single project specified by uuid.
     *
     * @param {string} uuid
     * @param {Object=} queryParams
     * @returns {ng.IPromise<any>}
     */
    function getProject(uuid, queryParams) {
        return meshGet('projects/' + uuid, queryParams);
    }

    /**
     * Persist the project back to the server.
     *
     * @param project
     * @returns {*}
     */
    function persistProject(project) {
        clearCache('projects');
        clearCache('tags');
        if (project.hasOwnProperty('save')) {
            // this is a Restangular object
            return meshPut('projects', project);
        } else {
            // this is a plain object (newly-created)
            return meshPost('projects', project);
        }
    }

    /**
     * Delete the project from the server.
     * @param project
     * @returns {ng.IPromise<any>|restangular.IPromise<any>|void}
     */
    function deleteProject(project) {
        clearCache('projects');
        return meshDelete('projects/' + project.uuid);
    }

    /**
     * Get the uuid of the specified project.
     *
     * @param {string} projectName
     * @returns {ng.IPromise.<string>}
     */
    function getProjectId(projectName) {
        return getProjectProperty(projectName, 'uuid');
    }

    /**
     * Get the root tag uuid of the specified project.
     *
     * @param {string} projectName
     * @returns {ng.IPromise.<string>}
     */
    function getProjectRootNodeId(projectName) {
        return getProjectProperty(projectName, 'rootNodeUuid');
    }

    /**
     * Get the value of the specified property for a project matching
     * projectName. If no matching project is found, the promise is
     * rejected.
     *
     * @param {string} projectName
     * @param {string} propertyName
     * @returns {ng.IPromise<string>}
     */
    function getProjectProperty(projectName, propertyName) {
        var deferred = $q.defer();

        getProjects().then(function(projects) {
            var filtered = projects.data.filter(function(project) {
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
     * @param {Object=} queryParams
     * @returns {EnhancedCollectionPromise<any>|ICollectionPromise<any>}
     */
    function getUsers(queryParams) {
        return meshGet('users', queryParams);
    }

    /**
     *
     * @param {String} uuid
     * @param {Object=} queryParams
     * @returns {EnhancedPromise<any>|IPromise<any>}
     */
    function getUser(uuid, queryParams) {
        return meshGet('users/' + uuid, queryParams);
    }

    /**
     * Persist the user back to the server.
     *
     * @param user
     * @returns {*}
     */
    function persistUser(user) {
        clearCache('users');
        if (user.hasOwnProperty('save')) {
            // this is a Restangular object
            return meshPut('users', user);
        } else {
            // this is a plain object (newly-created)
           return meshPost('users', user);
        }
    }

    /**
     *
     * @param user
     */
    function deleteUser(user) {
        clearCache('users');
        return meshDelete('users/' + user.uuid);
    }

    function addUserToGroup(userId, groupId) {
        return meshPut('users/' + userId + '/groups/' + groupId, {});
    }

    function removeUserFromGroup(userId, groupId) {
        return meshDelete('users/' + userId + '/groups/' + groupId, {});
    }

    /**
     *
     * @param {Object=} queryParams
     * @returns {EnhancedCollectionPromise<any>|ICollectionPromise<any>}
     */
    function getGroups(queryParams) {
        return meshGet('groups', queryParams);
    }

    /**
     * Get the child tags for the parentTag in the given project.
     *
     * @param {string} projectName
     * @param parentNodeId
     * @param {Object=} queryParams
     * @returns {ng.IPromise<any>|restangular.ICollectionPromise<any>}
     */
    function getChildNodes(projectName, parentNodeId, queryParams) {
        var url = projectName + '/nodes/' + parentNodeId + '/children';
        return meshGet(url, queryParams);
    }

    /**
     *
     * @param projectName
     * @param parentNodeId
     * @param queryParams
     * @returns {IPromise<TResult>}
     */
    function getChildFolders(projectName, parentNodeId, queryParams) {
        return getChildNodes(projectName, parentNodeId, queryParams)
            .then(function(response) {
                return response.data.filter(function(node) {
                    return node.hasOwnProperty('children');
                });
            });
    }

    /**
     *
     * @param projectName
     * @param parentNodeId
     * @param queryParams
     * @returns {IPromise<TResult>}
     */
    function getChildContents(projectName, parentNodeId, queryParams) {
        return getChildNodes(projectName, parentNodeId, queryParams)
            .then(function(response) {
                return response.data.filter(function(node) {
                    return !node.hasOwnProperty('children');
                });
            });
    }

    /**
     * Get a single node.
     *
     * @param {String} projectName
     * @param {String} uuid
     * @param {Object=} queryParams
     * @returns {restangular.RestangularElement|restangular.IElement}
     */
    function getNode(projectName, uuid, queryParams) {
        queryParams = queryParams || {};
        queryParams.lang = i18nService.languages.map(function(lang) {
                return lang.code;
            }).join(',');
        return meshGet(projectName + '/nodes/' + uuid, queryParams);
    }

    /**
     * @param {String} projectName
     * @param {Object=} queryParams
     * @returns {ng.IPromise<any>}
     */
    function getTagFamilies(projectName, queryParams) {
        var url = projectName + '/tagFamilies/';
        return meshGet(url, queryParams);
    }

    /**
     *
     * @param {String} projectName
     * @param {String=} tagFamilyUuid
     * @param {Object=} queryParams
     * @returns {EnhancedCollectionPromise<any>|ICollectionPromise<any>}
     */
    function getTags(projectName, tagFamilyUuid, queryParams) {
        var url;
        if (typeof tagFamilyUuid === 'undefined') {
            url = projectName + '/tags/';
        } else {
            url = projectName + '/tagFamilies/' + tagFamilyUuid + '/tags/';
        }
        return meshGet(url, queryParams);
    }

    /**
     * Get the contents of a given project, with optional parameters that specifies query string options.
     *
     * @param {string} projectName
     * @param {string} parentTagId
     * @param {Object=} queryParams
     * @returns {restangular.EnhancedCollectionPromise<any>|restangular.ICollectionPromise<any>}
     */
    function getContents(projectName, parentTagId, queryParams) {
        var url = projectName + '/tags/' + parentTagId + '/contents/';
        return meshGet(url, queryParams)
            .then(unwrapCurrentLanguage);
    }

    /**
     * Get a single content record.
     *
     * @param {string} projectName
     * @param uuid
     * @returns {restangular.RestangularElement|restangular.IElement}
     */
    function getContent(projectName, uuid) {
        var queryParams = {
            lang: i18nService.languages.map(function(lang) {
                return lang.code;
            }).join(',')
        };
        return meshGet(projectName + '/nodes/' + uuid, queryParams);
    }

    /**
     * Create or update the content object on the server.
     * @param {string} projectName
     * @param {Object} content
     * @returns {*|ng.IPromise<any>|restangular.IPromise<any>|void}
     */
    function persistContent(projectName, content) {
        clearCache('contents');
        if (content.hasOwnProperty('save')) {
            // this is a Restangular object
            return meshPut(projectName + '/nodes/' + content.uuid, content);
        } else {
            // this is a plain object (newly-created)
            return meshPost(projectName + '/nodes/', content);
        }
    }

    /**
     * Remove the content from the server.
     * @param content
     * @returns {*|ng.IPromise<any>|restangular.IPromise<any>|void}
     */
    function deleteContent(content) {
        clearCache('contents');
        return meshDelete(content.project + '/nodes/' + content.uuid);
    }

    /**
     *
     * @param {Object=} queryParams
     * @returns {EnhancedCollectionPromise<any>|ICollectionPromise<any>}
     */
    function getSchemas(queryParams) {
        return meshGet('schemas', queryParams);
    }

    /**
     *
     * @param uuid
     * @param {Object=} queryParams
     * @returns {ng.IPromise<any>|restangular.IPromise<any>}
     */
    function getSchema(uuid, queryParams) {
        return meshGet('schemas/' +  uuid, queryParams);
    }

    /**
     *
     * @param {Object=} queryParams
     * @returns {EnhancedCollectionPromise<any>|ICollectionPromise<any>}
     */
    function getMicroschemas(queryParams) {
        return meshGet('microschemas', queryParams);
    }

    /**
     * Get a microschema by name
     * @param {String} name
     * @param {Object=} queryParams
     * @returns {ng.IPromise<any>|restangular.IPromise<any>}
     */
    function getMicroschema(name, queryParams) {
        return meshGet('microschemas/' + name, queryParams);
    }

    /**
     *
     * @param {Object=} queryParams
     * @returns {EnhancedCollectionPromise<any>|ICollectionPromise<any>}
     */
    function getRoles(queryParams) {
        return meshGet('roles', queryParams);
    }

    /**
     *
     * @param {String} uuid
     * @param {Object=} queryParams
     * @returns {EnhancedPromise<any>|IPromise<any>}
     */
    function getRole(uuid, queryParams) {
        return meshGet('roles/' + uuid, queryParams);
    }

    /**
     *
     * @param projectName
     * @param uuid
     * @returns {EnhancedPromise<any>|IPromise<any>}
     */
    function getBreadcrumb(projectName, uuid) {
        return meshGet(projectName + '/breadcrumb/' + uuid);
    }

    /**
     * Clear the $http cache of all keys matching groupName. Proper use of this method
     * depends on the use of the selectiveCache service, which allows selective removal
     * of only certain groups of cached keys at a time. The groupName parameter must
     * match a groupName registered with the `selectiveCacheProvider.setCacheableGroups()`
     * config method.
     *
     * @param {string} groupName
     */
    function clearCache(groupName) {
        selectiveCache.remove(groupName);
    }

    /**
     * Normalize the response to remove the extra language properties
     * and move the content of the currently-selected language up to
     * the "properties" level.
     *
     * @param data
     * @returns {*}
     */
    function unwrapCurrentLanguage(data) {
        var lang = i18nService.getCurrentLang().code;

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
    function wrapCurrentLanguage(obj) {
        var properties = angular.copy(obj.properties),
            lang = i18nService.getCurrentLang().code;

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
        'tags':  new RegExp(projectNameTags + 'tags\\/', 'gi'),
        'tag':  new RegExp(projectName + _ + 'tags' + _ + uuid, 'gi'),
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
        response: function(response) {
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
        request: function(config) {
            // TODO: need to read the API URL from the config file
            if (config.url.indexOf('/api') > -1) {
                config.params = config.params || {};
                config.params.lang = i18nService.getCurrentLang().code;
            }
            return config;
        }
    };
}