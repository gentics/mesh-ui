import { t, Selector } from 'testcafe';

import {
    MicroschemaCreateRequest,
    MicroschemaResponse,
    NodeResponse,
    RoleResponse,
    SchemaCreateRequest,
    SchemaResponse,
    UserResponse
} from '../src/app/common/models/server-models';

import { api, FolderNode } from './api';

export function formControlInput(name: string) {
    return Selector('gtx-input')
        .withAttribute('formcontrolname', name)
        .find('input');
}

export function formControlCheckbox(name: string) {
    return Selector('gtx-checkbox')
        .withAttribute('formcontrolname', name)
        .find('label');
}

/**
 * Creates a temporary folder in the root node of the project.
 * The folder and all its contents are deleted after the body has been executed.
 *
 * @param body A function that is executed
 */
export async function inTemporaryFolder(body: (parentNode: FolderNode) => Promise<any>): Promise<any> {
    const project = await api.getProject();
    const parentNode = await api.createFolder(project.rootNode, 'tmpFolder' + randomString());

    try {
        return await body(parentNode);
    } finally {
        await api.deleteNode(parentNode);
    }
}

/**
 * Creates a schema for the test and deletes it afterwards.
 */
export async function requiresSchema(
    schema: SchemaCreateRequest,
    body: (schema: SchemaResponse) => Promise<any>
): Promise<any> {
    const response = await api.createSchema(schema);
    await api.assignSchemaToProject(response);
    try {
        return await body(response);
    } finally {
        await api.deleteSchema(response);
    }
}

/**
 * Creates a microschema for the test and deletes it afterwards.
 */
export async function requiresMicroSchema(
    schema: MicroschemaCreateRequest,
    body: (schema: MicroschemaResponse) => Promise<any>
): Promise<any> {
    const response = await api.createMicroschema(schema);
    await api.assignMicroschemaToProject(response);
    try {
        return await body(response);
    } finally {
        await api.deleteMicroschema(response);
    }
}

export async function withTemporaryRole(body: (role: RoleResponse) => Promise<any>) {
    const response = await api.createRole(`tmpRole${randomString()}`);
    try {
        return await body(response);
    } finally {
        await api.deleteRole(response);
    }
}

export function randomString() {
    return Math.random()
        .toString(36)
        .substring(2);
}
