module meshAdminUi {

    angular.module('meshAdminUi.common')
        .config(authInterceptorConfig)
        .service('authService', AuthService);

    /**
     * Used to log a user in & out, and keep track of that fact.
     * Currently a mock service which will eventually use OAuth 2 once it has
     * been implemented on the server.
     */
    class AuthService {
        private _isLoggedIn;
        private authString;
        private onLogInCallbacks;
        private onLogOutCallbacks;
        private AUTH_HEADER_NAME = 'Authorization';
        private CODE_RESPONSE_UNAUTHORIZED = 401;

        constructor(private $injector:ng.auto.IInjectorService,
                    private $cookies) {

            this._isLoggedIn = $cookies.get('isLoggedIn') === 'true',
                this.authString = $cookies.get('authString') === '',
                this.onLogInCallbacks = [],
                this.onLogOutCallbacks = [];
        }


        // public API
        public get isLoggedIn() {
            return this._isLoggedIn;
        }

        /**
         * Attempts to log the user in based on the supplied username and password.
         * Return true on success, else false.
         *
         * @param {string} userName
         * @param {string} password
         * @returns {boolean}
         */
        public logIn(userName, password) {
            var authHeaderKey,
                authHeaderValue,
                $http = <ng.IHttpService>this.$injector.get("$http");


            var config: ng.IRequestShortcutConfig = { headers: {} };

            authHeaderKey = this.AUTH_HEADER_NAME;
            authHeaderValue = "Basic " + btoa(userName + ":" + password);
            config.headers[authHeaderKey] = authHeaderValue;

            return $http.get('/api/v1/auth/me', config)
                .then(function (response) {
                    if (response.status === 200) {
                        this.authString = authHeaderValue;
                        this._isLoggedIn = true;
                        this.$cookies.put('isLoggedIn', 'true');
                        this.$cookies.put('authString', this.authString);
                    } else {
                        console.log('Error, status: ' + response.status);
                    }
                },
                function (response) {
                    if (response.status === this.CODE_RESPONSE_UNAUTHORIZED) {
                        //TODO: Display error message
                        console.log('not authorized: ' + response.status);
                    }
                });
        }

        public getAuthValue() {
            return this.authString;
        }

        /**
         * Log the user out and persist that fact to the cookie.
         */
        public logOut() {
            this._isLoggedIn = false;
            this.$cookies.put('isLoggedIn', 'false');
            this.onLogOutCallbacks.forEach(function (fn) {
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
        public registerLogInHandler(callback) {
            this.onLogInCallbacks.push(callback);
        }

        /**
         * Register a callback which will be executed when user logs out.
         *
         * @param {function()} callback
         */
        public registerLogOutHandler(callback) {
            this.onLogOutCallbacks.push(callback);
        }
    }

    function authInterceptorConfig($httpProvider:ng.IHttpProvider) {
        $httpProvider.interceptors.push(authInterceptor);
    }

    function authInterceptor(authService:AuthService) {
        var AUTH_HEADER_NAME = 'Authorization';
        return {
            request: function (config) {
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
}