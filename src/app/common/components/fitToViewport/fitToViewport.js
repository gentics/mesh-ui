angular.module('meshAdminUi.common')
.directive('fitToViewport', fitToViewportDirective);

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