// Auto-generated from the RAML for Version 0.7 of the Gentics Mesh REST API.

type Integer = number;

/**
 * Optional node reference of the user.
 * Users can directly reference a single node.
 * This can be used to store additional data that is user related.
 */
export interface ExpandableNodeFromServer {
    uuid?: string;
}

/** Dynamic map with fields of the node content. */
export interface FieldMapFromServer {
    empty?: boolean;
}

export interface FieldSchemaFromServer {
    allChangeProperties?: { [key: string]: any };
    label?: string;
    name?: string;
    required?: boolean;
    type?: string;
}

export interface GenericMessageResponseFromServer {
    /** Internal developer friendly message */
    internalMessage?: string;
    /**
     * Enduser friendly translated message.
     * Translation depends on the 'Accept-Language' header value
     */
    message?: string;
    /** Map of i18n properties which were used to construct the provided message */
    properties?: { [key: string]: any };
}

export interface GroupListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: GroupResponseFromServer[];
}

export interface GroupReferenceFromServer {
    /** Name of the referenced element */
    name?: string;
    /** Uuid of the referenced element */
    uuid?: string;
}

export interface GroupResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** Name of the group */
    name?: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /** List of role references */
    roles?: RoleReferenceFromServer[];
    /** Uuid of the element */
    uuid: string;
}

export interface MeshServerInfoModelFromServer {
    /** Used database implementation vendor name. */
    databaseVendor?: string;
    /** Used database implementation version. */
    databaseVersion?: string;
    /** NodeId of the Gentics Mesh instance. */
    meshNodeId?: string;
    /** Gentics Mesh Version string. */
    meshVersion?: string;
    /** Used search implementation vendor name. */
    searchVendor?: string;
    /** Used search implementation version. */
    searchVersion?: string;
    /** Used vert.x version. */
    vertxVersion?: string;
}

export interface MicroschemaListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: MicroschemaResponseFromServer[];
}

export interface MicroschemaReferenceFromServer {
    /** Name of the referenced element */
    name?: string;
    /** Uuid of the referenced element */
    uuid?: string;
    version?: Integer;
}

export interface MicroschemaResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** Description of the microschema */
    description?: string;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** List of microschema fields */
    fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    name?: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    uuid: string;
    /** Version of the microschema */
    version?: Integer;
}

export interface NavigationElementFromServer {
    /** List of further child elements of the node. */
    children?: NavigationElementFromServer[];
    node?: NodeResponseFromServer;
    /** Uuid of the node within this navigation element. */
    uuid?: string;
}

export interface NavigationResponseFromServer {
    /** List of further child elements of the node. */
    children?: NavigationElementFromServer[];
    node?: NodeResponseFromServer;
    /** Uuid of the node within this navigation element. */
    uuid?: string;
}

export interface NodeChildrenInfoFromServer {
    /** Count of children which utilize the schema. */
    count?: Integer;
    /** Reference to the schema of the node child */
    schemaUuid?: string;
}

export interface NodeListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: NodeResponseFromServer[];
}

/**
 * The project root node.
 * All futher nodes are children of this node.
 */
export interface NodeReferenceFromServer {
    /**
     * Optional display name of the node.
     * A display field must be set in the schema in order to populate this property.
     */
    displayName?: string;
    /**
     * Webroot path of the node.
     * The path property will only be provided if the resolveLinks query parameter has been set.
     */
    path?: string;
    /** Name of the project to which the node belongs */
    projectName: string;
    /** Reference to the schema of the node */
    schema: SchemaReferenceFromServer;
    /** Uuid of the node */
    uuid: string;
}

export interface NodeResponseFromServer {
    /** List of languages for which content is available. */
    availableLanguages?: string[];
    /**
     * List of nodes which construct the breadcrumb.
     * Note that the start node will not be included in the list.
     */
    breadcrumb?: NodeReferenceFromServer[];
    /** Object which contains information about child elements. */
    childrenInfo?: { [key: string]: NodeChildrenInfoFromServer };
    container?: boolean;
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /**
     * Display field value of the node.
     * May not be retured if the node schema has no display field value
     */
    displayField?: string;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** Dynamic map with fields of the node content. */
    fields?: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    language?: string;
    /**
     * Map of webroot paths per language.
     * This property will only be populated if the resolveLinks query parameter has been set accordingly.
     */
    languagePaths?: { [key: string]: string };
    /**
     * The project root node.
     * All futher nodes are children of this node.
     */
    parentNode?: NodeReferenceFromServer;
    /**
     * Webroot path to the node content.
     * Will only be provided if the resolveLinks query parameter has been set accordingly.
     */
    path?: string;
    permissions: PermissionInfoFromServer;
    project?: ProjectResponseFromServer;
    rolePerms: PermissionInfoFromServer;
    /** Reference to the schema of the node */
    schema: SchemaReferenceFromServer;
    /** Map of tag family names and their group information. */
    tags?: { [key: string]: TagFamilyTagGroupFromServer };
    /** Uuid of the element */
    uuid: string;
    /** Reference to the version of the node content. */
    version?: VersionReferenceFromServer;
}

/** Paging information of the list result. */
export interface PagingMetaInfoFromServer {
    /** Number of the current page. */
    currentPage?: Integer;
    /** Number of the pages which can be found for the given per page count. */
    pageCount?: Integer;
    /** Number of elements which can be included in a single page. */
    perPage?: Integer;
    /** Number of all elements which could be found. */
    totalCount?: Integer;
}

export interface PermissionInfoFromServer {
    /** Flag which indicates whether the create permission is granted. */
    create?: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    delete?: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    publish?: boolean;
    /** Flag which indicates whether the read permission is granted. */
    read?: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readPublished?: boolean;
    /** Flag which indicates whether the update permission is granted. */
    update?: boolean;
}

export interface ProjectListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: ProjectResponseFromServer[];
}

export interface ProjectResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** The name of the project. */
    name?: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /**
     * The project root node.
     * All futher nodes are children of this node.
     */
    rootNode?: NodeReferenceFromServer;
    /** Uuid of the element */
    uuid: string;
}

export interface PublishStatusModelFromServer {
    /** ISO8601 formatted publish date string. */
    publishDate?: string;
    /** Flag which indicates whether the content is published. */
    published?: boolean;
    /** User reference of the creator of the element. */
    publisher: UserReferenceFromServer;
    /** Reference to the version of the node content. */
    version?: VersionReferenceFromServer;
}

export interface PublishStatusResponseFromServer {
    /** Map of publish status entries per language */
    availableLanguages?: { [key: string]: PublishStatusModelFromServer };
}

export interface ReleaseListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: ReleaseResponseFromServer[];
}

export interface ReleaseResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** Flag which indicates whether any active node migration for this release is still running or whether all nodes have been migrated to this release */
    migrated: boolean;
    /** Name of the release */
    name: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    uuid: string;
}

export interface RoleListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: RoleResponseFromServer[];
}

export interface RolePermissionResponseFromServer {
    /** Flag which indicates whether the create permission is granted. */
    create?: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    delete?: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    publish?: boolean;
    /** Flag which indicates whether the read permission is granted. */
    read?: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readPublished?: boolean;
    /** Flag which indicates whether the update permission is granted. */
    update?: boolean;
}

export interface RoleReferenceFromServer {
    /** Name of the referenced element */
    name?: string;
    /** Uuid of the referenced element */
    uuid?: string;
}

export interface RoleResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** List of groups which are assigned to the role. */
    groups?: GroupReferenceFromServer[];
    /** Name of the role. */
    name?: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    uuid: string;
}

export interface SchemaChangeModelFromServer {
    /** Optional migation script */
    migrationScript?: string;
    /** Type of operation for this change */
    operation?: string;
    properties?: { [key: string]: any };
    /** Uuid of the change entry */
    uuid?: string;
}

export interface SchemaChangesListModelFromServer {
    changes?: SchemaChangeModelFromServer[];
}

export interface SchemaListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: SchemaResponseFromServer[];
}

/** Reference to the schema of the node */
export interface SchemaReferenceFromServer {
    /** Name of the referenced element */
    name?: string;
    /** Uuid of the referenced element */
    uuid?: string;
    version?: Integer;
}

export interface SchemaResponseFromServer {
    /** Flag which indicates whether nodes which use this schema store additional child nodes. */
    container: boolean;
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** Description of the schema */
    description?: string;
    /** Name of the display field. */
    displayField: string;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** List of schema fields */
    fields: FieldSchemaFromServer[];
    /** Name of the schema */
    name: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /**
     * Name of the segment field.
     * This field is used to construct the webroot path to the node.
     */
    segmentField: string;
    /** Uuid of the element */
    uuid: string;
    /** Version of the schema */
    version: Integer;
}

export interface TagFamilyListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: TagFamilyResponseFromServer[];
}

/** Reference to the tag family to which the tag belongs. */
export interface TagFamilyReferenceFromServer {
    /** Name of the referenced element */
    name?: string;
    /** Uuid of the referenced element */
    uuid?: string;
}

export interface TagFamilyResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** Name of the tag family. */
    name?: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    uuid: string;
}

export interface TagFamilyTagGroupFromServer {
    /** List of tags that belong to the tag family in reference form. */
    items?: TagReferenceFromServer[];
    /** Uuid of the tag family. */
    uuid?: string;
}

export interface TagListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: TagResponseFromServer[];
}

export interface TagReferenceFromServer {
    /** Name of the referenced element */
    name?: string;
    /** Uuid of the referenced element */
    uuid?: string;
}

export interface TagResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the creator of the element. */
    editor: UserReferenceFromServer;
    /** Name of the tag. */
    name?: string;
    permissions: PermissionInfoFromServer;
    rolePerms: PermissionInfoFromServer;
    /** Reference to the tag family to which the tag belongs. */
    tagFamily?: TagFamilyReferenceFromServer;
    /** Uuid of the element */
    uuid: string;
}

export interface UserListResponseFromServer {
    /** Paging information of the list result. */
    _metainfo?: PagingMetaInfoFromServer;
    data?: UserResponseFromServer[];
}

export interface UserPermissionResponseFromServer {
    /** Flag which indicates whether the create permission is granted. */
    create?: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    delete?: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    publish?: boolean;
    /** Flag which indicates whether the read permission is granted. */
    read?: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readPublished?: boolean;
    /** Flag which indicates whether the update permission is granted. */
    update?: boolean;
}

/** User reference of the creator of the element. */
export interface UserReferenceFromServer {
    /** Firstname of the user */
    firstName?: string;
    /** Lastname of the user */
    lastName?: string;
    /** Uuid of the user */
    uuid: string;
}

export interface UserResponseFromServer {
    /** ISO8601 formatted created date string. */
    created: string;
    /** User reference of the creator of the element. */
    creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    edited: string;
    /** User reference of the editor of the element. */
    editor: UserReferenceFromServer;
    /** Email address of the user */
    emailAddress: string;
    /**
     * Flag which indicates whether the user is enabled or disabled.
     * Deleting a user will disable it.
     */
    enabled: boolean;
    /** Firstname of the user. */
    firstname: string;
    /** List of groups to which the user belongs */
    groups: GroupReferenceFromServer[];
    /** Lastname of the user. */
    lastname: string;
    /**
     * Optional node reference of the user.
     * Users can directly reference a single node.
     * This can be used to store additional data that is user related.
     */
    nodeReference?: ExpandableNodeFromServer;
    permissions: PermissionInfoFromServer;
    /**
     * Permission information for provided role.
     * This property will only be populated if a role query parameter has been specified.
     */
    rolePerms?: PermissionInfoFromServer;
    /** Username of the user. */
    username: string;
    /** Uuid of the element */
    uuid: string;
}

export interface UserTokenResponseFromServer {
    /** ISO8601 date of the creation date for the provided token */
    created: string;
    /** JSON Web Token which was issued by the API. */
    token: string;
}

/** Reference to the version of the node content. */
export interface VersionReferenceFromServer {
    /** Version number */
    number?: string;
    /** Uuid of the element */
    uuid: string;
}
