module meshAdminUi {

    class BinaryThumbnailController {
        private srcUrl: string;
        private srcField: IBinaryField;
        private srcFile: File;

        constructor(private mu: MeshUtils) {
            if (!(this.srcUrl && this.srcField) && !this.srcFile) {
                throw new Error('BinaryThumbnailController: Please specify either src-url & src-field, or src-file.');
            }
        }

        public isImage() {
            if (this.srcField) {
                return this.mu.isImageField(this.srcField);
            } else {
                return this.mu.isImageMimeType(this.srcFile.type);
            }
        }

        public getFileUrl() {
            if (this.srcUrl) {
                return this.srcUrl;
            } else {
                return this.srcFile.name;
            }
        }

        public getFileName() {
            if (this.srcField) {
                return this.srcField.fileName;
            } else {
                return this.srcFile.name;
            }
        }

        public getFileExt(): string {
            let filename = this.srcField ? this.srcField.fileName : this.srcFile.name;
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
                srcUrl: '=',
                srcField: '=',
                srcFile: '='
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('binaryThumbnail', binaryThumbnailDirective)
        .controller('BinaryThumbnailController', BinaryThumbnailController);
}
