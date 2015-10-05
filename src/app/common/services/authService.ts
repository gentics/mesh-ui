angular.module('meshAdminUi.common')
    .config(authInterceptorConfig)
    .service('authService', AuthService);

/**
 * Used to log a user in & out, and keep track of that fact.
 * Currently a mock service which will eventually use OAuth 2 once it has
 * been implemented on the server.
 *
 * @constructor
 */
function AuthService($injector, $cookies) {
    var isLoggedIn = $cookies.get('isLoggedIn') === 'true',
        authString = $cookies.get('authString') === '',
        onLogInCallbacks = [],
        onLogOutCallbacks = [],
        AUTH_HEADER_NAME = 'Authorization';

    // public API
    Object.defineProperties(this, {
        "isLoggedIn": { get: function () { return isLoggedIn; } }
    });
    this.getAuthValue = getAuthValue;
    this.logIn = logIn;
    this.logOut = logOut;
    this.registerLogInHandler = registerLogInHandler;
    this.registerLogOutHandler = registerLogOutHandler;

    /**
     * Attempts to log the user in based on the supplied username and password.
     * Return true on success, else false.
     *
     * @param {string} userName
     * @param {string} password
     * @returns {boolean}
     */
    function logIn(userName, password) {
        var authHeaderKey,
            authHeaderValue,
            $http = $injector.get("$http");


        var config = { headers: {} };

        authHeaderKey = AUTH_HEADER_NAME;
        authHeaderValue = "Basic " + btoa(userName + ":" + password);
        config.headers[authHeaderKey] = authHeaderValue;

        return $http.get('/api/v1/auth/me', config)
            .then(function(response) {
                if (response.status === 200) {
                    authString = authHeaderValue;
                    isLoggedIn = true;
                    $cookies.put('isLoggedIn', 'true');
                    $cookies.put('authString', authString);
                } else {
                    console.log('Error, status: ' + response.status);
                }
            },
            function (response) {
                if (response.status === LoginService.CODE_RESPONSE_UNAUTHORIZED) {
                    //TODO: Display error message
                    console.log('not authorized: ' + response.status);
                }
            });
    }

    function getAuthValue() {
        return authString;
    }

    /**
     * Log the user out and persist that fact to the cookie.
     */
    function logOut() {
        isLoggedIn = false;
        $cookies.put('isLoggedIn', 'false');
        onLogOutCallbacks.forEach(function(fn) {
            fn();
        });
    }

    /**
     * Register a callback function to be run upon successful login. This is a more explicit
     * flow than using an event-based approach as it creates a traceable path of callback
     * registration from the point of use.
     *
     * @param {function()} callback
     */
    function registerLogInHandler(callback) {
        onLogInCallbacks.push(callback);
    }

    /**
     * Register a callback which will be executed when user logs out.
     *
     * @param {function()} callback
     */
    function registerLogOutHandler(callback) {
        onLogOutCallbacks.push(callback);
    }
}

function authInterceptorConfig($httpProvider) {
    $httpProvider.interceptors.push(authInterceptor);
}

function authInterceptor(authService) {
    var AUTH_HEADER_NAME = 'Authorization';
    return {
        request: function (config) {
            console.log(config.url);
            // TODO: need to read the API URL from the config file
            if (config.url.indexOf('api/') > -1 && !config.headers.hasOwnProperty(AUTH_HEADER_NAME)) {
                if (authService.isLoggedIn) {
                    config.headers[AUTH_HEADER_NAME] = authService.getAuthValue();
                } else {
                    console.log('not authorized!');
                }
            }

            return config;
        }
    };
}