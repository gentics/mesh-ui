import {
    BaseProperties,
    MicroschemaReference,
    NodeReference,
    ProjectReference,
    SchemaReference,
    SchemaReferenceWithVersion,
    TagReference
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
    path?: string;
    projectName: string;
    schema: SchemaReference;
}

export interface Version {
    uuid: string;
    number: string;
}

export type NodeFieldString = string;
export type NodeFieldHTML = string;
export type NodeFieldNumber = number;
export type NodeFieldBoolean = boolean;
export type NodeFieldDate = string;
export type NodeFieldList<T extends ListableNodeFieldType> = T[];
export interface NodeFieldBinary {
    fileName: string;
    fileSize: number;
    mimeType: string;
    sha512sum: string;
    dominantColor?: string;
    height?: number;
    width?: number;
}
export interface NodeFieldNode {
    uuid: string;
}
export interface NodeFieldMicronode {
    uuid: string;
    microschema: MicroschemaReference;
    fields: { [fieldName: string]: MicronodeFieldType; };
}

export type CommonNodeFieldType = NodeFieldString | NodeFieldHTML | NodeFieldNumber | NodeFieldBoolean | NodeFieldDate | NodeFieldNode;
export type NodeFieldType = CommonNodeFieldType | NodeFieldBinary | NodeFieldMicronode | NodeFieldList<ListableNodeFieldType>;
export type ListableNodeFieldType = CommonNodeFieldType | NodeFieldBinary | NodeFieldMicronode;
export type MicronodeFieldType = CommonNodeFieldType | NodeFieldBinary;

export interface MeshNode extends BaseProperties {
    availableLanguages: string[];
    breadcrumb: Breadcrumb[];
    childrenInfo: NodeChildrenInfo;
    container: boolean;
    displayField: string;
    fields: { [fieldName: string]: NodeFieldType; };
    language: string;
    languagePaths?: { [language: string]: string};
    parentNode: NodeReference;
    path?: string;
    project: ProjectReference;
    schema: SchemaReferenceWithVersion;
    tags: TagReference[];
    version: Version;
}
