module meshAdminUi {

    class BinaryFileInputController {

        public node: INode;

        constructor() {

        }

    }


    function binaryFileInputDirective() {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/binaryFileInput/binaryFileInput.html',
            controller: 'BinaryFileInputController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                fileUrl: '=',
                model: '='
            }
        };
    }

    angular.module('meshAdminUi.common')
        .directive('binaryFileInput', binaryFileInputDirective)
        .controller('BinaryFileInputController', BinaryFileInputController);

}