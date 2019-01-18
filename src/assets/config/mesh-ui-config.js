/* MESH UI configuration file */

window.MeshUiConfig = {
    /** The ISO-639-1 code of the default language */
    defaultLanguage: 'en',
    /** The ISO-639-1 codes of the available languages for the frontend app */
    uiLanguages: ['en', 'de'],
    /** The ISO-639-1 codes of the available languages for Mesh */
    contentLanguages: ['en', 'de'],
    /** The ISO-639-1 code of the language to be used in case a requested ressource is not available in the requested langauge */
    fallbackLanguage: 'en',
    /** This is the credential username for a ressource requested without authentication */
    anonymousUsername: 'anonymous',
    /**
     * Within the node editor in UI the feature "Preview" of a node will open a new tab to a defined frontend app.
     * Here a function can be provided returning the URL which will be called by that component.
     * 
     * @example:
     * ```javascript
     * previewUrls: [
     *    {
     *        label: 'Gentics Mesh Angular Demo',
     *        urlResolver: function (node) { return 'http://test.myapp/category/' + node.uuid + '?preview=true'; }
     *    }
     * ]
     * ```
     * */
    previewUrls: [
        {
            /** display name to see within preview url selection in frontend */
            label: 'Gentics Mesh Angular Demo',
            /**
             * Function to be called in frontend to get url
             * @param nodeUuid unique Mesh node
             */
            urlResolver: function (node) { return 'http://localhost:3000/product/' + node.uuid + '?preview=true'; }
        }
    ]
};
