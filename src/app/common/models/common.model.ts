export interface UserReference {
    firstName: string;
    lastName: string;
    uuid: string;
}

export interface GroupReference {
    name: string;
    uuid: string;
}

export interface NodeReference {
    uuid: string;
    displayName: string;
    projectName: string;
    schema: SchemaReference;
}

export interface SchemaReference {
    name: string;
    uuid: string;
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
    uuid: string;
}

export type PermissionsArray = Array<'publish' | 'create' | 'update' | 'read' | 'readpublished' | 'delete'>;

/**
 * Common properties of all entities. Note that at this time, the Schema & Microschemas only return
 * uuid and permissions - this is a bug tracked by https://jira.gentics.com/browse/CL-537
 */
export interface BaseProperties {
    created: string;
    creator: UserReference;
    edited: string;
    editor: UserReference;
    permissions: PermissionsArray;
    uuid: string;
}

/**
 * Calling GET on a list endpoint (e.g. `api/v1/users/`) results in a paged list response.
 */
export interface ListResponse<T> {
    data: T[];
    _metainfo: {
        currentPage: number;
        perPage: number;
        pageCount: number;
        totalCount: number;
    };
}
