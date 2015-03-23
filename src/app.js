

function AppConfig($stateProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/'
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

    $scope.$on('$stateChangeStart', function(e, toState, toStateParams) {
        if (toState.name !== 'login' && !authService.isLoggedIn) {
            $state.go('login');
        }
    });
}


angular.module('caiLunAdminUi', [
    'ui.router'
])
    .config(AppConfig)
    .controller('AppController', AppController);