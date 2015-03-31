

function AppConfig($stateProvider, $locationProvider, $urlRouterProvider, $mdThemingProvider) {
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

    $urlRouterProvider.otherwise('/projects');
    $locationProvider.html5Mode(true).hashPrefix('!');

    $mdThemingProvider.theme('default')
        .primaryPalette('amber')
        .accentPalette('blue');
}


function appRunBlock($rootScope, $state, authService) {

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
    authService.onLogOut(function() {
        $state.go('login');
    });
}


angular.module('caiLunAdminUi', [
    'ui.router',
    'ngMaterial',
    'ngCookies'
])
    .config(AppConfig)
    .run(appRunBlock);