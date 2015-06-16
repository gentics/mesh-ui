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
            delete window._googleMapsIsLoading;
            var mapCanvas = element[0].querySelector('.map-container');
            var mapOptions = {
                center: { lat: parseFloat(scope.microschemaModel.latitude), lng: parseFloat(scope.microschemaModel.longitude)},
                zoom: 12
            };
            map = new google.maps.Map(mapCanvas, mapOptions);

            google.maps.event.addListener(map, 'center_changed', function() {
                var center = map.getCenter();
                scope.$apply(function() {
                    scope.microschemaModel.latitude = center.lat();
                    scope.microschemaModel.longitude = center.lng();
                });
            });

        }

        scope.$watchCollection('microschemaModel', updateMapSrc);

        function updateMapSrc() {
            if (map) {
                if (scope.microschemaModel.latitude && scope.microschemaModel.longitude) {
                    map.panTo({lat: parseFloat(scope.microschemaModel.latitude), lng: parseFloat(scope.microschemaModel.longitude)});
                }
            }
        }

    }

    function prependScriptNode(element, callback) {
        if ((window.google && window.google.maps) || window._googleMapsIsLoading) {
            // hacky polling to see if the Google Maps script has loaded and initialized yet.
            (function checkLoaded() {
                if (window._googleMapsIsLoading) {
                    setTimeout(checkLoaded, 50);
                } else {
                    callback();
                }
            })();
        } else {
            window.geolocationWidgetCallback = callback;
            window._googleMapsIsLoading = true;
            var mapScriptNode = document.createElement('script');
            mapScriptNode.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&callback=geolocationWidgetCallback&key=" + GOOGLE_MAPS_API_KEY;
            mapScriptNode.type = 'text/javascript';
            element.prepend(mapScriptNode);
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