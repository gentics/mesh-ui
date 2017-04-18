// TODO: remove for production
var GOOGLE_MAPS_API_KEY = "AIzaSyCKxhBHUymQG7L57NeRhJRdzlvO4kcymXU";

/**
 * Custom Google Maps-based control for the geolocation microschema.
 */

var mapContainer = document.querySelector('#map-container');
var longitudeInput = document.querySelector('#longitude');
var latitudeInput = document.querySelector('#latitude');
var value;

window.initMeshControl = function(api) {
    var map;
    value = api.getValue();
    addGoogleMapsScript(initMap);

    longitudeInput.value = api.getValue().fields.longitude;
    latitudeInput.value = api.getValue().fields.latitude;

    api.onValueChange(function(value) {
        longitudeInput.value = value.fields && value.fields.longitude;
        latitudeInput.value = value.fields && value.fields.latitude;
    });

    function initMap() {
        var mapOptions = {
            center: {
                lat: parseFloat(value.fields.latitude || 0),
                lng: parseFloat(value.fields.longitude || 0)
            },
            zoom: 12
        };
        map = new google.maps.Map(mapContainer, mapOptions);
        google.maps.event.addListener(map, 'center_changed', function () {
            updateCoordinateValues(api, map);
        });

        setHostDimensions(api);

        longitudeInput.addEventListener('change', panToInputValues);
        latitudeInput.addEventListener('change', panToInputValues);

        function panToInputValues() {
            map.panTo({
                lat:  parseFloat(latitudeInput.value || 0),
                lng: parseFloat(longitudeInput.value || 0)
            });
            updateCoordinateValues(api, map);
        }
    }
};

function updateCoordinateValues(api, map) {
    var center = map.getCenter();
    api.setValue(center.lat(), api.path.concat(['fields', 'latitude']));
    api.setValue(center.lng(), api.path.concat(['fields', 'longitude']));
}

function setHostDimensions(api) {
    var boundingRect = document.body.getBoundingClientRect();
    var bodyHeight = boundingRect.bottom + boundingRect.top;
    api.setWidth('100%');
    api.setHeight(bodyHeight + 'px');
}

function addGoogleMapsScript(callback) {
    window['geolocationControlCallback'] = callback;
    var mapScriptNode = document.createElement('script');
    mapScriptNode.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&callback=geolocationControlCallback&key=" + GOOGLE_MAPS_API_KEY;
    mapScriptNode.type = 'text/javascript';
    document.head.appendChild(mapScriptNode);
}
