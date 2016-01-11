(function(window, document) {

    /**
     * Settings which can be configured per app instance, without requiring the app be re-built from
     * source.
     */
    var meshConfig = {
        // The URL to the Mesh API
        apiUrl: '/api/v1/',

        // Provide a URL for previewing nodes. When this option is used, a "preview" button will be available
        // in the node editor pane. Click it will POST the node data to the specified URL. The node will be
        // encoded as form data under the key "node", and its value will need to be de-serialized back into JSON
        // (e.g. using JSON.parse())
        previewUrl: '',

        // A microschema component is a custom form component which can be used to render a
        // specific microschema, in place of the default form generator.
        microschemaControls: [
            "geolocation/geolocationControl",
            "example/exampleControl"
        ],

        // List any plugins to be loaded and made available to the Aloha editor.
        // (For available plugins see http://www.alohaeditor.org/guides/plugins.html)
        // If left empty, the following default plugins will be used:
        // 'common/ui',
        // 'common/format',
        // 'common/table',
        // 'common/highlighteditables'
        // plus a custom link plugin (mesh/mesh-link) for linking to other Mesh nodes.
        alohaPlugins: [],

        // Custom settings object for the Aloha editor. If left empty, the default configuration
        // will be used.
        alohaSettings: {}
    };


    window.meshConfig = meshConfig;

})(window, document);