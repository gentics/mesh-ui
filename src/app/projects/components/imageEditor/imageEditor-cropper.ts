module meshAdminUi {

    declare var Cropper: any;

    class ImageEditorCropperController {

        public params: IImageTransformParams;
        public cropperOptions;
        private cropper;
        private onCrop: Function;

        constructor($scope: ng.IScope) {
            this.cropperOptions = {
                aspectRatio: 'free'
            };

            this.initCropper();

            $scope.$on('$destroy', () => this.cropper.destroy());
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
                    strict: true,
                    toggleDragModeOnDblclick: false,
                    rotatable: false,
                    autoCropArea: 1,
                    built: () => {
                        // set the image natural dimensions
                        let imageData = this.cropper.getImageData();
                        let params = {
                            width: imageData.naturalWidth,
                            height: imageData.naturalHeight,
                        };
                        this.onCrop({ params: params });

                        if (this.params.cropw && this.params.croph) {
                            // The transform params were pre-specified via the intialTransform attribute on the
                            // image editor component.
                            this.cropper.setData({
                                y: this.params.cropy,
                                x: this.params.cropx,
                                width: this.params.cropw,
                                height: this.params.croph
                            });
                        } else {
                            this.setAspectRatioAndFitToImage(null);
                            this.updateParams();
                        }

                    },
                    cropend: () => this.updateParams()
                });
            });
        }

        /**
         * Set the Cropper aspect ratio and ensure that the crop area is not taking
         * up the entire container.
         */
        private setAspectRatioAndFitToImage(ratio: number) {
            // setting aspect ratio to null forces the crop area to match image dimensions
            this.cropper.setAspectRatio(ratio);
            let cropBox = this.cropper.getCropBoxData();
            const PAD = 5;

            if (cropBox.left === 0 && cropBox.top === 0) {
                // when the cropBox completely fills the container, it is hard to see
                // and interact with. In this case, we make it a bit smaller.
                let container = this.cropper.getContainerData();
                this.cropper.setCropBoxData({
                    top: PAD,
                    left: PAD,
                    width: container.width - 2 * PAD,
                    height: container.height - 2 * PAD
                });
            }
        }

        /**
         * Invoke the onCrop callback, passing the current crop parameters.
         */
        private updateParams() {
            let data = this.cropper.getData();
            let params = {
                cropx: data.x,
                cropy: data.y,
                cropw: data.width,
                croph: data.height
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
            this.setAspectRatioAndFitToImage(ratio);
            this.updateParams();
        }

        /**
         * Fit the crop area to the image.
         */
        public fitToImage() {
            this.setAspectRatio(this.cropperOptions.aspectRatio);
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
