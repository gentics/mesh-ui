angular.module('meshAdminUi.common')
.directive('fitToViewport', fitToViewportDirective);

/**
 * Behavioural directive that sets the height of the element to take up
 * the rest of the vertical space of the viewport.
 *
 * @param $window
 * @param $timeout
 * @returns {{restrict: string, link: fitToViewportLinkFn}}
 */
function fitToViewportDirective($window, $timeout) {

    function fitToViewportLinkFn(scope, element) {

        function setSize() {
            var offsetTop = element[0].offsetTop,
                windowHeight = $window.innerHeight;

            element[0].style.height = (windowHeight - offsetTop) + 'px';

            console.log('resized');
        }

        $timeout(setSize, 200);

        window.addEventListener('resize', setSize);

    }

    return {
        restrict: 'A',
        link: fitToViewportLinkFn
    };
}