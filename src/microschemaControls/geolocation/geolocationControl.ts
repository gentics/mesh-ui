declare var meshMicroschemaControls: any;
declare var google: any;

var meshMicroschemaControls = meshMicroschemaControls || {};

(function(register) {

    console.log('loaded geolocation code');

    // TODO: remove for production
    var GOOGLE_MAPS_API_KEY = "AIzaSyCKxhBHUymQG7L57NeRhJRdzlvO4kcymXU";

    /**
     * Custom input widget for geolocation microschema. Jus
     *
     * @returns {ng.IDirective} Directive definition objecton object
     */
    function geolocationWidgetDirective() {

        console.log('executed geolocation directive fn!');

        function geolocationWidgetLinkFn(scope, element) {
            var map;

            console.log('executed geolocation link fn!');


            prependScriptNode(element, initMap);

            function initMap() {
                delete window['_googleMapsIsLoading'];
                var mapCanvas = element[0].querySelector('.map-container');
                var mapOptions = {
                    center: {
                        lat: parseFloat(scope.microschemaModel.latitude),
                        lng: parseFloat(scope.microschemaModel.longitude)
                    },
                    zoom: 12,
                    scrollwheel: false
                };
                map = new google.maps.Map(mapCanvas, mapOptions);

                google.maps.event.addListener(map, 'center_changed', function () {
                    setTimeout(updateValues, 0);
                });

            }

            scope.$watchCollection('microschemaModel', updateMapSrc);

            function updateValues() {
                var center = map.getCenter();
                scope.$apply(function () {
                    scope.microschemaModel.latitude = center.lat();
                    scope.microschemaModel.longitude = center.lng();
                });
            }

            function updateMapSrc() {
                if (map) {
                    if (scope.microschemaModel.latitude && scope.microschemaModel.longitude) {
                        map.panTo({
                            lat: parseFloat(scope.microschemaModel.latitude),
                            lng: parseFloat(scope.microschemaModel.longitude)
                        });
                    }
                }
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
                window['geolocationWidgetCallback'] = callback;
                window['_googleMapsIsLoading'] = true;
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
            templateUrl: '../microschemaControls/geolocation/geolocationControl.html',
            scope: true
        };
    }

    register.geolocation = geolocationWidgetDirective;

}(meshMicroschemaControls));