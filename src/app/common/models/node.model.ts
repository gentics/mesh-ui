import { FieldMapFromServer, NodeResponse } from './server-models';
import { MicroschemaReference } from './common.model';

/* tslint:disable:no-empty-interface */

export interface NodeChildrenInfo {
    [schemaName: string]: {
        schemaUuid: string;
        count: number;
    };
}

export interface Version {
    uuid: string;
    number: string;
}

export type StringField = string;
export type HTMLField = string;
export type NumberField = number;
export type BooleanField = boolean;
export type DateField = string;
export type ListField<T extends ListNodeFieldType> = T[];
export interface BinaryField {
    fileName: string;
    fileSize: number;
    mimeType: string;
    sha512sum: string;
    dominantColor?: string;
    height?: number;
    width?: number;
}
export interface NodeField {
    uuid: string;
}
export interface MicronodeFieldMap {
    [fieldName: string]: MicronodeFieldType;
}
export interface NodeFieldMicronode {
    uuid: string;
    microschema: MicroschemaReference;
    fields: MicronodeFieldMap;
}

export type CommonNodeFieldType = StringField | HTMLField | NumberField | BooleanField | DateField | NodeField;
export type NodeFieldType = CommonNodeFieldType | BinaryField | NodeFieldMicronode | ListField<ListNodeFieldType>;
export type ListNodeFieldType = CommonNodeFieldType | BinaryField | NodeFieldMicronode;
export type MicronodeFieldType = CommonNodeFieldType | BinaryField;

export interface MeshNode extends NodeResponse {
    /** UUIDs of child nodes. Added in the application. */
    children?: string[];
}

export interface FieldMap extends FieldMapFromServer { }
