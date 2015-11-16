module meshAdminUi {

    class BinaryThumbnailController {
        private srcNode: INode;
        private srcFile: File;

        constructor(private mu: MeshUtils,
                    private contextService: ContextService) {
            if (!this.srcNode && !this.srcFile) {
                throw new Error('BinaryThumbnailController: Please specify either src-node or src-file.');
            }
        }

        public isImage() {
            if (this.srcNode) {
                return this.mu.isImageNode(this.srcNode);
            } else {
                return this.mu.isImageMimeType(this.srcFile.type);
            }
        }

        public getFileUrl() {
            if (this.srcNode) {
                return this.mu.getBinaryFileUrl(this.contextService.getProject().name, this.srcNode);
            } else {
                return this.srcFile.name;
            }
        }

        public getFileName() {
            if (this.srcNode) {
                return this.srcNode.fileName;
            } else {
                return this.srcFile.name;
            }
        }

        public getFileExt(): string {
            let filename = this.srcNode ? this.srcNode.fileName : this.srcFile.name;
            if (filename) {
                let parts = filename.split('.');
                return parts[parts.length - 1];
            }
        }
    }

    function binaryThumbnailDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/binaryThumbnail/binaryThumbnail.html',
            controller: 'BinaryThumbnailController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                srcNode: '=',
                srcFile: '='
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('binaryThumbnail', binaryThumbnailDirective)
        .controller('BinaryThumbnailController', BinaryThumbnailController);
}
