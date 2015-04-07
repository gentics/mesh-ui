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
            abstract: true,
            views: {
                'main' : {
                    templateUrl: 'projects/projects.html',
                    controller: 'ProjectsListController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('projects.list', {
            url: '',
            views: {
                'projects': {
                    templateUrl: 'projects/projectsList/projectsList.html'
                }
            }
        })
        .state('projects.explorer', {
            url: '/:projectName',
            views: {
                'projects' : {
                    templateUrl: 'projects/projectExplorer/projectExplorer.html',
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
            $state.go('projects');
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