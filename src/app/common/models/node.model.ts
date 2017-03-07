import {
    BaseProperties, NodeReference, TagReference,
    SchemaReferenceWithVersion, MicroschemaReference
} from './common.model';

export interface NodeChildrenInfo {
    [schemaName: string]: {
        schemaUuid: string;
        count: number;
    };
}

export interface Breadcrumb {
    uuid: string;
    displayName: string;
    path: string;
}

export interface TagTree {
    [tagFamilyName: string]: {
        items: TagReference[];
    };
}

export type NodeFieldString = string;
export type NodeFieldHTML = string;
export type NodeFieldNumber = number;
export type NodeFieldBoolean = boolean;
export type NodeFieldDate = string;
export type NodeFieldList<T extends ListableNodeFieldType> = T[];
export type NodeFieldBinary = {
    fileName: string;
    fileSize: number;
    mimeType: string;
    sha512sum: string;
    dominantColor?: string;
    height?: number;
    width?: number;
};
export type NodeFieldNode = {
    uuid: string;
};
export type NodeFieldMicronode = {
    uuid: string;
    microschema: MicroschemaReference;
    fields: { [fieldName: string]: MicronodeFieldType; };
};

export type CommonNodeFieldType = NodeFieldString | NodeFieldHTML | NodeFieldNumber | NodeFieldBoolean | NodeFieldDate | NodeFieldNode;
export type NodeFieldType = CommonNodeFieldType | NodeFieldBinary | NodeFieldMicronode | NodeFieldList<ListableNodeFieldType>;
export type ListableNodeFieldType = CommonNodeFieldType | NodeFieldBinary | NodeFieldMicronode;
export type MicronodeFieldType = CommonNodeFieldType | NodeFieldBinary;

export interface MeshNode extends BaseProperties {
    availableLanguages: string[];
    breadcrumb: Breadcrumb[];
    childrenInfo: NodeChildrenInfo;
    container: boolean;
    fields: { [fieldName: string]: NodeFieldType; };
    languagePaths: { [languageCode: string]: string; };
    parentNode: NodeReference;
    path: string;
    schema: SchemaReferenceWithVersion;
    tags: TagTree;
}
