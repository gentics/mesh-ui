module meshAdminUi {

    class BinaryThumbnailController {
        private srcUrl: string;
        private srcField: IBinaryField;
        private srcFile: File;
        // used to style image transforms (crop, scale etc)
        private styles = { content: {}, container: {} };
        private transform: IImageTransformParams;

        constructor(private mu: MeshUtils,
                    private $element: JQuery) {
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

        /**
         * Calculate and set values for the objects which are bound to the resize preview DOM CSS.
         */
        public getResizeStyles() {
            if (!this.transform) {
                return;
            }
            let widthParent = <HTMLElement>document.querySelector('.binary-container');
            let previewScale = widthParent.offsetWidth / this.transform.width;
            const scale = (val: number) => val * previewScale;

            this.styles.content = {
                width: scale(this.transform.width) + 'px',
                height: scale(this.transform.height) + 'px',
                'margin-left': -scale(this.transform.cropx) + 'px',
                'margin-top': -scale(this.transform.cropy) + 'px'
            };
            this.styles.container = {
                width: scale(this.transform.cropw) + 'px',
                height: scale(this.transform.croph) + 'px'
            };
            return this.styles;
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
                srcFile: '=',
                transform: '='
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('binaryThumbnail', binaryThumbnailDirective)
        .controller('BinaryThumbnailController', BinaryThumbnailController);
}
