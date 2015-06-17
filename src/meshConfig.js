(function(window, document) {

    /**
     * Settings which can be configured per app instance, without requiring the app be re-built from
     * source.
     *
     * @name meshConfig
     */
    var meshConfig = {
        // The URL to the Mesh API
        apiUrl: 'mesh-mock-backend'
    };


    window.meshConfig = meshConfig;

})(window, document);