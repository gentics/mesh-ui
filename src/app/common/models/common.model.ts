import { SchemaReferenceFromServer, NodeReferenceFromServer } from './server-models';
export interface UserReference {
    firstName?: string;
    lastName?: string;
    uuid: string;
}

export interface GroupReference {
    name: string;
    uuid: string;
}

export interface ProjectReference {
    name: string;
    uuid: string;
}

export interface NodeReference extends NodeReferenceFromServer {
    // uuid: string;
    // displayName?: string;
    // projectName: string;
    // schema: SchemaReference;
}

export interface SchemaReference extends SchemaReferenceFromServer {
    // name: string;
    // uuid: string;
}

export interface MicroschemaReference {
    name: string;
    uuid: string;
}

export interface SchemaReferenceWithVersion extends SchemaReference {
    version: number;
}

export interface TagFamilyReference {
    name: string;
    uuid: string;
}

export interface TagReference {
    name: string;
    tagFamily: string;
    uuid: string;
}

export interface Permissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    publish: boolean;
    readPublished: boolean;
}

/** Common properties of all entities. */
export interface BaseProperties {
    created: string;
    creator: UserReference;
    edited: string;
    editor: UserReference;
    permissions: Permissions;
    rolePerms?: Permissions;
    uuid: string;
}
