import { ApiBase } from './api-base.service';
import { apiGetMethod, apiPostMethodWithBody, apiPostMethod, apiDeleteMethod } from './api-methods';
import { ApiEndpoints, NodeResponse, NodeUpdateRequest, GenericMessageResponse } from '../../../common/models/server-models';

export class ProjectApi {
    constructor(private apiBase: ApiBase) { }

    /** Assign a microschema version to a release. */
    assignMicroschemaToRelease = apiPostMethod('/{project}/releases/{releaseUuid}/microschemas');

    /** Assign a schema version to a release. */
    assignSchemaToRelease = apiPostMethod('/{project}/releases/{releaseUuid}/schemas');

    /** Assign a single tag to a node, keeping other assigned tags. */
    assignTagToNode = apiPostMethod('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Update the list of assigned tags. */
    assignTagsToNode = apiPostMethodWithBody('/{project}/nodes/{nodeUuid}/tags');

    /** Create a new node. */
    createNode = apiPostMethodWithBody('/{project}/nodes');

    /** Create a new project release and automatically invoke a node migration. */
    createRelease = apiPostMethodWithBody('/{project}/releases');

    /** Create a new tag family. */
    createTagFamily = apiPostMethodWithBody('/{project}/tagFamilies');

    /** Delete the language specific content of the node. */
    deleteLanguageContent = apiDeleteMethod('/{project}/nodes/{nodeUuid}/languages/{language}');

    /** Delete the node with the given uuid. */
    deleteNode = apiDeleteMethod('/{project}/nodes/{nodeUuid}');

    /** Delete the tag family with the given uuid. */
    deleteTagFamily = apiDeleteMethod('/{project}/tagFamilies/{tagFamilyUuid}');

    /** Download the binary field with the given name. */
    downloadBinaryField = apiGetMethod('/{project}/nodes/{nodeUuid}/binary/{fieldName}');

    /** Load all child nodes and return a paged list response. */
    getNodeChildren = apiGetMethod('/{project}/nodes/{nodeUuid}/children');

    /** Return the publish status for the given language of the node. */
    getNodeLangaugePublishStatus = apiGetMethod('/{project}/nodes/{nodeUuid}/languages/{language}/published');

    /** Returns a navigation object for the provided node. */
    getNodeNavigation = apiGetMethod('/{project}/nodes/{nodeUuid}/navigation');

    /** Return the published status of the node. */
    getNodePublishStatus = apiGetMethod('/{project}/nodes/{nodeUuid}/published');

    /** Return a list of all tags which tag the node. */
    getNodeTags = apiGetMethod('/{project}/nodes/{nodeUuid}/tags');

    /** Get all nodes that are tagged with a tag and return a paged list response. */
    getNodesWithTag = apiGetMethod('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}/nodes');

    /** Return the info about a project. */
    getProjectByName = apiGetMethod('/{project}');

    /** Load the project with the given uuid. */
    getProjectByUuid = apiGetMethod('/projects/{projectUuid}');

    /** Read all microschemas which are assigned to the project. */
    getProjectMicroschemas = apiGetMethod('/{project}/microschemas');

    /** Return a navigation for the node which is located using the given path. */
    getProjectNavigation = apiGetMethod('/{project}/navroot/{path}');

    /** Load the node with the given uuid. */
    getProjectNode = apiGetMethod('/{project}/nodes/{nodeUuid}');

    /** Read all nodes and return a paged list response. */
    getProjectNodes = apiGetMethod('/{project}/nodes');

    /** Load the schema with the given uuid. */
    getProjectSchema = apiGetMethod('/{project}/schemas/{schemaUuid}');

    /** Read all microschemas which are assigned to the project. */
    getProjectSchemas = apiGetMethod('/{project}/schemas');

    /** Get a list of projects as a paged response. */
    getProjects = apiGetMethod('/projects');

    /** Load the release with the given uuid. */
    getRelease = apiGetMethod('/{project}/releases/{releaseUuid}');

    /** Load microschemas that are assigned to the release and return a paged list response. */
    getReleaseMicroschemas = apiGetMethod('/{project}/releases/{releaseUuid}/microschemas');

    /** Load schemas that are assigned to the release and return a paged list response. */
    getReleaseSchemas = apiGetMethod('/{project}/releases/{releaseUuid}/schemas');

    /** Load multiple releases and return a paged list response. */
    getReleases = apiGetMethod('/{project}/releases');

    /** List a projects tag families and return a paged list response. */
    getTagFamilies = apiGetMethod('/{project}/tagFamilies');

    /** Read the tag family with the given uuid. */
    getTagFamily = apiGetMethod('/{project}/tagFamilies/{tagFamilyUuid}');

    /** Load a specified tag of a tag family. */
    getTagOfTagFamily = apiGetMethod('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Load tags assigned to a specific tag family and return a paged list response. */
    getTagsOfTagFamily = apiGetMethod('/{project}/tagFamilies/{tagFamilyUuid}/tags');

    /** Load the node or the node's binary data which is located using the provided path. */
    getWebrootContent = apiGetMethod('/{project}/webroot/{path}');

    /** Move a node into a target node. */
    moveNode = apiPostMethodWithBody('/{project}/nodes/{nodeUuid}/moveTo/{toUuid}');

    /** Publish the node with the given uuid. */
    publishNode = apiPostMethod('/{project}/nodes/{nodeUuid}/published');

    /**
     * Remove the schema with the given uuid from the project. This will automatically
     * remove all schema versions of the given schema from all releases of the project.
     */
    removeSchemaFromProject = apiDeleteMethod('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Remove a tag from a given node. All other tags of the node are not modified. */
    removeTagFromNode = apiDeleteMethod('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Remove a tag from a given tag family. */
    removeTagFromTagFamily = apiDeleteMethod('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Invoke a search query for microschemas and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchMicroschemas = apiPostMethodWithBody('/search/microschemas');

    /** Invoke a search query for nodes and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchNodes = apiPostMethodWithBody('/search/nodes');

    /** Invoke a search query for projects and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchProjects = apiPostMethodWithBody('/search/projects');

    /** Invoke a search query for schemas and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchSchemas = apiPostMethodWithBody('/search/schemas');

    /** Invoke a search query for tagfamilies and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchTagFamilies = apiPostMethodWithBody('/search/tagFamilies');

    /** Invoke a search query for tags and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchTags = apiPostMethodWithBody('/search/tags');

    /**
     * Transform the image with the given field name and overwrite the stored image
     * with the transformation result.
     */
    transformBinaryField = apiPostMethodWithBody('/{project}/nodes/{nodeUuid}/binaryTransform/{fieldName}');

    /** Unpublish the given node. */
    unpublishNode = apiDeleteMethod('/{project}/nodes/{nodeUuid}/published');

    /** Update the binaryfield with the given name. */
    // TODO: This is typed wrong in the RAML.
    // TODO: This is not supported yet by the API service.
    updateBinaryField = apiPostMethodWithBody('/{project}/nodes/{nodeUuid}/binary/{fieldName}');

    /** Update the release with the given uuid. */
    updateRelease = apiPostMethodWithBody('/{project}/releases/{releaseUuid}');

    /**
     * Update the node with the given uuid. It is mandatory to specify the version
     * within the update request. Mesh will automatically check for version conflicts
     * and return a 409 error if a conflict has been detected. Additional conflict
     * checks for webrootpath conflicts will also be performed.
     */
    updateNode({ project, nodeUuid }: { project: string, nodeUuid: string }, updateRequest: NodeUpdateRequest) {
        return this.apiBase.post('/{project}/nodes/{nodeUuid}', { project, nodeUuid }, updateRequest)
            .mapResponses<{ conflict: GenericMessageResponse } | { node: NodeResponse }>({
                200: node => ({ node }),
                409: conflict => ({ conflict })
            });
    }

    /** Update the specified tag. */
    updateTag = apiPostMethodWithBody('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Update the tag family with the given uuid. */
    updateTagFamily = apiPostMethodWithBody('/{project}/tagFamilies/{tagFamilyUuid}');
}
