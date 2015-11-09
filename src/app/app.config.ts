module meshAdminUi {

    angular.module('meshAdminUi')
        .config(appConfig)
        .run(appRunBlock);

    declare var meshConfig:any;

    /**
     * App-wide config settings.
     */
    function appConfig($stateProvider: ng.ui.IStateProvider,
                       $locationProvider: ng.ILocationProvider,
                       $urlRouterProvider: ng.ui.IUrlRouterProvider,
                       $mdThemingProvider: ng.material.IThemingProvider,
                       $animateProvider: ng.IAnimateProvider,
                       dataServiceProvider,
                       paginationTemplateProvider,
                       cfpLoadingBarProvider) {

        configRoutes($stateProvider);
        $urlRouterProvider.otherwise('/projects');
        $locationProvider.hashPrefix('!');

        $animateProvider.classNameFilter(/animate/);

        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('blue');

        dataServiceProvider.setApiUrl(meshConfig.apiUrl);

        paginationTemplateProvider.setPath('common/components/pagination/pagination.html');

        cfpLoadingBarProvider.latencyThreshold = 300;
        cfpLoadingBarProvider.includeSpinner = false;
    }

    /**
     * Configuration of top-level routes
     * @param $stateProvider
     */
    function configRoutes($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'main': {
                        templateUrl: 'login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    }
                }
            });
    }

    /**
     * Tasks to be run when the app is bootstrapped.
     */
    function appRunBlock($rootScope: ng.IRootScopeService,
                         $state: ng.ui.IStateService,
                         authService: AuthService,
                         dispatcher: Dispatcher) {
        /**
         * Route unauthenticated users to the login page.
         */
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (toState.name !== 'login' && !authService.isLoggedIn()) {
                event.preventDefault();
                $state.go('login');
            }
            else if (toState.name === 'login' && authService.isLoggedIn()) {
                event.preventDefault();
                $state.go('projectsList');
            }
        });

        /**
         * Register a callback to redirect to the login screen whenever the user gets
         * logged out.
         */
        dispatcher.subscribe(dispatcher.events.logoutSuccess, () => $state.go('login'));
    }

}