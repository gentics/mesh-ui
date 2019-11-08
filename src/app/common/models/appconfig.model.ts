import { MeshNode } from './node.model';

/**
 * Interface for Mesh UI app configuration
 */

export interface MeshUiAppConfig {
    /** The ISO-639-1 code of the default language */
    readonly defaultLanguage: string;
    /** The ISO-639-1 codes of the available languages for the frontend app */
    readonly uiLanguages: string[];
    /** The ISO-639-1 codes of the available languages for Mesh */
    readonly contentLanguages: string[];
    /** The ISO-639-1 code of the language to be used in case a requested ressource is not available in the requested langauge */
    readonly fallbackLanguage: string;
    /** This is the credential username for a ressource requested without authentication */
    readonly anonymousUsername: string;
    /** This is the number of items displayed per page in the content list (pagination) */
    readonly contentItemsPerPage: number;
    /**
     * Within the node editor in UI the feature "Preview" of a node will open a new tab to a defined frontend app.
     * Here, a function can be provided returning the URL which will be called by that component.
     * Preview URLs are defined per project, identified via project name property.
     *
     * @example:
     * ```javascript
     * previewUrls: {
     *  "demo": [
     *    {
     *        label: 'Gentics Mesh Angular Demo',
     *        urlResolver: function (node) { return 'http://test.myapp/category/' + node.uuid + '?preview=true'; }
     *    }
     * ]
     *
     * ```
     * */
    readonly previewUrls: { [projectUuid: string]: MeshPreviewUrl[] };
}

export interface MeshPreviewUrl {
    /** Display name to see within preview url selection in frontend */
    readonly label: string;
    /** Function to be called in frontend to get url */
    readonly urlResolver: MeshPreviewUrlResolver;
}

/**
 * Function assembling url string
 * @param nodeUuid unique identifier of a Mesh node
 * @param path Webroot path of the node. The path property will only be provided if the
 * resolveLinks query parameter has been set.
 */
export type MeshPreviewUrlResolver = (node: MeshNode) => string;
