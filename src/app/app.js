

function AppConfig($stateProvider, $locationProvider, $urlRouterProvider) {
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
}


angular.module('caiLunAdminUi', [
    'ui.router',
    'ngMaterial',
    'ngCookies'
])
    .config(AppConfig)
    .run(appRunBlock);