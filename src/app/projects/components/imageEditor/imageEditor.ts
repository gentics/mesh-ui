module meshAdminUi {

    declare var Cropper: any;

    class ImageEditorController {

        public scale: number = 1;
        public scaleWidth: number;
        public scaleHeight: number;

        private cropData;
        private cropper;
        private sliderOptions;
        private resizeImageStyle: {
            width: string;
            height: string;
            'margin-left': string;
            'margin-top': string;
            transform: string;
        } = {};
        private resizeContainerStyle: {
            width: string;
            height: string;
        } = {};

        constructor(private $mdDialog: ng.material.IDialogService,
                    private $scope: ng.IScope,
                    private src: string) {

            this.initCropper();

            this.sliderOptions = {
                floor: 0.1,
                ceil: 2,
                step: 0.01,
                precision: 2,
                showTicks: true,
                onChange: () => this.updateScaleDimensions()
            };
        }

        private updateScaleDimensions() {
            this.scaleWidth = Math.round(this.cropData.width * this.scale);
            this.scaleHeight = Math.round(this.cropData.height * this.scale);
            this.setImageResizeStyles();
        }

        private initCropper() {
            setTimeout(() => {
                let image = document.querySelector('#mesh-image-editor-subject');
                this.cropper = new Cropper(image, {
                    dragMode: 'move',
                    toggleDragModeOnDblclick: false,
                    rotatable: false,
                    crop: data => {
                        this.cropData = data;
                        this.$scope.$apply(() => this.setImageResizeStyles());
                        this.updateScaleDimensions();
                    }
                });
                this.cropper.zoomTo(1);
            });
        }

        public changeScaleWidth() {
            this.scale = this.scaleWidth / this.cropData.width;
            this.updateScaleDimensions();
        }
        public changeScaleHeight() {
            this.scale = this.scaleHeight / this.cropData.height;
            this.updateScaleDimensions();
        }


        public setImageResizeStyles() {
            let data = this.cropper.getData();
            let imageData = this.cropper.getImageData();
            let previewWidth = data.width;
            let imageScaledRatio = data.width / previewWidth;

            this.resizeImageStyle = {
                width: imageData.naturalWidth / imageScaledRatio * this.scale + 'px',
                height: imageData.naturalHeight / imageScaledRatio * this.scale + 'px',
                'margin-left': -data.x / imageScaledRatio * this.scale + 'px',
                'margin-top': -data.y / imageScaledRatio * this.scale + 'px',
                transform: `scale(1, 1)`
                //transform: `scale(${this.scale}, ${this.scale})`
            };
            this.resizeContainerStyle = {
                width: data.width * this.scale + 'px',
                height: data.height * this.scale + 'px',
            }
        }


        public save() {
            this.$mdDialog.hide();
        }

        public cancel() {
            this.$mdDialog.cancel();
        }
    }

    class EditableImageController {
        private src: string;

        constructor(private $mdDialog: ng.material.IDialogService) {
        }

        public editImage() {
            console.log('gonna edit', this.src);
            return this.$mdDialog.show({
                templateUrl: 'projects/components/imageEditor/imageEditor.html',
                controller: 'ImageEditorController',
                controllerAs: 'vm',
                locals: {
                    src: this.src
                },
                bindToController: true
            });
        }
    }

    /**
     * Creates an overlay button which adds a link to open the image editor modal.
     */
    function editableImageDirective() {
        return {
            restrict: 'E',
            template: `<div class="editable-image-button">
                            <button type="button" ng-click="vm.editImage()">EDIT</button>
                       </div>`,
            controller: 'EditableImageController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                src: '='
            },
        }
    }

    angular.module('meshAdminUi.projects.imageEditor', ['rzModule'])
        .directive('editableImage', editableImageDirective)
        .controller('EditableImageController', EditableImageController)
        .controller('ImageEditorController', ImageEditorController);
}
