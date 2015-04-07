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
    this.$get = function(Restangular) {
        return new DataService(Restangular, apiUrl);
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
 * @param Restangular
 * @param apiUrl
 * @returns {{getProjects: getProjects}}
 */
function DataService(Restangular, apiUrl) {

    Restangular.setBaseUrl(apiUrl);
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

    function getProjects(forceRefresh) {
        var data;
        forceRefresh = forceRefresh || false;

        if (typeof projectsCache === 'undefined' || forceRefresh) {
            projectsCache = projects.getList();
            data = projects.getList();
        }
        else {
            data = projectsCache;
        }

        return data;
    }

    function getUsers() {
        return users.getList();
    }

    function getTags() {
        // stub
    }

    function getContents() {
        // stub
    }

    function getSchemas() {
        return schemas.getList();
    }

    function getRoles() {
        // stub
    }

    function getGroups() {
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
 * @param data
 * @param operation
 * @returns {Object}
 */
function restangularResponseInterceptor(data, operation) {
    var extractedData;

    if (operation === "getList") {
        extractedData = data.data;
        extractedData.metadata = data['_metainfo'];
    } else {
        extractedData = data;
    }

    return extractedData;
}