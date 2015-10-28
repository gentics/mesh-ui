module meshAdminUi {


    class ResizerController {

        public resizerStyle = {
            'max-width' : '50%',
            'min-width' : '50%'
        };
        private barWidth = 10;
        private percentage: number;
        public resizerMouseIsDown = false;
        public handleStyle: any = {};


        constructor(private $scope: ng.IScope, private $element: ng.IAugmentedJQuery) {
            const mouseUpHandler = (event) => {
                this.resizerMouseup(event);
            };
            const mouseMoveHandler = (event) => {
                this.resizerMousemove(event);
            };

            $element.on('mouseup', mouseUpHandler);
            $element.on('mousemove', mouseMoveHandler);

            $scope.$on('$destroy', () => {
                $element.off('mouseup', mouseUpHandler);
                $element.off('mousemove', mouseMoveHandler);
            });
        }

        public resizerMousedown(event: Event) {
            this.resizerMouseIsDown = true;
            event.preventDefault();
        }

        public resizerMouseup(event) {
            this.resizerMouseIsDown = false;
            this.$element.css({ position: 'relative' });
            this.$scope.$apply(() => {
                this.resizerStyle = {
                    'max-width': this.percentage + '%',
                    'min-width': this.percentage + '%'
                };
            });
        }

        public resizerMousemove(event: any): number {
            if (this.resizerMouseIsDown) {
                let minWidth = 20,
                    maxWidth = 80,
                    mouseLeftOffset = event.clientX,
                    containerWidth = event.currentTarget.offsetWidth,
                    mouseContainerOffset = mouseLeftOffset - this.getContainerOffset(),
                    percentage = mouseContainerOffset / containerWidth * 100;

                this.percentage = Math.max(Math.min(percentage, maxWidth), minWidth);

                // if the mouse has moved outside of the container, trigger the mouseup event.
                if (event.clientY < event.currentTarget.getBoundingClientRect().top) {
                    this.resizerMouseup(event);
                }

                if (minWidth < percentage && percentage < maxWidth) {
                    this.$scope.$apply(() => this.handleStyle.left = mouseContainerOffset + 'px');
                }
                event.preventDefault();
                return mouseContainerOffset;
            }
        }

        public getContainerOffset() {
            return this.$element[0].offsetLeft + this.barWidth / 2;
        }

    }

    function resizerDirective() {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/resizer/resizer.html',
            require: '^resizerFrame',
            replace: true,
            scope: {
            },
            link: (scope, element, attrs, ctrl: ResizerController) => {

                scope.ctrl = ctrl;

                scope.mouseDown = (event) => {
                    let resizeBar = <HTMLElement>document.querySelector('.resize-bar');
                    ctrl.handleStyle.height = resizeBar.getBoundingClientRect().height + 'px';
                    ctrl.handleStyle.left = (resizeBar.getBoundingClientRect().left - ctrl.getContainerOffset())+ 'px';
                    ctrl.resizerMousedown(event);
                };
            }
        };
    }

    function resizerFrameDirective() {

        return {
            restrict: 'A',
            controller: 'resizerController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                resizerStyle: '='
            }
        };
    }

    angular.module('meshAdminUi.projects')
        .controller('resizerController', ResizerController)
        .directive('resizer', resizerDirective)
        .directive('resizerFrame', resizerFrameDirective);

}