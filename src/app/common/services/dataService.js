angular.module('caiLunAdminUi.common')
    .config(dataServiceConfig)
    .provider('dataService', dataServiceProvider);

/**
 * The dataServiceProvider is used to configure and create the dataService which is used
 * for all requests to the API.
 */
function dataServiceProvider() {

    var apiUrl;

    this.setApiUrl = setApiUrl;
    this.$get = dataService;

    /**
     * Allow config of the API url in the app's config phase.
     * @param value
     */
    function setApiUrl(value) {
        apiUrl = value;
    }

    /**
     * The data service itself which is responsible for all requests to the API.
     *
     * @param Restangular
     * @returns {{getProjects: getProjects}}
     */
    function dataService(Restangular) {

        Restangular.setBaseUrl(apiUrl);
        var projects = Restangular.all('projects'),
            projectsCache,
            users = Restangular.all('users');

        function getProjects(forceRefresh) {
            forceRefresh = forceRefresh || false;

            if (typeof projectsCache === 'undefined' || forceRefresh) {
                projectsCache = projects.getList();
                return projects.getList();
            } else {
                return projectsCache;
            }
        }
        function getUsers() {
            return users.getList();
        }

        return {
            getProjects: getProjects,
            getUsers: getUsers
        };
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