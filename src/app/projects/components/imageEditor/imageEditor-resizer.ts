module meshAdminUi {

    class ImageEditorResizerController {

        public params: IImageTransformParams;
        public sliderOptions;
        public scale: number = 1;
        public scaleWidth: number;
        public scaleHeight: number;

        private onResize: Function;
        private resizeImageStyle: any = {};
        private resizeContainerStyle: any = {};
        private resizePos = { x: 0, y: 0 };
        private $previewContainer;

        // origin coordinates of drag
        private ox: number;
        private oy: number;
        // delta of drag while it is happening
        private dx: number;
        private dy: number;

        constructor(private $scope: ng.IScope) {
            this.initResizePreview();
            this.sliderOptions = {
                floor: 0.1,
                ceil: 2,
                step: 0.01,
                precision: 2,
                onChange: () => {
                    this.onResize({ params: { scale: this.scale }})
                }
            };

            $scope.$watchCollection(() => this.params, () => this.updateScaleDimensions());

            // remove the drag event handler when this scope is destroyed.
            $scope.$on('$destroy', () => this.$previewContainer.off('mousedown touchstart', this.startMove));
        }

        /**
         * Position the resize preview container in the center, and register the event handlers for moving
         * it around. The setTimeout is needed to ensure that the DOM has been created before attempting
         * to select elements in it, which otherwise would not yet have been created.
         */
        private initResizePreview() {
            setTimeout(() => {
                this.$previewContainer = angular.element(document.querySelector('.resize-container'));
                this.resizePos.x = window.innerWidth / 2;
                this.resizePos.y = (<HTMLElement>document.querySelector('.resize-area')).offsetHeight / 2;
                this.resizeContainerStyle.transform = this.makeTransformString(0, 0);
                this.$previewContainer.on('mousedown touchstart', this.startMove);
            });
        }

        /**
         * Event handler to be invoked when user starts dragging the preview container.
         */
        private startMove = (event: MouseEvent|TouchEvent) => {
            event.preventDefault();
            this.ox = this.getClientX(event);
            this.oy = this.getClientY(event);
            this.$previewContainer.on('mousemove touchmove', this.move);
            this.$previewContainer.on('mouseup touchend mouseleave', this.endMove)
        };

        /**
         * Event handler to be invoked on dragging the preview container.
         */
        private move = (event: MouseEvent|TouchEvent) => {
            event.preventDefault();
            this.dx = this.getClientX(event) - this.ox;
            this.dy = this.getClientY(event) - this.oy;
            this.$scope.$apply(() => {
                this.resizeContainerStyle.transform = this.makeTransformString(this.dx, this.dy);
            });
        };

        /**
         * Event handler to be invoked once dragging has ended.
         */
        private endMove = (event: MouseEvent|TouchEvent) => {
            event.preventDefault();
            this.resizePos.x += this.dx;
            this.resizePos.y += this.dy;
            this.$previewContainer.off('mousemove touchmove', this.move);
            this.$previewContainer.off('mouseup touchend mouseleave', this.endMove)
        };

        /**
         * Create a string representing the CSS "transform" property for positioning the
         * scale preview container.
         * @param dx - an x delta to offset the position by
         * @param dy - a y delta to offset the position by
         */
        private makeTransformString(dx = 0, dy = 0): string {
            let x = dx + this.resizePos.x - this.params.cropWidth * this.scale / 2;
            let y = dy + this.resizePos.y - this.params.cropHeight * this.scale / 2;
            return `translate3d(${x}px, ${y}px, 0)`;
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
            this.scale = this.scaleWidth / this.params.cropWidth;
            this.updateScaleDimensions();
        }

        /**
         * Set the scale based on a change to the height value
         */
        public changeScaleHeight() {
            this.scale = this.scaleHeight / this.params.cropHeight;
            this.updateScaleDimensions();
        }

        /**
         * Calculate and update the scaled dimensions of the image.
         */
        private updateScaleDimensions() {
            this.scaleWidth = Math.round(this.params.cropWidth * this.scale);
            this.scaleHeight = Math.round(this.params.cropHeight * this.scale);
            this.setImageResizeStyles();
        }

        /**
         * Calculate and set values for the objects which are bound to the resize preview DOM CSS.
         */
        public setImageResizeStyles() {
            const scale = (val: number) => val * this.scale;

            this.resizeImageStyle = {
                width: scale(this.params.imageWidth) + 'px',
                height: scale(this.params.imageHeight) + 'px',
                'margin-left': -scale(this.params.cropX) + 'px',
                'margin-top': -scale(this.params.cropY) + 'px'
            };
            this.resizeContainerStyle = {
                width: scale(this.params.cropWidth) + 'px',
                height: scale(this.params.cropHeight) + 'px',
                transform: this.makeTransformString()
            };
        }

        /**
         * Get the "clientX" property from a Mouse/Touch event.
         */
        private getClientX(event): number {
            return this.getEventProp(event, 'clientX');
        }

        /**
         * Get the "clientY" property from a Mouse.Touch event.
         */
        private getClientY(event): number {
            return this.getEventProp(event, 'clientY');
        }

        /**
         * Get the named property from an event, accounting for differences between a MouseEvent and a
         * TouchEvent in different browsers. E.g. in Chrome, a TouchEvent exposes a "touches" array containing
         * the properties of each touch.
         */
        private getEventProp(event: MouseEvent|TouchEvent, prop: string): any {
            return (event instanceof TouchEvent) ? event.touches[0][prop] : event[prop];
        }

    }

    function imageEditorResizerDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/imageEditor/imageEditorResizer.html',
            controller: 'ImageEditorResizerController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                params: '=',
                onResize: '&'
            }
        }
    }

    angular.module('meshAdminUi.projects.imageEditor')
        .directive('imageEditorResizer', imageEditorResizerDirective)
        .controller('ImageEditorResizerController', ImageEditorResizerController);
}
