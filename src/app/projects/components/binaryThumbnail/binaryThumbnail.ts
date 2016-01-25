module meshAdminUi {

    class BinaryThumbnailController {
        private srcUrl: string;
        private srcField: IBinaryField;
        private srcFile: File;
        // used to style image transforms (crop, scale etc)
        private styles = { content: {}, container: {} };
        private transform: IImageTransformParams;

        constructor(private mu: MeshUtils,
                    private $scope: ng.IScope) {
            if (!(this.srcUrl && this.srcField) && !this.srcFile) {
                throw new Error('BinaryThumbnailController: Please specify either src-url & src-field, or src-file.');
            }

            this.$scope.$watchCollection(() => this.transform, () => {
                this.calculateStyles();
            });
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
        public calculateStyles() {
            if (!this.transform || !this.transform.cropx) {
                this.styles.content = {
                    position: 'relative'
                };
            } else {
                const scaleX = (val:number) => val * 100 / this.transform.cropw;
                const scaleY = (val:number) => val * 100 / this.transform.croph;

                this.styles.content = {
                    position: 'absolute',
                    width: scaleX(this.transform.width) + '%',
                    height: scaleY(this.transform.height) + '%',
                    'left': -scaleX(this.transform.cropx) + '%',
                    'top': -scaleY(this.transform.cropy) + '%'
                };
                this.styles.container = {
                    width: scaleX(this.transform.cropw) + '%',
                    'padding-bottom': scaleX(this.transform.croph) + '%'
                };
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
                srcFile: '=',
                transform: '='
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('binaryThumbnail', binaryThumbnailDirective)
        .controller('BinaryThumbnailController', BinaryThumbnailController);
}
