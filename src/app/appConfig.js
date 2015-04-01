angular.module('caiLunAdminUi')
    .config(appConfig)
    .run(appRunBlock);

/**
 * App-wide config settings.
 *
 * @param $stateProvider
 * @param $locationProvider
 * @param $urlRouterProvider
 * @param $mdThemingProvider
 * @param dataServiceProvider
 * @constructor
 */
function appConfig($stateProvider, $locationProvider, $urlRouterProvider, $mdThemingProvider, dataServiceProvider) {

    configRoutes($stateProvider);
    $urlRouterProvider.otherwise('/projects');
    $locationProvider.html5Mode(true).hashPrefix('!');

    $mdThemingProvider.theme('default')
        .primaryPalette('amber')
        .accentPalette('blue');

    dataServiceProvider.setApiUrl('http://localhost:8080/api/v1');
}

/**
 * Configuration of top-level routes
 * @param $stateProvider
 */
function configRoutes($stateProvider) {
    $stateProvider
        .state('projects', {
            url: '/projects',
            views: {
                'main' : {
                    templateUrl: 'projects/projectsList.html',
                    controller: 'ProjectsListController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('projects.explorer', {
            url: '/:projectId',
            views: {
                'main@' : {
                    templateUrl: 'projects/projectExplorer.html',
                    controller: 'ProjectExplorerController',
                    controllerAs: 'vm'
                }
            }
        })
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
 * @param dataService
 */
function appRunBlock($rootScope, $state, authService, dataService) {

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
            $state.go('projects');
        }
    });

    /* dataService.getProjects().then(function(data) {
     console.log(data);
     });*/

    /**
     * Register a callback to redirect to the login screen whenever the user gets
     * logged out.
     */
    authService.onLogOut(function() {
        $state.go('login');
    });
}