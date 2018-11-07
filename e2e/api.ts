import { browser } from 'protractor';
import * as rp from 'request-promise';

import { HasUuid } from '../src/app/common/models/common.model';
import { MeshNode } from '../src/app/common/models/node.model';
import { Project } from '../src/app/common/models/project.model';
import { SchemaCreateRequest } from '../src/app/common/models/server-models';

const project = 'demo';
const api = rp.defaults({
    baseUrl: browser.baseUrl + 'api/v1',
    jar: rp.jar(),
    json: true
});

const login$ = api.post('/auth/login', {
    body: {
        username: 'admin',
        password: 'admin'
    }
});

export function getProject(): Promise<Project> {
    return get(`/${project}`);
}

export function createFolder(parent: HasUuid, name: string, language = 'en'): Promise<MeshNode> {
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

export function createMicroschema(microschemaName: string): any {
    return post(`/microschemas/`, {
        container: true,
        displayField: 'name',
        name: microschemaName,
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

export function findNodeByUuid(uuid: string): Promise<MeshNode> {
    return get(`/${project}/nodes/${uuid}`);
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
    return api(url, { method, body, qs });
}
