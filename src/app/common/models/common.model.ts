import { SafeUrl } from '@angular/platform-browser';

import { SchemaField } from './schema.model';
import {
    BranchMicroschemaInfoFromServer,
    NodeReferenceFromServer,
    PermissionInfoFromServer,
    SchemaReferenceFromServer,
    UserReferenceFromServer
} from './server-models';

export interface NodeReference extends NodeReferenceFromServer {}

export interface SchemaReference extends SchemaReferenceFromServer {
    uuid: string;
}

export interface MicroschemaReference extends BranchMicroschemaInfoFromServer {}

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

export const TAGS_FIELD_TYPE = '__TAGS__';

export interface ConflictedField {
    field: SchemaField | { type: typeof TAGS_FIELD_TYPE; name: string }; // We want to reuse the same structure to hold the diff of the Tags of node
    localValue: any;
    remoteValue: any;
    overwrite: boolean;
    conflictedFields?: ConflictedField[]; // Yeah baby, recursion. Needed for micronodes
    localURL?: string | SafeUrl;
    remoteURL?: string | SafeUrl;
    loading?: boolean;
}
