

function AppConfig($stateProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/'
        })
        .state('forbidden', {
            url: '/forbidden'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        });


    $locationProvider.html5Mode(true).hashPrefix('!');
}


function AppController($scope, $state, authService) {
    var vm = this;

    $scope.$on('$stateChangeStart', function(event, toState) {
        if (toState.name !== 'login' && !authService.isLoggedIn) {
            event.preventDefault();
            $state.go('login');
        }
    });
}


angular.module('caiLunAdminUi', [
    'ui.router',
    'ngMaterial'
])
    .config(AppConfig)
    .controller('AppController', AppController);