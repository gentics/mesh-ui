import { SchemaResponse } from './server-models';

export type CommonFieldType = 'node' | 'boolean' | 'string' | 'number' | 'date' | 'html';
export type SchemaFieldType = CommonFieldType | 'micronode' | 'binary' | 'list' | 's3binary';
export type MicroschemaFieldType = CommonFieldType | 'binary' | 'list' | 's3binary';
export type ListTypeFieldType = CommonFieldType | 'micronode';

export interface BaseSchemaField {
    autoPurge?: boolean;
    name: string;
    type: SchemaFieldType | MicroschemaFieldType;
    allow?: string[];
    defaultValue?: any;
    label?: string;
    listType?: ListTypeFieldType | CommonFieldType;
    max?: number;
    min?: number;
    options?: string[];
    required?: boolean;
    step?: number;
    control?: {
        use?: string;
        config?: {
            [key: string]: any;
        };
    };
}

export interface SchemaField extends BaseSchemaField {
    type: SchemaFieldType;
    listType?: ListTypeFieldType;
}

export interface Schema extends SchemaResponse {
    fields: SchemaField[];
}
