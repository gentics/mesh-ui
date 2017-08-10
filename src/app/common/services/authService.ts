module meshAdminUi {

    declare var meshUiConfig: any;

    /**
     * Used to log a user in & out, and keep track of that fact.
     * Currently a mock service which will eventually use OAuth 2 once it has
     * been implemented on the server.
     */
    export class AuthService {

        private _isLoggedIn: boolean;
        private _currentUser: IUser;
        private authString: string;
        private userRequestInFlight: ng.IPromise<any>;
        private onLogInCallbacks;
        private onLogOutCallbacks;
        private AUTH_HEADER_NAME = 'Authorization';
        private CODE_RESPONSE_UNAUTHORIZED = 401;

        constructor(private $injector:ng.auto.IInjectorService,
                    private $q: ng.IQService,
                    private dispatcher: Dispatcher,
                    private selectiveCache: SelectiveCache,
                    private notifyService: NotifyService,
                    private $cookies) {

            this._isLoggedIn = $cookies.get('isLoggedIn') === 'true';
            this.onLogInCallbacks = [];
            this.onLogOutCallbacks = [];
        }


        // public API
        public isLoggedIn() {
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
            let authHeaderValue,
                $http = <ng.IHttpService>this.$injector.get("$http"),
                config: ng.IRequestShortcutConfig = { headers: {}, withCredentials: true },
                deferred = this.$q.defer();

            authHeaderValue = "Basic " + btoa(userName + ":" + password);
            config.headers[this.AUTH_HEADER_NAME] = authHeaderValue;
            config.withCredentials = true;
            $http.defaults.withCredentials = true;

            this.userRequestInFlight = $http.get(meshUiConfig.apiUrl + 'auth/login', config)
                .then(response => {
                    return $http.get(meshUiConfig.apiUrl + 'auth/me');
                })
                .then(
                    response => {
                        if (response.status === 200) {
                            this._currentUser = <IUser>response.data;
                            this.authString = authHeaderValue;
                            this._isLoggedIn = true;
                            this.$cookies.put('isLoggedIn', 'true');
                            this.dispatcher.publish(this.dispatcher.events.loginSuccess);
                            deferred.resolve(true);
                        } else {
                            console.log('Error, status: ' + response.status);
                            deferred.reject();
                        }
                    },
                    response => {
                        if (response.status === this.CODE_RESPONSE_UNAUTHORIZED) {
                            //TODO: Display error message
                            console.log('not authorized: ' + response.status);
                            deferred.reject()
                        }
                    });

            return deferred.promise;
        }

        /**
         * If the browser is refreshed, then we will lose the "currentUser" data, so it needs
         * to be re-fetched from Mesh.
         */
        private reFetchCurrentUser(): ng.IPromise<IUser> {
            if (this.userRequestInFlight) {
                return this.userRequestInFlight;
            }
            // need to re-fetch the current user data
            let config: ng.IRequestShortcutConfig = {
                headers: { [this.AUTH_HEADER_NAME]: this.authString },
                withCredentials: true
            };
            let $http = <ng.IHttpService>this.$injector.get("$http");
            this.userRequestInFlight = $http.get(meshUiConfig.apiUrl + 'auth/me', config)
                .then(response => {
                    this._currentUser = <IUser>response.data;
                    this.userRequestInFlight = undefined;
                    return this._currentUser;
                });
            return this.userRequestInFlight;
        }

        public getAuthValue() {
            return this.authString;
        }

        public getCurrentUser(): IUser {
            if (this._isLoggedIn && !this._currentUser) {
                this.reFetchCurrentUser();
            }
            return this._currentUser;
        }

        /**
         * Log the user out and persist that fact to the cookie.
         */
        public logOut() {
            let $http = <ng.IHttpService>this.$injector.get("$http"),
                deferred = this.$q.defer();
            $http.defaults.withCredentials = true;
            $http.get(meshUiConfig.apiUrl + 'auth/logout').then(() => {
                this.doLogoutHousekeeping();
                deferred.resolve(true);
            }).catch(error => {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         * If the user is currently logged in, but interaction with the API indicated an unauthorized state (i.e. a 401 is
         * returned from a request), then we need to simply run the logout housekeeping which will get the UI state
         * back in sync with the API.
         */
        public setAsLoggedOut() {
            this.notifyService.toast('ERR_SESSION_EXPIRED');
            this.doLogoutHousekeeping();
        }

        private doLogoutHousekeeping() {
            // TODO: need to actually invalidate the basic auth on the browser, see
            // example solution here http://stackoverflow.com/a/492926/772859
            this._isLoggedIn = false;
            this._currentUser = null;
            this.$cookies.put('isLoggedIn', 'false');
            this.$cookies.put('authString', '');
            this.authString = '';
            this.dispatcher.publish(this.dispatcher.events.logoutSuccess);
            this.selectiveCache.removeAll();
        }
    }

    angular.module('meshAdminUi.common')
            .service('authService', AuthService);
}