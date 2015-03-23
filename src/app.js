
function AppController() {
    var vm = this;
    
    vm.foo = "hello";
}


angular.module('caiLunAdminUi', [])
    .controller('AppController', AppController);