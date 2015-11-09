module meshAdminUi {

    class BinaryFileInputController {

        public node: INode;
        public onChange: Function;

        constructor() {
        }

        public fileChanged() {
            this.onChange();
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
                model: '=',
                onChange: '&'
            }
        };
    }

    angular.module('meshAdminUi.common')
        .directive('binaryFileInput', binaryFileInputDirective)
        .controller('BinaryFileInputController', BinaryFileInputController);

}