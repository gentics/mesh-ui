import { ApiBase } from './api-base.service';
import { apiGetMethod } from './api-methods';

export class ProjectApi {
    constructor(private apiBase: ApiBase) { }

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
}
