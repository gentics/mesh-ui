module meshAdminUi {


    class ResizerController {

        public resizerStyle = {
            'max-width' : '50%',
            'min-width' : '50%'
        };
        private resizerMouseIsDown = false;


        constructor(private $scope: ng.IScope, $element: ng.IAugmentedJQuery) {
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
            })
        }

        public resizerMousedown(event) {
            this.resizerMouseIsDown = true;
            event.preventDefault();
        }

        public resizerMouseup(event) {
            this.resizerMouseIsDown = false;
        }

        public resizerMousemove(event: any) {
            if (this.resizerMouseIsDown) {
                let minWidth = 20,
                    maxWidth = 80,
                    barWidth = 10,
                    mouseLeftOffset = event.clientX,
                    containerWidth = event.currentTarget.offsetWidth,
                    mouseContainerOffset = mouseLeftOffset - event.currentTarget.offsetLeft - barWidth,
                    percentage = Math.max(Math.min(mouseContainerOffset / containerWidth * 100, maxWidth), minWidth);

                this.$scope.$apply(() => {
                    this.resizerStyle = {
                        'max-width': percentage + '%',
                        'min-width': percentage + '%'
                    };
                });
                // if the mouse has moved outside of the container, trigger the mouseup event.
                if (event.clientY < event.currentTarget.getBoundingClientRect().top) {
                    this.resizerMouseup(event);
                }
            }
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
                scope.mouseDown = (event) => {
                    ctrl.resizerMousedown(event);
                }
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