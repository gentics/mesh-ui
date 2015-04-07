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
    this.$get = function(Restangular, i18nService) {
        return new DataService(Restangular, i18nService, apiUrl);
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
 * @param Restangular
 * @param i18nService
 * @param {string} apiUrl
 * @returns {{}}
 */
function DataService(Restangular, i18nService, apiUrl) {

    Restangular.setBaseUrl(apiUrl);
    Restangular.addResponseInterceptor(function(data, operation) {
        // normalize the response to remove the extra language properties
        // and move the content of the currently-selected language up to
        // the "properties" level.
        var lang = i18nService.getLanguage();

        if (operation === "getList") {
            data.forEach(function(result) {
                if (result.properties && result.properties[lang]) {
                    result.properties = result.properties[lang];
                }
            });
        }

        return data;
    });

    var projects = Restangular.all('projects'),
        projectsCache,
        users = Restangular.all('users'),
        schemas = Restangular.all('schemas'),
        tags = Restangular.all('tags'),
        roles = Restangular.all('roles'),
        groups = Restangular.all('groups'),
        contents = Restangular.all('contents');

    // public API
    this.getProjects = getProjects;
    this.getUsers = getUsers;
    this.getTags = getTags;
    this.getContents = getContents;
    this.getSchemas = getSchemas;
    this.getRoles = getRoles;
    this.getGroups = getGroups;

    /**
     * Since getProjects is called on almost every page (by any context-aware components using
     * the contextService), the projects list is cached. The forceRefresh flag is used to force
     * a new request to be sent to the server.
     *
     * @param {boolean} forceRefresh
     * @returns {*}
     */
    function getProjects(forceRefresh) {
        var data;
        forceRefresh = forceRefresh || false;

        if (typeof projectsCache === 'undefined' || forceRefresh) {
            projectsCache = projects.getList();
            data = projects.getList();
        } else {
            data = projectsCache;
        }

        return data;
    }

    function getUsers() {
        // stub
        return users.getList();
    }

    function getTags() {
        // stub
    }

    /**
     * Get the contents of a given project, with optional parameters that specify query options.
     * @param {string} projectName
     * @param {number} itemsPerPage
     * @param {number} page
     * @param {string} search
     * @returns {restangular.EnhancedCollectionPromise<any>|restangular.ICollectionPromise<any>}
     */
    function getContents(projectName, itemsPerPage, page, search) {
        var options = {
            lang: i18nService.getLanguage()
        };

        if (itemsPerPage) {
            options.per_page = itemsPerPage;
        }
        if (page) {
            options.page = page;
        }

        return Restangular
            .all(projectName + '/contents')
            .getList(options);
    }

    function getSchemas() {
        // stub
        return schemas.getList();
    }

    function getRoles() {
        // stub
    }

    function getGroups() {
        // stub
        groups.getList();
    }
}

/**
 * Configure Restangular
 *
 * @param RestangularProvider
 */
function dataServiceConfig(RestangularProvider) {
    // basic auth credentials: joe1:test123
    // header string: Authorization: Basic am9lMTp0ZXN0MTIz
    // TODO: this will be replaced by an OAuth 2 solution.
    RestangularProvider.setDefaultHeaders({ "Authorization": "Basic am9lMTp0ZXN0MTIz"});

    RestangularProvider.addResponseInterceptor(restangularResponseInterceptor);
}

/**
 * Extract the payload from the response, which is returned as the value of the "data" key.
 *
 * @param {{}} data
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