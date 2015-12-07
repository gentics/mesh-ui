module meshAdminUi {

    declare var Cropper: any;

    class ImageEditorController {

        public scale: number = 1;
        public scaleWidth: number;
        public scaleHeight: number;
        public cropperOptions;
        public sliderOptions;

        // Stores the object returned by the Cropper#getData() method.
        private cropData;
        private cropper;
        private resizeImageStyle: any = {};
        private resizeContainerStyle: any = {};
        private resizePos = { x: 0, y: 0 };

        constructor(private $mdDialog: ng.material.IDialogService,
                    private $scope: ng.IScope,
                    private src: string) {

            this.initCropper();
            this.initResizePreview();
            this.sliderOptions = {
                floor: 0.1,
                ceil: 2,
                step: 0.01,
                precision: 2,
                onChange: () => this.updateScaleDimensions()
            };
            this.cropperOptions = {
                aspectRatio: 'free'
            };
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
                    crop: data => {
                        this.cropData = data;
                        this.$scope.$applyAsync(() => this.setImageResizeStyles());
                        this.updateScaleDimensions();
                    }
                });
                this.cropper.zoomTo(1);
            });
        }

        /**
         * Position the resize preview container in the center, and register the event handlers for moving
         * it around.
         */
        private initResizePreview() {
            const getEventProp = (event: MouseEvent|TouchEvent, prop: string) => {
                return (event instanceof TouchEvent) ? event.touches[0][prop] : event[prop];
            };
            const getClientX = event => getEventProp(event, 'clientX');
            const getClientY = event => getEventProp(event, 'clientY');

            setTimeout(() => {
                this.resizePos.x = window.innerWidth / 2;
                this.resizePos.y = (<HTMLElement>document.querySelector('.resize-area')).offsetHeight / 2;
                let $previewContainer = angular.element(document.querySelector('.resize-container'));
                let ox, oy; // origin coordinates of drag
                let dx = 0;
                let dy = 0;
                this.resizeContainerStyle.transform = this.makeTransformString(0, 0);

                const move = (event: MouseEvent|TouchEvent) => {
                    event.preventDefault();
                    dx = getClientX(event) - ox;
                    dy = getClientY(event) - oy;
                    this.$scope.$apply(() => this.resizeContainerStyle.transform = this.makeTransformString(dx, dy));
                };

                const endMove = (event: MouseEvent|TouchEvent) => {
                    event.preventDefault();
                    this.resizePos.x += dx;
                    this.resizePos.y += dy;
                    $previewContainer.off('mousemove touchmove', move);
                    $previewContainer.off('mouseup touchend mouseleave', endMove)
                };

                const startMove = (event: MouseEvent|TouchEvent) => {
                    event.preventDefault();
                    ox = getClientX(event);
                    oy = getClientY(event);
                    $previewContainer.on('mousemove touchmove', move);
                    $previewContainer.on('mouseup touchend mouseleave', endMove)
                };

                $previewContainer.on('mousedown touchstart', startMove);
            });
        }

        /**
         * Create a string representing the CSS "transform" property for positioning the
         * scale preview container.
         * @param dx - an x delta to offset the position by
         * @param dy - a y delta to offset the position by
         */
        private makeTransformString(dx = 0, dy = 0): string {
            let data = this.cropper.getData();
            let x = dx + this.resizePos.x - data.width * this.scale / 2;
            let y = dy + this.resizePos.y - data.height * this.scale / 2;
            return `translate3d(${x}px, ${y}px, 0)`;
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

        /**
         * Set the scale back to 1.
         */
        public resetScale() {
            this.scale = 1;
            this.updateScaleDimensions();
        }

        /**
         * Set the scale based on a change to the width value
         */
        public changeScaleWidth() {
            this.scale = this.scaleWidth / this.cropData.width;
            this.updateScaleDimensions();
        }

        /**
         * Set the scale based on a change to the height value
         */
        public changeScaleHeight() {
            this.scale = this.scaleHeight / this.cropData.height;
            this.updateScaleDimensions();
        }

        /**
         * Update the dimensions of the resize preview.
         */
        private updateScaleDimensions() {
            this.scaleWidth = Math.round(this.cropData.width * this.scale);
            this.scaleHeight = Math.round(this.cropData.height * this.scale);
            this.setImageResizeStyles();
        }

        /**
         * Calculate and set values for the objects which are bound to the resize preview DOM CSS.
         */
        public setImageResizeStyles() {
            const scale = (val: number) => val * this.scale;
            let imageData = this.cropper.getImageData();

            this.resizeImageStyle = {
                width: scale(imageData.naturalWidth) + 'px',
                height: scale(imageData.naturalHeight) + 'px',
                'margin-left': -scale(this.cropData.x) + 'px',
                'margin-top': -scale(this.cropData.y) + 'px'
            };

            this.resizeContainerStyle = {
                width: scale(this.cropData.width) + 'px',
                height: scale(this.cropData.height) + 'px',
                transform: this.makeTransformString()
            };
        }

        public save() {
            let returnData = this.cropData;
            returnData.scaleX = this.scale;
            returnData.scaleY = this.scale;
            this.$mdDialog.hide(returnData);
        }

        public cancel() {
            this.$mdDialog.cancel();
        }
    }

    /**
     * This controller is responsible for creating and opening the modal window which
     * contains the image editor component.
     */
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
                })
                .then(result => console.log(result));
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
