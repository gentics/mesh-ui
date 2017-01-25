import { BaseProperties } from './common.model';
import { BaseSchemaField, MicroschemaFieldType, CommonFieldType } from './schema.model';

export interface MicroschemaField extends BaseSchemaField {
    type: MicroschemaFieldType;
    listType?: CommonFieldType;
}

export interface Microschema extends BaseProperties {
     version: number;
     description: string;
     name: string;
     fields: MicroschemaField[];
}
