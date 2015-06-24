angular.module('meshAdminUi.common')
    .service('authService', AuthService);

/**
 * Used to log a user in & out, and keep track of that fact.
 * Currently a mock service which will eventually use OAuth 2 once it has
 * been implemented on the server.
 *
 * @constructor
 */
function AuthService($cookies) {
    var isLoggedIn = $cookies.get('isLoggedIn') === 'true',
        onLogInCallbacks = [],
        onLogOutCallbacks = [];

    // public API
    Object.defineProperties(this, {
        "isLoggedIn": { get: function () { return isLoggedIn; } }
    });
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
        if ((userName === 'admin' && password === 'admin') || (userName === 'a' && password === 'a')) {
            isLoggedIn = true;
            $cookies.put('isLoggedIn', 'true');
            onLogInCallbacks.forEach(function(fn) {
                fn();
            });
        }

        return isLoggedIn;
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