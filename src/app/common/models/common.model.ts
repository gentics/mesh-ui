import {
    ReleaseMicroschemaInfoFromServer, NodeReferenceFromServer, PermissionInfoFromServer, SchemaReferenceFromServer,
    UserReferenceFromServer
} from './server-models';

export interface NodeReference extends NodeReferenceFromServer {}

export interface SchemaReference extends SchemaReferenceFromServer {}

export interface MicroschemaReference extends ReleaseMicroschemaInfoFromServer {}

/** Common properties of all entities. */
export interface BaseProperties {
    created: string;
    creator: UserReferenceFromServer;
    edited: string;
    editor: UserReferenceFromServer;
    permissions: PermissionInfoFromServer;
    rolePerms?: PermissionInfoFromServer;
    uuid: string;
}

/** Contains an original value and a value with special formatting applied. */
export interface FilterSelection {
    value: string;
    valueFormatted: string;
    [propName: string]: any;
}
