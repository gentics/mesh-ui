import { Microschema } from '../models/microschema.model';
import { SchemaField, SchemaFieldType } from '../models/schema.model';

import { typeToDefault } from './initialize-field-value';
import { initializeMicronode } from './initialize-micronode';

/**
 * Given a SchemaField of type "list", returns a default value for a single list item.
 */
export function initializeListValue(field: SchemaField, microschema?: Microschema): any {
    if (field && field.type !== 'list') {
        throw new Error(`Expected a field of type "list", but got "${field.type}"`);
    }
    if (field.defaultValue) {
        return field.defaultValue;
    }
    if (field.listType === 'micronode') {
        if (microschema === undefined) {
            throw new Error(`A list of micronodes requires that a microschema be provided`);
        }
        return initializeMicronode(microschema);
    } else {
        return typeToDefault(field.listType as SchemaFieldType, field);
    }
}
