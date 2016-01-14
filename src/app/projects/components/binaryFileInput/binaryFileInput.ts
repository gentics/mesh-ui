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
                srcUrl: '=',
                srcField: '=',
                model: '=',
                onChange: '&'
            }
        };
    }

    function binaryFilePreviewDirective(mu: MeshUtils) {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/binaryFileInput/binaryFilePreview.html',
            scope: {
                srcUrl: '=',
                srcField: '=',
                srcFile: '=',
            },
            link: (scope: any) => {
                scope.isImageNode = () => {
                    return mu.isImageField(scope.field);
                };
                scope.isImageFile = () => {
                    return mu.isImageMimeType(scope.srcFile.type);
                };
                scope.getFileExt = (filename: string): string => {
                    if (filename) {
                        let parts = filename.split('.');
                        return parts[parts.length - 1];
                    }
                }
            }
        };
    }

    angular.module('meshAdminUi.common')
        .directive('binaryFilePreview', binaryFilePreviewDirective)
        .directive('binaryFileInput', binaryFileInputDirective)
        .controller('BinaryFileInputController', BinaryFileInputController);

}