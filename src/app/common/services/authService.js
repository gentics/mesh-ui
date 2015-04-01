angular.module('caiLunAdminUi.common')
    .factory('authService', authService);

/**
 * Currently a mock service which will eventually use OAuth 2 once it has
 * been implemented on the server.
 *
 * @returns {{isLoggedIn: boolean}}
 */
function authService($cookies) {
    var isLoggedIn = $cookies.isLoggedIn === 'true',
        onLogInCallbacks = [],
        onLogOutCallbacks = [];

    /**
     * Attempts to log the user in based on the supplied username and password.
     * Return true on success, else false.
     *
     * @param userName
     * @param password
     * @returns {boolean}
     */
    function logIn(userName, password) {
        if (userName === 'admin' && password === 'admin') {
            isLoggedIn = true;
            $cookies.isLoggedIn = true;
            onLogInCallbacks.forEach(function(fn) {
                fn();
            });
        }

        return isLoggedIn;
    }

    function logOut() {
        isLoggedIn = false;
        $cookies.isLoggedIn = false;
        onLogOutCallbacks.forEach(function(fn) {
            fn();
        });
    }

    /**
     * Register a callback function to be run upon successful login. This is a more explicit
     * flow than using an event-based approach as it creates a traceable path of callback
     * registration from the point of use.
     *
     * @param callback
     */
    function registerLogInHandler(callback) {
        onLogInCallbacks.push(callback);
    }

    function registerLogOutHandler(callback) {
        onLogOutCallbacks.push(callback);
    }

    return {
        get isLoggedIn() {
            return isLoggedIn
        },
        logIn: logIn,
        logOut: logOut,
        registerLogInHandler: registerLogInHandler,
        registerLogOutHandler: registerLogOutHandler
    };
}