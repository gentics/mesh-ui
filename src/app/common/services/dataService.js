angular.module('caiLunAdminUi.common')
    .config(dataServiceConfig)
    .provider('dataService', dataServiceProvider);

function dataServiceProvider() {

    var apiUrl;

    this.setApiUrl = function(value) {
        apiUrl = value;
    };

    this.$get = function dataService(Restangular) {

        Restangular.setBaseUrl(apiUrl);

        var projects = Restangular.all('projects');

        function getProjects() {
            return projects.getList();
        }

        return {
            getProjects: getProjects
        };
    };
}

function dataServiceConfig(RestangularProvider) {
    // basic auth credentials: joe1:test123
    // header string: Authorization: Basic am9lMTp0ZXN0MTIz
    // TODO: this will be replaced by an OAuth 2 solution.
    RestangularProvider.setDefaultHeaders({ "Authorization": "Basic am9lMTp0ZXN0MTIz"});

    // add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;
        // .. to look for getList operations
        if (operation === "getList") {
            // .. and handle the data and meta data
            extractedData = data.data.data;
            extractedData.meta = data.data.meta;
        } else {
            extractedData = data.data;
        }
        return extractedData;
    });
}