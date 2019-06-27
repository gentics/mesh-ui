import { t, Selector } from 'testcafe';
import * as uuid from 'uuid-random';

import {
    MicroschemaCreateRequest,
    MicroschemaResponse,
    NodeResponse,
    SchemaCreateRequest,
    SchemaResponse
} from '../src/app/common/models/server-models';

import * as api from './api';

export function baseUrl() {
    return process.env.MESHUI_URL || 'http://localhost:4200';
}

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
export async function inTemporaryFolder(body: (parentNode: NodeResponse) => Promise<any>): Promise<any> {
    const project = await api.getProject();
    const parentNode = await api.createFolder(project.rootNode, 'tmpFolder' + uuid());

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
