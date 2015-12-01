(function(window, document) {

    /**
     * Settings which can be configured per app instance, without requiring the app be re-built from
     * source.
     *
     * @name meshConfig
     */
    var meshConfig = {
        // The URL to the Mesh API
        apiUrl: '/api/v1/',

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