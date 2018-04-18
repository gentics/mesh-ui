import {
    ReleaseMicroschemaInfoFromServer, NodeReferenceFromServer, PermissionInfoFromServer, SchemaReferenceFromServer,
    UserReferenceFromServer
} from './server-models';
import { SchemaField } from './schema.model';
import { SafeUrl } from '@angular/platform-browser';

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

export interface ConflictedField {
    field: SchemaField | { type: '__TAGS__', name: string }; // We want to reuse the same structure to hold the diff of the Tags of node
    mineValue: any;
    theirValue: any;
    overwrite: boolean;
    conflictedFields?: ConflictedField[]; // Yeah baby, recursion. Needed for micronodes
    mineURL?: string | SafeUrl;
    theirURL?: string | SafeUrl;
    loading?: boolean;
}
