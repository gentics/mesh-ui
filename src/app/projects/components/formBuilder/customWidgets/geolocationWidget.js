angular.module('meshAdminUi.projects.formBuilder')
    .directive('geolocationWidget', geolocationWidgetDirective);

// TODO: remove for production
var GOOGLE_MAPS_API_KEY = "AIzaSyCKxhBHUymQG7L57NeRhJRdzlvO4kcymXU";

/**
 * Custom input widget for geolocation microschema. Just a demo.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function geolocationWidgetDirective() {

    function geolocationWidgetLinkFn(scope, element) {
        var map;

        prependScriptNode(element, initMap);

        function initMap() {
            var mapCanvas = element[0].querySelector('.map-container');
            var mapOptions = {
                center: { lat: parseFloat(scope.vm.model.latitude), lng: parseFloat(scope.vm.model.longitude)},
                zoom: 12
            };
            map = new google.maps.Map(mapCanvas, mapOptions);
        }

        scope.$watchCollection('vm.model', updateMapSrc);


        function updateMapSrc() {
            if (map) {
                map.panTo({lat: parseFloat(scope.vm.model.latitude), lng: parseFloat(scope.vm.model.longitude)});
            }
        }

    }

    function prependScriptNode(element, callback) {
        if (!window.google || !window.google.maps) {
            window.geolocationWidgetCallback = callback;
            var mapScriptNode = document.createElement('script');
            mapScriptNode.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&callback=geolocationWidgetCallback&key=" + GOOGLE_MAPS_API_KEY;
            mapScriptNode.type = 'text/javascript';
            element.prepend(mapScriptNode);
        } else {
            callback();
        }
    }

    return {
        restrict: 'E',
        replace: true,
        link: geolocationWidgetLinkFn,
        templateUrl: 'projects/components/formBuilder/customWidgets/geolocationWidget.html',
        scope: true
    };
}