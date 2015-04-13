angular.module('caiLunAdminUi.common')
    .config(dataServiceConfig)
    .provider('dataService', dataServiceProvider);

/**
 * The dataServiceProvider is used to configure and create the DataService which is used
 * for all requests to the API.
 */
function dataServiceProvider() {

    var apiUrl;

    this.setApiUrl = setApiUrl;
    this.$get = function($cacheFactory, Restangular, i18nService) {
        return new DataService($cacheFactory, Restangular, i18nService, apiUrl);
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
 * @constructor
 * @param $cacheFactory
 * @param Restangular
 * @param i18nService
 * @param {string} apiUrl
 * @returns {{}}
 */
function DataService($cacheFactory, Restangular, i18nService, apiUrl) {

    Restangular.setBaseUrl(apiUrl);
    Restangular.addResponseInterceptor(responseInterceptor);

    var projects = Restangular.all('projects'),
        users = Restangular.all('users'),
        schemas = Restangular.all('schemas'),
        tags = Restangular.all('tags'),
        roles = Restangular.all('roles'),
        groups = Restangular.all('groups');

    // public API
    this.getProjects = getProjects;
    this.getUsers = getUsers;
    this.getTags = getTags;
    this.getContents = getContents;
    this.getContent = getContent;
    this.getSchemas = getSchemas;
    this.getSchema = getSchema;
    this.getRoles = getRoles;
    this.getGroups = getGroups;

    /**
     * @returns {*}
     */
    function getProjects() {
        return projects.getList();
    }

    function getUsers() {
        // stub
        return users.getList();
    }

    /**
     * Get the tags for the given project
     * @param {string} projectName
     * @param {Object} queryParams
     * @returns {restangular.EnhancedCollectionPromise<any>|restangular.ICollectionPromise<any>}
     */
    function getTags(projectName, queryParams) {
        var tags = Restangular.all(projectName + '/tags');
        queryParams = queryParams || {};
        queryParams.lang = i18nService.getLanguage();

        return tags.getList(queryParams);
    }

    /**
     * Get the contents of a given project, with optional parameters that specifies query string options.
     *
     * @param {string} projectName
     * @param {{}} queryParams
     * @param {boolean} refresh Invalidate cache for this request and make a new request to the server.
     * @returns {restangular.EnhancedCollectionPromise<any>|restangular.ICollectionPromise<any>}
     */
    function getContents(projectName, queryParams, refresh) {
        var contents = Restangular.all(projectName + '/contents'),
            invalidateCache = !!refresh;

        queryParams = queryParams || {};
        queryParams.lang = i18nService.getLanguage();

        if (invalidateCache) {
            clearCache();
        }

        return contents.getList(queryParams);
    }

    /**
     * Get a single content record.
     *
     * @param projectName
     * @param uuid
     * @returns {restangular.RestangularElement|restangular.IElement}
     */
    function getContent(projectName, uuid) {
        var contents = Restangular.all(projectName);
        var queryParams = {
            lang: i18nService.getLanguage()
        };

        return contents.one('contents', uuid).get(queryParams);
    }

    function getSchemas() {
        // stub
        return schemas.getList();
    }

    function getSchema(uuid) {
        return Restangular.one('schemas', uuid).get();
    }

    function getRoles() {
        // stub
    }

    function getGroups() {
        // stub
        groups.getList();
    }

    /**
     * The $http service is configured to cache all requests by default, but sometimes we want to get a fresh
     * response from the server (e.g. after doing a CRUD operation, the list will change). This function is invoked
     * by specifying a parameter in one of the public API methods and will clear the cache, forcing a new request.
     *
     * TODO: It would be good if there was some way to invalidate the cache only for a specific endpoint, e.g.
     * just for "projects", but this is not simple since the URL *and* any query parameters must match to
     * remove the correct cache key.
     */
    function clearCache() {
        $cacheFactory.get('$http').removeAll();
    }

    /**
     * Normalize the response to remove the extra language properties
     * and move the content of the currently-selected language up to
     * the "properties" level.
     *
     * @param data
     * @param operation
     * @returns {*}
     */
    function responseInterceptor(data, operation) {
        var lang = i18nService.getLanguage();

        function extractCurrentLanguage(item) {
            if (item.properties && item.properties[lang]) {
                item.properties = item.properties[lang];
            }
            return item;
        }

        if (operation === "getList") {
            data.forEach(extractCurrentLanguage);
        } else {
            extractCurrentLanguage(data);
        }

        return data;
    }
}

/**
 * Configure Restangular
 *
 * @param $httpProvider
 * @param RestangularProvider
 */
function dataServiceConfig($httpProvider, RestangularProvider) {
    // basic auth credentials: joe1:test123
    // header string: Authorization: Basic am9lMTp0ZXN0MTIz
    // TODO: this will be replaced by an OAuth 2 solution.
    RestangularProvider.setDefaultHeaders({ "Authorization": "Basic am9lMTp0ZXN0MTIz"});

    RestangularProvider.setRestangularFields({
       id: "uuid"
    });

    RestangularProvider.addResponseInterceptor(restangularResponseInterceptor);

    $httpProvider.defaults.cache = true;
}

/**
 * Extract the payload from the response, which is returned as the value of the "data" key.
 *
 * @param {Object} data
 * @param {string} operation
 * @returns {Object}
 */
function restangularResponseInterceptor(data, operation) {
    var extractedData;

    if (operation === "getList") {
        extractedData = data.data;
        extractedData.metadata = data._metainfo;
    } else {
        extractedData = data;
    }

    return extractedData;
}