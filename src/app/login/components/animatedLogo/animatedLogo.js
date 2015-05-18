angular.module('meshAdminUi.login')
    .directive('animatedLogo', animatedLogoDirective);

function animatedLogoDirective() {

    function animatedMenuController() {
        var vm = this;
        vm.in = true;
        vm.toggle = function() {
            vm.in = !vm.in;
        };
    }

    return {
        restrict: 'E',
        templateUrl: 'login/components/animatedLogo/animatedLogo.html',
        replace: true,
        scope: {
            animateIn: '=',
            animateOut: '='
        },
        bindToController: true,
        controller: animatedMenuController,
        controllerAs: 'vm'
    };
}