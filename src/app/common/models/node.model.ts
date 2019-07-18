import { BranchMicroschemaInfoFromServer, FieldMapFromServer, NodeResponse } from './server-models';

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

export interface ImageTransform {
    width: number;
    height: number;
    cropRect: {
        startX: number;
        startY: number;
        width: number;
        height: number;
    };
    focalPointX: number;
    focalPointY: number;
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
    sha512sum?: string;
    dominantColor?: string;
    height?: number;
    width?: number;
    file?: File;
    transform?: ImageTransform;
    focalPoint?: {
        x: number;
        y: number;
    };
}
export interface NodeField {
    uuid: string;
}
export interface MicronodeFieldMap {
    [fieldName: string]: MicronodeFieldType;
}
export interface NodeFieldMicronode {
    uuid: string;
    microschema: BranchMicroschemaInfoFromServer;
    fields: MicronodeFieldMap;
}

export type CommonNodeFieldType = StringField | HTMLField | NumberField | BooleanField | DateField | NodeField;
export type NodeFieldType = CommonNodeFieldType | BinaryField | NodeFieldMicronode | ListField<ListNodeFieldType>;
export type ListNodeFieldType = CommonNodeFieldType | BinaryField | NodeFieldMicronode;
export type MicronodeFieldType = CommonNodeFieldType | BinaryField;

export interface MeshNode extends NodeResponse {
    /**
     * Language can be overwritten. This is currently how new language variations
     * are created.
     */
    language?: string;
    // Override the RAML-based `fields` definition because it is incorrect.
    // See: https://github.com/gentics/mesh/issues/67
    fields: FieldMap;
}

export interface ProjectNode {
    node: MeshNode;
    project: string;
    branch?: string;
}

export interface FieldMap extends FieldMapFromServer {
    [name: string]: any;
}
