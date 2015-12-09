module meshAdminUi {

    declare var Cropper: any;

    class ImageEditorCropperController {

        public params: IImageTransformParams;
        public cropperOptions;
        private cropper;
        private onCrop: Function;

        constructor() {
            this.cropperOptions = {
                aspectRatio: 'free'
            };

            this.initCropper();
        }

        /**
         * Initialize the Cropper plugin. A setTimeout is required to allow Angular to
         * create and append the DOM nodes needed to init the cropper.
         */
        private initCropper() {
            setTimeout(() => {
                let image = document.querySelector('#mesh-image-editor-subject');
                this.cropper = new Cropper(image, {
                    dragMode: 'move',
                    toggleDragModeOnDblclick: false,
                    rotatable: false,
                    autoCropArea: 1,
                    built: () => {
                        // set the image natural dimensions
                        let imageData = this.cropper.getImageData();
                        let params = {
                            imageWidth: imageData.naturalWidth,
                            imageHeight: imageData.naturalHeight,
                        };
                        this.onCrop({ params: params });
                        this.updateParams();
                    },
                    cropend: () => this.updateParams()
                });
                this.cropper.zoomTo(1);
            });
        }

        private updateParams() {
            let data = this.cropper.getData();
            let params = {
                cropX: data.x,
                cropY: data.y,
                cropWidth: data.width,
                cropHeight: data.height
            };
            this.onCrop({ params: params });
        }

        /**
         * Set the aspect ratio of the crop box.
         * @param mode - either 'original', 'square', or 'free'
         */
        public setAspectRatio(mode: string) {
            let ratio = null;
            if (mode === 'original') {
                ratio = this.cropper.getImageData().aspectRatio;
            } else if (mode === 'square') {
                ratio = 1;
            }
            this.cropper.setAspectRatio(ratio);
        }

    }

    function imageEditorCropperDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/imageEditor/imageEditorCropper.html',
            controller: 'ImageEditorCropperController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                params: '=',
                onCrop: '&'
            }
        }
    }

    angular.module('meshAdminUi.projects.imageEditor')
        .directive('imageEditorCropper', imageEditorCropperDirective)
        .controller('ImageEditorCropperController', ImageEditorCropperController);
}
