import { ApiBase } from './api-base.service';
import { apiDelete, apiGet, apiPost, apiPostWithoutBody } from './api-methods';
import { GenericMessageResponse, NodeResponse, NodeUpdateRequest } from '../../../common/models/server-models';

export class ProjectApi {
    constructor(private apiBase: ApiBase) { }

    /** Assign a microschema version to a release. */
    assignMicroschemaToRelease = apiPostWithoutBody('/{project}/releases/{releaseUuid}/microschemas');

    /** Assign a schema version to a release. */
    assignSchemaToRelease = apiPostWithoutBody('/{project}/releases/{releaseUuid}/schemas');

    /** Assign a single tag to a node, keeping other assigned tags. */
    assignTagToNode = apiPostWithoutBody('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Update the list of assigned tags. */
    assignTagsToNode = apiPost('/{project}/nodes/{nodeUuid}/tags');

    /** Create a new node. */
    createNode = apiPost('/{project}/nodes');

    /** Create a new project release and automatically invoke a node migration. */
    createRelease = apiPost('/{project}/releases');

    /** Create a new tag family. */
    createTagFamily = apiPost('/{project}/tagFamilies');

    /** Delete the language specific content of the node. */
    deleteLanguageContent = apiDelete('/{project}/nodes/{nodeUuid}/languages/{language}');

    /** Delete the node with the given uuid. */
    deleteNode = apiDelete('/{project}/nodes/{nodeUuid}');

    /** Delete the tag family with the given uuid. */
    deleteTagFamily = apiDelete('/{project}/tagFamilies/{tagFamilyUuid}');

    /** Download the binary field with the given name. */
    downloadBinaryField = apiGet('/{project}/nodes/{nodeUuid}/binary/{fieldName}');

    /** Returns a node. */
    getNode = apiGet('/{project}/nodes/{nodeUuid}');

    /** Load all child nodes and return a paged list response. */
    getNodeChildren = apiGet('/{project}/nodes/{nodeUuid}/children');

    /** Return the publish status for the given language of the node. */
    getNodeLangaugePublishStatus = apiGet('/{project}/nodes/{nodeUuid}/languages/{language}/published');

    /** Returns a navigation object for the provided node. */
    getNodeNavigation = apiGet('/{project}/nodes/{nodeUuid}/navigation');

    /** Return the published status of the node. */
    getNodePublishStatus = apiGet('/{project}/nodes/{nodeUuid}/published');

    /** Return a list of all tags which tag the node. */
    getNodeTags = apiGet('/{project}/nodes/{nodeUuid}/tags');

    /** Get all nodes that are tagged with a tag and return a paged list response. */
    getNodesWithTag = apiGet('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}/nodes');

    /** Return the info about a project. */
    getProjectByName = apiGet('/{project}');

    /** Load the project with the given uuid. */
    getProjectByUuid = apiGet('/projects/{projectUuid}');

    /** Read all microschemas which are assigned to the project. */
    getProjectMicroschemas = apiGet('/{project}/microschemas');

    /** Return a navigation for the node which is located using the given path. */
    getProjectNavigation = apiGet('/{project}/navroot/{path}');

    /** Read all nodes and return a paged list response. */
    getProjectNodes = apiGet('/{project}/nodes');

    /** Load the schema with the given uuid. */
    getProjectSchema = apiGet('/{project}/schemas/{schemaUuid}');

    /** Read all microschemas which are assigned to the project. */
    getProjectSchemas = apiGet('/{project}/schemas');

    /** Get a list of projects as a paged response. */
    getProjects = apiGet('/projects');

    /** Load the release with the given uuid. */
    getRelease = apiGet('/{project}/releases/{releaseUuid}');

    /** Load microschemas that are assigned to the release and return a paged list response. */
    getReleaseMicroschemas = apiGet('/{project}/releases/{releaseUuid}/microschemas');

    /** Load schemas that are assigned to the release and return a paged list response. */
    getReleaseSchemas = apiGet('/{project}/releases/{releaseUuid}/schemas');

    /** Load multiple releases and return a paged list response. */
    getReleases = apiGet('/{project}/releases');

    /** List a projects tag families and return a paged list response. */
    getTagFamilies = apiGet('/{project}/tagFamilies');

    /** Read the tag family with the given uuid. */
    getTagFamily = apiGet('/{project}/tagFamilies/{tagFamilyUuid}');

    /** Load a specified tag of a tag family. */
    getTagOfTagFamily = apiGet('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Load tags assigned to a specific tag family and return a paged list response. */
    getTagsOfTagFamily = apiGet('/{project}/tagFamilies/{tagFamilyUuid}/tags');

    /** Load the node or the node's binary data which is located using the provided path. */
    getWebrootContent = apiGet('/{project}/webroot/{path}');

    /** Move a node into a target node. */
    moveNode = apiPost('/{project}/nodes/{nodeUuid}/moveTo/{toUuid}');

    /** Publish the node with the given uuid. */
    publishNode = apiPostWithoutBody('/{project}/nodes/{nodeUuid}/published');

    /**
     * Remove the schema with the given uuid from the project. This will automatically
     * remove all schema versions of the given schema from all releases of the project.
     */
    removeSchemaFromProject = apiDelete('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Remove a tag from a given node. All other tags of the node are not modified. */
    removeTagFromNode = apiDelete('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Remove a tag from a given tag family. */
    removeTagFromTagFamily = apiDelete('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Invoke a search query for microschemas and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchMicroschemas = apiPost('/search/microschemas');

    /** Invoke a search query for nodes and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchNodes = apiPost('/search/nodes');

    /** Invoke a search query for projects and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchProjects = apiPost('/search/projects');

    /** Invoke a search query for schemas and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchSchemas = apiPost('/search/schemas');

    /** Invoke a search query for tagfamilies and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchTagFamilies = apiPost('/search/tagFamilies');

    /** Invoke a search query for tags and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchTags = apiPost('/search/tags');

    /**
     * Transform the image with the given field name and overwrite the stored image
     * with the transformation result.
     */
    transformBinaryField = apiPost('/{project}/nodes/{nodeUuid}/binaryTransform/{fieldName}');

    /** Unpublish the given node. */
    unpublishNode = apiDelete('/{project}/nodes/{nodeUuid}/published');

    /** Update the binaryfield with the given name. */
    // TODO: This is typed wrong in the RAML.
    // TODO: This is not supported yet by the API service.
    updateBinaryField = apiPost('/{project}/nodes/{nodeUuid}/binary/{fieldName}');

    /** Update the release with the given uuid. */
    updateRelease = apiPost('/{project}/releases/{releaseUuid}');

    /**
     * Returns a url to a node binary file
     */
    getBinaryFileUrl(project: string, nodeUuid: string, name: string): string {
        return this.apiBase.formatUrl('/{project}/nodes/{nodeUuid}/binary/{name}', { project, nodeUuid, name });
    }

    /**
     * Update the node with the given uuid. It is mandatory to specify the version
     * within the update request. Mesh will automatically check for version conflicts
     * and return a 409 error if a conflict has been detected. Additional conflict
     * checks for webrootpath conflicts will also be performed.
     */
    updateNode({ project, nodeUuid, language }: { project: string, nodeUuid: string, language: string }, updateRequest: NodeUpdateRequest) {
        // TODO: remove the "any" cast in the .post() call below once (https://jira.gentics.com/browse/CL-604) is resolved.
        return this.apiBase.post('/{project}/nodes/{nodeUuid}', { project, nodeUuid, lang: language } as any, updateRequest)
            .mapResponses<{ conflict: GenericMessageResponse | null; node: NodeResponse | null; }>({
                200: node => ({ node, conflict: null }),
                409: conflict => ({ node: null, conflict })
            });
    }

    /** Update the specified tag. */
    updateTag = apiPost('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Update the tag family with the given uuid. */
    updateTagFamily = apiPost('/{project}/tagFamilies/{tagFamilyUuid}');
}
