import { browser } from 'protractor';
import * as rp from 'request-promise';

import { MeshNode } from '../src/app/common/models/node.model';
import { Project } from '../src/app/common/models/project.model';
import { Schema } from '../src/app/common/models/schema.model';

import { HasUuid } from './model';

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

export function createFolder(parent: HasUuid, name: string): Promise<MeshNode> {
    return post(`/${project}/nodes`, {
        schema: {
            name: 'folder'
        },
        language: 'en',
        parentNodeUuid: parent.uuid,
        fields: {
            name,
            slug: name
        }
    });
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

export function createSchema(schemaName: string): any {
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
    return deleteReq(`/schemas/${schema.uuid}`);
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
    return deleteReq(`/microschemas/${microschema.uuid}`);
}

export function deleteNode(node: HasUuid) {
    return deleteReq(`/${project}/nodes/${node.uuid}`, {
        recursive: true
    });
}

export function findNodeByUuid(uuid: string): Promise<MeshNode> {
    return get(`/${project}/nodes/${uuid}`);
}

export function moveNode(source: HasUuid, destination: HasUuid) {
    return post(`/${project}/nodes/${source.uuid}/moveTo/${destination.uuid}`);
}

function get(url: string, body?: any, qs?: any) {
    return request('GET', url, body);
}

function post(url: string, body?: any, qs?: any) {
    return request('POST', url, body);
}

function deleteReq(url: string, qs?: any) {
    return request('DELETE', url, undefined, qs);
}

async function request(method: string, url: string, body?: any, qs?: any) {
    await login$;
    return api(url, { method, body, qs });
}
