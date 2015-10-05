angular.module('meshAdminUi')
    .config(appConfig)
    .run(appRunBlock);

declare var meshConfig: any;

/**
 * App-wide config settings.
 *
 * @global meshConfig
 *
 * @param $stateProvider
 * @param $locationProvider
 * @param $urlRouterProvider
 * @param $mdThemingProvider
 * @param {dataServiceProvider} dataServiceProvider
 * @param paginationTemplateProvider
 * @param cfpLoadingBarProvider
 */
function appConfig($stateProvider,
                   $locationProvider,
                   $urlRouterProvider,
                   $mdThemingProvider,
                   dataServiceProvider,
                   paginationTemplateProvider,
                   cfpLoadingBarProvider) {

    configRoutes($stateProvider);
    $urlRouterProvider.otherwise('/projects');
    $locationProvider.hashPrefix('!');

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
 *
 * @param $rootScope
 * @param $state
 * @param authService
 */
function appRunBlock($rootScope, $state, authService) {

    /**
     * Route unauthenticated users to the login page.
     */
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (toState.name !== 'login' && !authService.isLoggedIn) {
            event.preventDefault();
            $state.go('login');
        }
        else if (toState.name === 'login' && authService.isLoggedIn) {
            event.preventDefault();
            $state.go('projects.list');
        }
    });

    /**
     * Register a callback to redirect to the login screen whenever the user gets
     * logged out.
     */
    authService.registerLogOutHandler(function() {
        $state.go('login');
    });
}