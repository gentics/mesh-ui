import { BaseSchemaField, CommonFieldType, MicroschemaFieldType } from './schema.model';
import { MicroschemaResponse } from './server-models';

export interface MicroschemaField extends BaseSchemaField {
    type: MicroschemaFieldType;
    listType?: CommonFieldType;
}

export interface Microschema extends MicroschemaResponse {
     fields: MicroschemaField[];
}
