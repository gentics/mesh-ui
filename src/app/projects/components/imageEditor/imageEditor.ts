module meshAdminUi {

    export interface IImageTransformParams {
        src?: string;
        imageWidth?: number;
        imageHeight?: number;
        cropX?: number;
        cropY?: number;
        cropWidth?: number;
        cropHeight?: number;
        scale?: number;
    }

    class ImageEditorController {

        public transformParams: IImageTransformParams;

        constructor(private $mdDialog: ng.material.IDialogService,
                    private $scope: ng.IScope,
                    private src: string) {

            this.transformParams = {
                src: this.src,
                imageWidth: 0,
                imageHeight: 0,
                cropX: 0,
                cropY: 0,
                cropWidth: 0,
                cropHeight: 0,
                scale: 1
            };
        }

        /**
         * Update the transform parameters. Should be invoked from one of the imageEditor "plugins" as a
         * callback when that plugin makes some alteration to the params. The newParams argument need not be a
         * complete IImageTransformParams object - it can specify only a new scale, for example, and only
         * that property will get updated.
         */
        private updateTransformParams(newParams: IImageTransformParams) {
            for (let param in newParams) {
                if (newParams.hasOwnProperty(param) && this.transformParams.hasOwnProperty(param)) {
                    this.transformParams[param] = newParams[param];
                }
            }
        }

        /**
         * The "reCalcViewDimensions" event is required by the rzSlider directive to
         * ensure the resize slider has the correct width. Since the slider is being created inside some dynamic DOM,
         * it is initially sized incorrectly. Therefore we need to manually trigger this event in order to force a
         * recalculation of its dimensions.
         */
        public resizeTabSelected() {
                this.$scope.$broadcast('reCalcViewDimensions');
        }

        /**
         * Close the modal and return the transform params.
         */
        public save() {
            this.$mdDialog.hide(this.transformParams);
        }

        /**
         * Cancel the modal and return nothing.
         */
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
