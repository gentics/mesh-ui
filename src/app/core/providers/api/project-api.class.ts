import { map } from 'rxjs/operators';
import { MeshNode, ProjectNode } from 'src/app/common/models/node.model';
import { extractGraphQlResponse } from 'src/app/common/util/util';

import { GenericMessageResponse, NodeResponse, NodeUpdateRequest } from '../../../common/models/server-models';

import { ApiBase } from './api-base.service';
import { apiDelete, apiGet, apiPost, apiPostWithoutBody } from './api-methods';

export interface ImageTransformQueryParams {
    w?: number;
    h?: number;
    fpx?: number;
    fpy?: number;
    fpz?: number;
    crop?: string;
    rect?: string;
}

export class ProjectApi {
    constructor(private apiBase: ApiBase) {}

    /** Assign a microschema version to a branch. */
    assignMicroschemaToBranch = apiPostWithoutBody('/{project}/branches/{branchUuid}/microschemas');

    /** Assign a schema version to a branch. */
    assignSchemaToBranch = apiPostWithoutBody('/{project}/branches/{branchUuid}/schemas');

    /** Assign a single tag to a node, keeping other assigned tags. */
    assignTagToNode = apiPostWithoutBody('/{project}/nodes/{nodeUuid}/tags/{tagUuid}');

    /** Update the list of assigned tags. */
    assignTagsToNode = apiPost('/{project}/nodes/{nodeUuid}/tags');

    /** Create a new node. */
    createNode = apiPost('/{project}/nodes');

    /** Create a new project branch and automatically invoke a node migration. */
    createBranch = apiPost('/{project}/branches');

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
    getNodeLanguagePublishStatus = apiGet('/{project}/nodes/{nodeUuid}/languages/{language}/published');

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

    /** Load the branch with the given uuid. */
    getBranch = apiGet('/{project}/branches/{branchUuid}');

    /** Load microschemas that are assigned to the branch and return a paged list response. */
    getBranchMicroschemas = apiGet('/{project}/branches/{branchUuid}/microschemas');

    /** Load schemas that are assigned to the branch and return a paged list response. */
    getBranchSchemas = apiGet('/{project}/branches/{branchUuid}/schemas');

    /** Load multiple branches and return a paged list response. */
    getBranches = apiGet('/{project}/branches');

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

    /** Publish the node content with the given uuid and language */
    publishNodeLanguage = apiPostWithoutBody('/{project}/nodes/{nodeUuid}/languages/{language}/published');

    /**
     * Remove the schema with the given uuid from the project. This will automatically
     * remove all schema versions of the given schema from all branches of the project.
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
    searchNodes = apiPost('/{project}/search/nodes');

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
    searchTags = apiPost('/{project}/search/tags');

    /**
     * Transform the image with the given field name and overwrite the stored image
     * with the transformation result.
     */
    transformBinaryField = apiPost('/{project}/nodes/{nodeUuid}/binaryTransform/{fieldName}');

    /** Unpublish the given node. */
    unpublishNode = apiDelete('/{project}/nodes/{nodeUuid}/published');

    /** Unpublish a language of a node. */
    unpublishNodeLanguage(params: { project: string; nodeUuid: string; language: string }) {
        return this.apiBase.delete('/{project}/nodes/{nodeUuid}/languages/{language}/published', params).mapResponses({
            204: response => true,
            404: response => false
        });
    }

    /** Update the binaryfield with the given name. */
    // TODO: This is typed wrong in the RAML.
    // TODO: This is not supported yet by the API service.
    updateBinaryField = apiPost('/{project}/nodes/{nodeUuid}/binary/{fieldName}');

    /** Generate URL for the s3binaryfield upload. */
    generateS3Url = apiPost('/{project}/nodes/{nodeUuid}/s3binary/{fieldName}');

    /** Parse metadata for the s3binaryfield. */
    parseMetadata = apiPost('/{project}/nodes/{nodeUuid}/s3binary/{fieldName}/parseMetadata');

    /** Update the branch with the given uuid. */
    updateBranch = apiPost('/{project}/branches/{branchUuid}');

    /** Create a new tag for a givn tag family. */
    createTag = apiPost('/{project}/tagFamilies/{tagFamilyUuid}/tags');

    /** Update the specified tag. */
    updateTag = apiPost('/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}');

    /** Update the tag family with the given uuid. */
    updateTagFamily = apiPost('/{project}/tagFamilies/{tagFamilyUuid}');

    /**
     * Returns a url to a node binary file
     */
    getBinaryFileUrl(
        project: string,
        nodeUuid: string,
        name: string,
        language: string,
        version?: string,
        params: ImageTransformQueryParams = {}
    ): string {
        return this.apiBase.formatUrl('/{project}/nodes/{nodeUuid}/binary/{name}', {
            project,
            nodeUuid,
            name,
            version,
            lang: language,
            ...params
        });
    }

    /**
     * Update the node with the given uuid. It is mandatory to specify the version
     * within the update request. Mesh will automatically check for version conflicts
     * and return a 409 error if a conflict has been detected. Additional conflict
     * checks for webrootpath conflicts will also be performed.
     */
    updateNode(
        { project, nodeUuid, language }: { project: string; nodeUuid: string; language: string },
        updateRequest: NodeUpdateRequest
    ) {
        // TODO: remove the "any" cast in the .post() call below once (https://jira.gentics.com/browse/CL-604) is resolved.
        return this.apiBase
            .post('/{project}/nodes/{nodeUuid}', { project, nodeUuid, lang: language } as any, updateRequest)
            .mapResponses<{ conflict: GenericMessageResponse | null; node: NodeResponse | null }>({
                200: node => ({ node, conflict: null }),
                400: conflict => ({ node: null, conflict }),
                409: conflict => ({ node: null, conflict })
            });
    }

    /**
     * Returns the webroot path of the given node.
     * Returns null if the node has no path.
     */
    getPath({ branch, node }: ProjectNode): Promise<string | null> {
        return this.apiBase
            .post(
                '/{project}/graphql',
                { project: node.project.name! },
                {
                    query: `query getPath($uuid: String, $lang: [String]){
                node(uuid: $uuid, lang: $lang) {
                  path
                }
              }
            `,
                    variables: {
                        uuid: node.uuid,
                        lang: node.language
                    }
                }
            )
            .pipe(
                map(extractGraphQlResponse),
                map(response => response.node && response.node.path)
            )
            .toPromise();
    }
}
