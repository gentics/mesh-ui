import { initializeFieldValue } from './initialize-field-value';
import { Schema } from '../models/schema.model';
import { NodeCreateRequest } from '../models/server-models';

/**
 * Initializes a new Micronode based on the associated Microschema.
 * TODO - verify what's the version number for NodeFieldMicronode.microschema
 */


export function initializeNode(schema: Schema, parentNodeUuid: string, language: string): NodeCreateRequest {
    const node: NodeCreateRequest = {
        language,
        parentNode: { uuid : parentNodeUuid } as any,
        schema: {
            name: schema.name,
            uuid: schema.uuid,
            version: '0.0'
        },
        fields: {}
    };

    for (const field of schema.fields) {
        node.fields[field.name] = initializeFieldValue(field);
    }

    return node;
}
