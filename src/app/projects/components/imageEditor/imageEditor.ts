module meshAdminUi {

    export interface IImageTransformParams {
        src?: string;
        width?: number;
        height?: number;
        cropx?: number;
        cropy?: number;
        cropw?: number;
        croph?: number;
        scale?: number;
    }

    class ImageEditorController {

        public transformParams: IImageTransformParams;
        // used to hide the contents which the cropper is initializing to
        // prevent some layout thrashing.
        public loaded: boolean = false;

        constructor(private $mdDialog: ng.material.IDialogService,
                    private $scope: ng.IScope,
                    $timeout: ng.ITimeoutService,
                    private src: string) {

            this.transformParams = {
                src: this.src,
                width: 0,
                height: 0,
                cropx: 0,
                cropy: 0,
                cropw: 0,
                croph: 0,
                scale: 1
            };

            $timeout(() => this.loaded = true, 500);
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
        private onEdit: Function;

        constructor(private $mdDialog: ng.material.IDialogService) {
        }

        public editImage(): ng.IPromise<IImageTransformParams> {
            return this.$mdDialog.show({
                templateUrl: 'projects/components/imageEditor/imageEditor.html',
                controller: 'ImageEditorController',
                controllerAs: 'vm',
                locals: {
                    src: this.src
                },
                bindToController: true
            })
            .then((result: IImageTransformParams) => this.onEdit({ transform: result }));
        }
    }

    /**
     * Creates an overlay button which adds a link to open the image editor modal.
     *
     * Accepts the following attributes:
     * src: The source URL of the image to be edited.
     * onEdit: A function that will be invoked with a `transform` argument when an image is edited.
     */
    function editableImageDirective() {
        return {
            restrict: 'E',
            template: `<div class="editable-image-container">
                            <div class="edit-image-button" ng-click="vm.editImage()">
                                <i class="icon-crop"></i> <span translate>EDIT</span>
                            </div>
                            <ng-transclude></ng-transclude>
                       </div>`,
            controller: 'EditableImageController',
            controllerAs: 'vm',
            bindToController: true,
            transclude: true,
            scope: {
                src: '=',
                onEdit: '&'
            },
        }
    }

    angular.module('meshAdminUi.projects.imageEditor', ['rzModule'])
        .directive('editableImage', editableImageDirective)
        .controller('EditableImageController', EditableImageController)
        .controller('ImageEditorController', ImageEditorController);
}
