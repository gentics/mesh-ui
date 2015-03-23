/**
 * Currently a mock service which will eventually use OAuth 2 once it has
 * been implemented on the server.
 *
 * @returns {{isLoggedIn: boolean}}
 */
function authService() {
    var isLoggedIn = false;

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
        }

        return isLoggedIn;
    }

    return {
        isLoggedIn: isLoggedIn,
        logIn: logIn
    };
}

angular.module('caiLunAdminUi')
    .factory('authService', authService);