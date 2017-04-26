import { BaseProperties } from './common.model';

export type CommonFieldType = 'node' | 'boolean' | 'string' | 'number' | 'date' | 'html';
export type SchemaFieldType = CommonFieldType | 'micronode' | 'binary' | 'list';
export type MicroschemaFieldType = CommonFieldType  | 'binary' | 'list';
export type ListTypeFieldType = CommonFieldType | 'micronode';

export interface BaseSchemaField {
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

export interface Schema extends BaseProperties {
    name: string;
    version: number;
    fields: SchemaField[];
    displayField: string;
    segmentField: string;
    container: boolean;
}
