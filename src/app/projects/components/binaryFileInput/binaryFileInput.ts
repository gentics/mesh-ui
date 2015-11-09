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
                node: '=',
                fileUrl: '=',
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
                node: '=',
                sourceUrl: '=',
                sourceFile: '=',
            },
            link: (scope: any) => {
                scope.isImageNode = () => {
                    return mu.isImageNode(scope.node);
                };
                scope.isImageFile = () => {
                    return mu.isImageMimeType(scope.sourceFile.type);
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