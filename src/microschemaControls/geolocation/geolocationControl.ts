declare var meshMicroschemaControls: any;
declare var google: any;
declare var meshUiConfig: any;

var meshMicroschemaControls = meshMicroschemaControls || {};

(function(meshMicroschemaControls) {

    // TODO: remove for production
    var GOOGLE_MAPS_API_KEY = "AIzaSyCKxhBHUymQG7L57NeRhJRdzlvO4kcymXU";

    /**
     * Custom Google Maps-based control for the geolocation microschema.
     */
    function geolocationControlDirective() {

        function geolocationControlLinkFn(scope, element) {
            var map;

            prependScriptNode(element, initMap);

            scope.updateMapSrc = () => {
                if (map && scope.fields.latitude && scope.fields.longitude) {
                    map.panTo({
                        lat: parseFloat(scope.fields.latitude.value || 0),
                        lng: parseFloat(scope.fields.longitude.value || 0)
                    });
                }
            };

            function initMap() {
                delete window['_googleMapsIsLoading'];
                var mapCanvas = element[0].querySelector('.map-container');
                var mapOptions = {
                    center: {
                        lat: parseFloat(scope.fields.latitude.value || 0),
                        lng: parseFloat(scope.fields.longitude.value || 0)
                    },
                    zoom: 12,
                    scrollwheel: false
                };
                map = new google.maps.Map(mapCanvas, mapOptions);
                google.maps.event.addListener(map, 'dragend', function () {
                    setTimeout(updateValues, 0);
                });
            }

            function updateValues() {
                var center = map.getCenter();
                scope.$apply(function () {
                    scope.fields.latitude.value = center.lat();
                    scope.fields.longitude.value = center.lng();
                    scope.fields.latitude.update(center.lat());
                    scope.fields.longitude.update(center.lng());
                });
            }
        }

        function prependScriptNode(element, callback) {
            if ((window['google'] && window['google'].maps) || window['_googleMapsIsLoading']) {
                // hacky polling to see if the Google Maps script has loaded and initialized yet.
                (function checkLoaded() {
                    if (window['_googleMapsIsLoading']) {
                        setTimeout(checkLoaded, 50);
                    } else {
                        callback();
                    }
                })();
            } else {
                window['geolocationControlCallback'] = callback;
                window['_googleMapsIsLoading'] = true;
                var mapScriptNode = document.createElement('script');
                mapScriptNode.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&callback=geolocationControlCallback&key=" + GOOGLE_MAPS_API_KEY;
                mapScriptNode.type = 'text/javascript';
                element.prepend(mapScriptNode);
            }
        }

        return {
            restrict: 'E',
            replace: true,
            link: geolocationControlLinkFn,
            templateUrl: meshUiConfig.microschemaControlsLocation + '/geolocation/geolocationControl.html',
            scope: true
        };
    }

    meshMicroschemaControls.geolocation = geolocationControlDirective;

}(meshMicroschemaControls));