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
        };
        private resizeContainerStyle: {
            width: string;
            height: string;
        };
        private resizeContainerClicked: boolean = false;
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

                this.resizePos.x = window.innerWidth / 2;
                this.resizePos.y = (<HTMLElement>document.querySelector('.resize-area')).offsetHeight / 2;
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
            const setContainerTransform = (container: HTMLElement, dx, dy): number[] => {
                let data = this.cropper.getData();
                let x = dx + this.resizePos.x - data.width * this.scale / 2;
                let y = dy + this.resizePos.y - data.height * this.scale / 2;
                container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                return [x, y];
            };

            setTimeout(() => {
                let moving = false;
                let $previewContainer = angular.element(document.querySelector('.resize-container'));
                let ox, oy; // origin coordinates of drag
                let lx, ly; // last coordinates set
                let dx = 0;
                let dy = 0;
                setContainerTransform($previewContainer[0], 0, 0);

                const move = (event: MouseEvent|TouchEvent) => {
                    event.preventDefault();
                    dx = getClientX(event) - ox;
                    dy = getClientY(event) - oy;
                    [lx, ly] = setContainerTransform($previewContainer[0], dx, dy);
                };

                const endMove = (event: MouseEvent|TouchEvent) => {
                    event.preventDefault();
                    moving = false;
                    ox = lx;
                    oy = ly;
                    let data = this.cropper.getData();
                    this.resizePos.x = ox + data.width * this.scale / 2;
                    this.resizePos.y = oy + data.height * this.scale / 2;
                    $previewContainer.off('mousemove touchmove', move);
                    $previewContainer.off('mouseup touchend mouseleave', endMove)
                };

                const startMove = (event: MouseEvent|TouchEvent) => {
                    event.preventDefault();
                    ox = getClientX(event);
                    oy = getClientY(event);
                    moving = true;
                    $previewContainer.on('mousemove touchmove', move);
                    $previewContainer.on('mouseup touchend mouseleave', endMove)
                };


                $previewContainer.on('mousedown touchstart', startMove);
            });
        }

        public resetScale() {
            this.scale = 1;
            this.updateScaleDimensions();
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
            const scale = (val: number) => val * this.scale;
            let data = this.cropper.getData();
            let imageData = this.cropper.getImageData();

            this.resizeImageStyle = {
                width: scale(imageData.naturalWidth) + 'px',
                height: scale(imageData.naturalHeight) + 'px',
                'margin-left': -scale(data.x) + 'px',
                'margin-top': -scale(data.y) + 'px'
            };

            let translateX = this.resizePos.x - data.width * this.scale / 2;
            let translateY = this.resizePos.y - data.height * this.scale / 2;
            this.resizeContainerStyle = {
                width: scale(data.width) + 'px',
                height: scale(data.height) + 'px',
                transform: `translate3d(${translateX}px, ${translateY}px, 0)`
            }
        }

        public mouseDown(event: MouseEvent) {
            this.resizeContainerClicked = true;
        }

        public mouseMove(event: MouseEvent) {
            if (this.resizeContainerClicked) {

            }
        }

        public mouseUp(event: MouseEvent) {

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
