import { ListTypeFieldType, SchemaField, SchemaFieldType } from '../../../common/models/schema.model';

/**
 * Returns the default value for a new instance of a SchemaField
 */
export function initializeFieldValue(field: SchemaField): any {
    if (field.defaultValue) {
        return field.defaultValue;
    }

    const isList = field.type === 'list';
    const type = isList ? field.listType as ListTypeFieldType : field.type;
    const defaultValue = typeToDefault(type, field);
    return isList ? [defaultValue] : defaultValue;
}

export function typeToDefault(type: SchemaFieldType, field: SchemaField): any {
    switch (type) {
        case 'html':
        case 'string':
            return '';
        case 'node':
            return null;
        case 'boolean':
            return false;
        case 'number':
            return field.min || 0;
        case 'date':
            return new Date().toISOString();
        default:
            return null;
    }
}
