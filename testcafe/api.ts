import * as rp from 'request-promise';

import { HasUuid } from '../src/app/common/models/common.model';
import { MeshNode } from '../src/app/common/models/node.model';
import { Project } from '../src/app/common/models/project.model';
import {
    MicroschemaCreateRequest,
    PermissionInfoFromServer,
    ProjectResponse,
    RoleListResponse,
    RoleResponse,
    TagFamilyListResponse,
    TagFamilyResponse,
    TagListResponse,
    TagResponse,
    UserListResponse
} from '../src/app/common/models/server-models';
import { SchemaCreateRequest } from '../src/app/common/models/server-models';

export interface FolderNode extends MeshNode {
    fields: {
        name: string;
        slug: string;
    };
}

export namespace api {
    export function baseUrl() {
        return process.env.MESHUI_URL || 'http://localhost:4200';
    }

    export function getProject(): Promise<Project> {
        return get(`/${project}`);
    }

    export function createFolder(parent: HasUuid, name: string, language = 'en'): Promise<FolderNode> {
        return post(
            `/${project}/nodes`,
            {
                schema: {
                    name: 'folder'
                },
                language,
                parentNodeUuid: parent.uuid,
                fields: {
                    name,
                    slug: name
                }
            },
            {
                lang: 'en,de'
            }
        );
    }

    export function createVehicle(parent: HasUuid, name: string): Promise<MeshNode> {
        return post(`/${project}/nodes`, {
            schema: {
                name: 'vehicle'
            },
            language: 'en',
            parentNodeUuid: parent.uuid,
            fields: {
                name,
                slug: name
            }
        });
    }

    export function createVehicleImage(parent: HasUuid, name: string, language = 'en'): Promise<MeshNode> {
        return post(`/${project}/nodes`, {
            schema: {
                name: 'vehicleImage'
            },
            language,
            parentNodeUuid: parent.uuid,
            fields: {
                name
            }
        });
    }

    export async function getSchema(schemaId: string) {
        const response = await get(`/schemas/${schemaId}`);
        return response.data || response;
    }

    export function createSchema(schema: SchemaCreateRequest) {
        return post('/schemas', schema);
    }

    export function createSimpleSchema(schemaName: string): any {
        return post(`/schemas`, {
            container: true,
            displayField: 'name',
            name: schemaName,
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                    required: true,
                    type: 'string'
                }
            ]
        });
    }

    export function deleteSchema(schema: HasUuid) {
        return deleteReq(`/schemas/${schema.uuid}`, {
            recursive: true
        });
    }

    export function createMicroschema(microschema: MicroschemaCreateRequest): any {
        return post(`/microschemas/`, microschema);
    }

    export function deleteMicroschema(microschema: HasUuid) {
        return deleteReq(`/microschemas/${microschema.uuid}`, {
            recursive: true
        });
    }

    export function deleteNode(node: HasUuid) {
        return deleteReq(`/${project}/nodes/${node.uuid}`, {
            recursive: true
        });
    }

    export function findNodeByUuid(uuid: string, lang?: string): Promise<MeshNode> {
        return get(`/${project}/nodes/${uuid}`, undefined, { lang });
    }

    export function webroot(path: string): Promise<MeshNode> {
        return get(`/${project}/webroot${path}`);
    }

    export function updateNode(node: MeshNode): Promise<MeshNode> {
        return post(`/${project}/nodes/${node.uuid}`, node);
    }

    export function moveNode(source: HasUuid, destination: HasUuid) {
        return post(`/${project}/nodes/${source.uuid}/moveTo/${destination.uuid}`);
    }

    export function assignSchemaToProject(schema: HasUuid) {
        return post(`/${project}/schemas/${schema.uuid}`);
    }

    export function assignMicroschemaToProject(schema: HasUuid) {
        return post(`/${project}/microschemas/${schema.uuid}`);
    }

    // TAGFAMILIES

    export function findTagFamilies(): Promise<TagFamilyListResponse> {
        return get(`/${project}/tagFamilies`);
    }

    export async function getTagFamilyByName(tagFamilyName: string): Promise<TagFamilyResponse> {
        const tagFamilies = await findTagFamilies();
        return tagFamilies.data.find(tagFamily => tagFamily.name === tagFamilyName)!;
    }

    // TAGS

    export function findTags(tagFamily: HasUuid): Promise<TagListResponse> {
        return get(`/${project}/tagFamilies/${tagFamily.uuid}/tags`);
    }

    export async function getTagByName(tagFamily: HasUuid, tagName: string): Promise<TagResponse> {
        const tagFamilies = await findTags(tagFamily);
        return tagFamilies.data.find(tag => tag.name === tagName)!;
    }

    // ROLE

    export async function getRoleByName(name: string): Promise<RoleResponse> {
        const roles = await findRoles();
        return roles.data.find(role => role.name === name)!;
    }

    export function findRoles(): Promise<RoleListResponse> {
        return get('/roles');
    }

    export function createRole(name: string): Promise<RoleResponse> {
        return post(`/roles`, { name });
    }

    export function deleteRole({ uuid }: HasUuid): Promise<any> {
        return deleteReq(`/roles/${uuid}`);
    }

    // PERMISSIONS

    export function getPermissions(role: HasUuid, path: PermissionsPath): Promise<PermissionInfoFromServer> {
        return get(`/roles/${role.uuid}/permissions${path.path}`);
    }

    // USER

    export async function deleteUserByName(name: string) {
        const users: UserListResponse = await get(`/users`);
        const uuid = users.data.filter(user => user.username === name)[0].uuid;
        await deleteUser(uuid);
    }

    export async function deleteUser(uuid: string) {
        await deleteReq(`/users/${uuid}`);
    }

    /**
     * Executes all API calls inside this block as the anonymous user.
     */
    export async function asAnonymousUser(body: () => Promise<any>): Promise<any> {
        activeApi = anonymousApi;
        try {
            return await body();
        } finally {
            activeApi = adminApi;
        }
    }

    // PROJECT

    export async function getProjectByName(name: string): Promise<ProjectResponse> {
        return get(`/${name}`);
    }

    export async function deleteProject({ uuid }: HasUuid): Promise<any> {
        await deleteReq(`/projects/${uuid}`);
    }

    export async function deleteProjectByName(name: string): Promise<any> {
        const project = await getProjectByName(name);
        await deleteProject(project);
    }
}

export class PermissionsPath {
    private constructor(public readonly path: string) {}

    static role(role: HasUuid) {
        return new PermissionsPath(`/roles/${role.uuid}`);
    }

    static project(project: HasUuid) {
        return new PermissionsPath(`/projects/${project.uuid}`);
    }

    static node(project: HasUuid, node: HasUuid) {
        return new PermissionsPath(`/projects/${project.uuid}/nodes/${node.uuid}`);
    }

    static tagFamily(project: HasUuid, tagFamily: HasUuid) {
        return new PermissionsPath(`/projects/${project.uuid}/tagFamilies/${tagFamily.uuid}`);
    }

    static tag(project: HasUuid, tagFamily: HasUuid, tag: HasUuid) {
        return new PermissionsPath(`/projects/${project.uuid}/tagFamilies/${tagFamily.uuid}/tags/${tag.uuid}`);
    }

    static roleRoot() {
        return new PermissionsPath('/roles');
    }

    static projectRoot() {
        return new PermissionsPath('/projects');
    }
}

function get(url: string, body?: any, qs?: any) {
    return request('GET', url, body, qs);
}

function post(url: string, body?: any, qs?: any) {
    return request('POST', url, body, qs);
}

function deleteReq(url: string, qs?: any) {
    return request('DELETE', url, undefined, qs);
}

async function request(method: string, url: string, body?: any, qs?: any) {
    await login$;
    return activeApi(url, { method, body, qs });
}

const project = 'demo';
const adminApi = rp.defaults({
    jar: rp.jar(),
    json: true,
    baseUrl: `${api.baseUrl()}/api/v1`
});

const anonymousApi = rp.defaults({
    json: true,
    baseUrl: `${api.baseUrl()}/api/v1`
});

const login$ = adminApi.post(`/auth/login`, {
    body: {
        username: 'admin',
        password: 'admin'
    }
});

let activeApi = adminApi;
