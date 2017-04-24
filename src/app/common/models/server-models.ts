// Auto-generated from the RAML for Version 0.9.6 of the Gentics Mesh REST API.

export type Integer = number;

export interface BinaryFieldTransformRequestFromServer {
    /** Crop area height. */
    readonly croph?: Integer;
    /** Crop area width. */
    readonly cropw?: Integer;
    /** Crop x axis start coordinate. */
    readonly cropx?: Integer;
    /** Crop y axis start coordinate. */
    readonly cropy?: Integer;
    /** New height of the image. */
    readonly height?: Integer;
    /** ISO 639-1 language tag of the node which provides the image which should be transformed. */
    readonly language: string;
    /** Reference to the version of the node content. */
    readonly version?: VersionReferenceFromServer;
    /** New width of the image. */
    readonly width?: Integer;
}

/**
 * New node reference of the user.
 * This can also explicitly set to null in order to remove the assigned node from the user
 */
export interface ExpandableNodeFromServer {
    readonly uuid?: string;
}

/** Dynamic map with fields of the node content. */
export interface FieldMapFromServer {
    readonly empty?: boolean;
}

export interface FieldSchemaFromServer {
    readonly label?: string;
    readonly name?: string;
    readonly required?: boolean;
    readonly type?: string;
}

/**
 * Returned for:
 *     POST /roles/{roleUuid}/permissions/{pathToElement}
 *     POST /schemas/{schemaUuid}/changes
 *     POST /microschemas/{microschemaUuid}/changes
 *     GET /admin/backup
 *     GET /admin/export
 *     GET /admin/import
 *     GET /admin/restore
 *     GET /admin/status
 *     GET /admin/status/migrations
 *     GET /search/createMappings
 *     GET /search/reindex
 *     GET /search/status
 *     GET /auth/logout
 *     POST /{project}/nodes/{nodeUuid}
 *     GET /{project}/releases/{releaseUuid}/migrateSchemas
 */
export interface GenericMessageResponseFromServer {
    /** Internal developer friendly message */
    readonly internalMessage?: string;
    /**
     * Enduser friendly translated message.
     * Translation depends on the 'Accept-Language' header value
     */
    readonly message?: string;
    /** Map of i18n properties which were used to construct the provided message */
    readonly properties?: { [key: string]: any };
}

export interface GroupCreateRequestFromServer {
    /** Name of the group. */
    readonly name: string;
}

/**
 * Returned for:
 *     GET /groups
 *     POST /search/groups
 */
export interface GroupListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: GroupResponseFromServer[];
}

export interface GroupReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *     POST /groups
 *     GET /groups/{groupUuid}
 *     POST /groups/{groupUuid}
 *     POST /groups/{groupUuid}/roles/{roleUuid}
 *     POST /groups/{groupUuid}/users/{userUuid}
 */
export interface GroupResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Name of the group */
    readonly name?: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** List of role references */
    readonly roles?: RoleReferenceFromServer[];
    /** Uuid of the element */
    readonly uuid: string;
}

export interface GroupUpdateRequestFromServer {
    /** New name of the group */
    readonly name: string;
}

export interface LoginRequestFromServer {
    /** Password of the user which should be logged in. */
    readonly password: string;
    /** Username of the user which should be logged in. */
    readonly username: string;
}

/**
 * Returned for: GET /
 */
export interface MeshServerInfoModelFromServer {
    /** Used database implementation vendor name. */
    readonly databaseVendor?: string;
    /** Used database implementation version. */
    readonly databaseVersion?: string;
    /** NodeId of the Gentics Mesh instance. */
    readonly meshNodeId?: string;
    /** Gentics Mesh Version string. */
    readonly meshVersion?: string;
    /** Used search implementation vendor name. */
    readonly searchVendor?: string;
    /** Used search implementation version. */
    readonly searchVersion?: string;
    /** Used vert.x version. */
    readonly vertxVersion?: string;
}

export interface MicroschemaCreateRequestFromServer {
    /** Description of the microschema */
    readonly description?: string;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name?: string;
}

/**
 * Returned for:
 *     GET /microschemas
 *     POST /search/microschemas
 *     GET /{project}/microschemas
 */
export interface MicroschemaListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: MicroschemaResponseFromServer[];
}

export interface MicroschemaReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
    readonly version?: Integer;
}

/**
 * Returned for:
 *     POST /microschemas
 *     GET /microschemas/{microschemaUuid}
 *     POST /microschemas/{microschemaUuid}
 *     POST /{project}/microschemas/{microschemaUuid}
 */
export interface MicroschemaResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** Description of the microschema */
    readonly description?: string;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name?: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the microschema */
    readonly version?: Integer;
}

export interface MicroschemaUpdateRequestFromServer {
    /** Description of the microschema */
    readonly description?: string;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name?: string;
    /** Version of the microschema */
    readonly version?: Integer;
}

export interface NavigationElementFromServer {
    /** List of further child elements of the node. */
    readonly children?: NavigationElementFromServer[];
    readonly node?: NodeResponseFromServer;
    /** Uuid of the node within this navigation element. */
    readonly uuid?: string;
}

/**
 * Returned for:
 *     GET /{project}/nodes/{nodeUuid}/navigation
 *     GET /{project}/navroot/{path}
 */
export interface NavigationResponseFromServer {
    /** List of further child elements of the node. */
    readonly children?: NavigationElementFromServer[];
    readonly node?: NodeResponseFromServer;
    /** Uuid of the node within this navigation element. */
    readonly uuid?: string;
}

export interface NodeChildrenInfoFromServer {
    /** Count of children which utilize the schema. */
    readonly count?: Integer;
    /** Reference to the schema of the node child */
    readonly schemaUuid?: string;
}

export interface NodeCreateRequestFromServer {
    /** Dynamic map with fields of the node content. */
    readonly fields?: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    readonly language: string;
    /**
     * The project root node.
     * All futher nodes are children of this node.
     */
    readonly parentNode: NodeReferenceFromServer;
    /**
     * Reference to the schema of the root node.
     * Creating a project will also automatically create the base node of the project and link the schema to the initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
    /** Reference to the version of the node content. */
    readonly version?: VersionReferenceFromServer;
}

/**
 * Returned for:
 *     POST /search/nodes
 *     GET /{project}/nodes
 *     GET /{project}/nodes/{nodeUuid}/children
 *     GET /{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}/nodes
 *     POST /{project}/search/nodes
 */
export interface NodeListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: NodeResponseFromServer[];
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
    readonly displayName?: string;
    /**
     * Webroot path of the node.
     * The path property will only be provided if the resolveLinks query parameter has been set.
     */
    readonly path?: string;
    /** Name of the project to which the node belongs */
    readonly projectName: string;
    /**
     * Reference to the schema of the root node.
     * Creating a project will also automatically create the base node of the project and link the schema to the initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
    /** Uuid of the node */
    readonly uuid: string;
}

/**
 * Returned for:
 *     POST /{project}/nodes
 *     GET /{project}/nodes/{nodeUuid}
 *     POST /{project}/nodes/{nodeUuid}
 *     POST /{project}/nodes/{nodeUuid}/binary/{fieldName}
 *     POST /{project}/nodes/{nodeUuid}/binaryTransform/{fieldName}
 *     POST /{project}/nodes/{nodeUuid}/tags/{tagUuid}
 */
export interface NodeResponseFromServer {
    /** List of languages for which content is available. */
    readonly availableLanguages?: string[];
    /**
     * List of nodes which construct the breadcrumb.
     * Note that the start node will not be included in the list.
     */
    readonly breadcrumb?: NodeReferenceFromServer[];
    /** Object which contains information about child elements. */
    readonly childrenInfo?: { [key: string]: NodeChildrenInfoFromServer };
    readonly container?: boolean;
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /**
     * Display field value of the node.
     * May not be retured if the node schema has no display field value
     */
    readonly displayField?: string;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Dynamic map with fields of the node content. */
    readonly fields?: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    readonly language?: string;
    /**
     * Map of webroot paths per language.
     * This property will only be populated if the resolveLinks query parameter has been set accordingly.
     */
    readonly languagePaths?: { [key: string]: string };
    /**
     * The project root node.
     * All futher nodes are children of this node.
     */
    readonly parentNode: NodeReferenceFromServer;
    /**
     * Webroot path to the node content.
     * Will only be provided if the resolveLinks query parameter has been set accordingly.
     */
    readonly path?: string;
    readonly permissions: PermissionInfoFromServer;
    readonly project?: ProjectResponseFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /**
     * Reference to the schema of the root node.
     * Creating a project will also automatically create the base node of the project and link the schema to the initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
    /** List of tags. */
    readonly tags?: TagReferenceFromServer[];
    /** Uuid of the element */
    readonly uuid: string;
    /** Reference to the version of the node content. */
    readonly version?: VersionReferenceFromServer;
}

export interface NodeUpdateRequestFromServer {
    /** Dynamic map with fields of the node content. */
    readonly fields?: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    readonly language: string;
    /** Reference to the version of the node content. */
    readonly version?: VersionReferenceFromServer;
}

/** Paging information of the list result. */
export interface PagingMetaInfoFromServer {
    /** Number of the current page. */
    readonly currentPage?: Integer;
    /** Number of the pages which can be found for the given per page count. */
    readonly pageCount?: Integer;
    /** Number of elements which can be included in a single page. */
    readonly perPage?: Integer;
    /** Number of all elements which could be found. */
    readonly totalCount?: Integer;
}

export interface PermissionInfoFromServer {
    /** Flag which indicates whether the create permission is granted. */
    readonly create?: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    readonly delete?: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    readonly publish?: boolean;
    /** Flag which indicates whether the read permission is granted. */
    readonly read?: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readonly readPublished?: boolean;
    /** Flag which indicates whether the update permission is granted. */
    readonly update?: boolean;
}

export interface ProjectCreateRequestFromServer {
    /** Name of the project */
    readonly name: string;
    /**
     * Reference to the schema of the root node.
     * Creating a project will also automatically create the base node of the project and link the schema to the initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
}

/**
 * Returned for:
 *     GET /projects
 *     POST /search/projects
 */
export interface ProjectListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: ProjectResponseFromServer[];
}

/**
 * Returned for:
 *     POST /projects
 *     GET /projects/{projectUuid}
 *     POST /projects/{projectUuid}
 *     GET /{project}
 */
export interface ProjectResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** The name of the project. */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /**
     * The project root node.
     * All futher nodes are children of this node.
     */
    readonly rootNode: NodeReferenceFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface ProjectUpdateRequestFromServer {
    /** New name of the project */
    readonly name: string;
}

/**
 * Returned for: GET /{project}/nodes/{nodeUuid}/languages/{language}/published
 */
export interface PublishStatusModelFromServer {
    /** ISO8601 formatted publish date string. */
    readonly publishDate?: string;
    /** Flag which indicates whether the content is published. */
    readonly published?: boolean;
    /** User reference of the creator of the element. */
    readonly publisher: UserReferenceFromServer;
    /** Reference to the version of the node content. */
    readonly version?: VersionReferenceFromServer;
}

/**
 * Returned for:
 *     GET /{project}/nodes/{nodeUuid}/published
 *     POST /{project}/nodes/{nodeUuid}/published
 */
export interface PublishStatusResponseFromServer {
    /** Map of publish status entries per language */
    readonly availableLanguages?: { [key: string]: PublishStatusModelFromServer };
}

export interface ReleaseCreateRequestFromServer {
    /** Name of the release */
    readonly name: string;
}

/**
 * Returned for: GET /{project}/releases
 */
export interface ReleaseListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: ReleaseResponseFromServer[];
}

/**
 * Returned for:
 *     POST /{project}/releases
 *     GET /{project}/releases/{releaseUuid}
 *     POST /{project}/releases/{releaseUuid}
 */
export interface ReleaseResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Flag which indicates whether any active node migration for this release is still running or whether all nodes have been migrated to this release */
    readonly migrated: boolean;
    /** Name of the release */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface ReleaseUpdateRequestFromServer {
    /** Name of the release */
    readonly name: string;
}

export interface RoleCreateRequestFromServer {
    /** New name of the role */
    readonly name: string;
}

/**
 * Returned for:
 *     GET /roles
 *     GET /groups/{groupUuid}/roles
 *     POST /search/roles
 */
export interface RoleListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: RoleResponseFromServer[];
}

export interface RolePermissionRequestFromServer {
    readonly permissions: PermissionInfoFromServer;
    /** Flag which indicates whether the permission update should be applied recursivly. */
    readonly recursive?: boolean;
}

/**
 * Returned for: GET /roles/{roleUuid}/permissions/{pathToElement}
 */
export interface RolePermissionResponseFromServer {
    /** Flag which indicates whether the create permission is granted. */
    readonly create?: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    readonly delete?: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    readonly publish?: boolean;
    /** Flag which indicates whether the read permission is granted. */
    readonly read?: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readonly readPublished?: boolean;
    /** Flag which indicates whether the update permission is granted. */
    readonly update?: boolean;
}

export interface RoleReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *     POST /roles
 *     GET /roles/{roleUuid}
 *     POST /roles/{roleUuid}
 */
export interface RoleResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** List of groups which are assigned to the role. */
    readonly groups?: GroupReferenceFromServer[];
    /** Name of the role. */
    readonly name?: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface RoleUpdateRequestFromServer {
    /** New name of the role */
    readonly name: string;
}

export interface SchemaChangeModelFromServer {
    /** Optional migation script */
    readonly migrationScript?: string;
    /** Type of operation for this change */
    readonly operation?: string;
    readonly properties?: { [key: string]: any };
    /** Uuid of the change entry */
    readonly uuid?: string;
}

/**
 * Returned for:
 *     POST /schemas/{schemaUuid}/diff
 *     POST /microschemas/{microschemaUuid}/diff
 */
export interface SchemaChangesListModelFromServer {
    readonly changes?: SchemaChangeModelFromServer[];
}

export interface SchemaCreateRequestFromServer {
    /** Flag which indicates whether nodes which use this schema store additional child nodes. */
    readonly container: boolean;
    /** Description of the schema */
    readonly description?: string;
    /** Name of the display field. */
    readonly displayField: string;
    /** List of schema fields */
    readonly fields: FieldSchemaFromServer[];
    /** Name of the schema */
    readonly name: string;
    /**
     * Name of the segment field.
     * This field is used to construct the webroot path to the node.
     */
    readonly segmentField: string;
}

/**
 * Returned for:
 *     GET /schemas
 *     POST /search/schemas
 *     GET /{project}/schemas
 */
export interface SchemaListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: SchemaResponseFromServer[];
}

/**
 * Reference to the schema of the root node.
 * Creating a project will also automatically create the base node of the project and link the schema to the initial release of the project.
 */
export interface SchemaReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
    readonly version?: Integer;
}

/**
 * Returned for:
 *     POST /schemas
 *     GET /schemas/{schemaUuid}
 *     POST /schemas/{schemaUuid}
 *     GET /{project}/schemas/{schemaUuid}
 *     POST /{project}/schemas/{schemaUuid}
 */
export interface SchemaResponseFromServer {
    /** Flag which indicates whether nodes which use this schema store additional child nodes. */
    readonly container: boolean;
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** Description of the schema */
    readonly description?: string;
    /** Name of the display field. */
    readonly displayField: string;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** List of schema fields */
    readonly fields: FieldSchemaFromServer[];
    /** Name of the schema */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /**
     * Name of the segment field.
     * This field is used to construct the webroot path to the node.
     */
    readonly segmentField: string;
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the schema */
    readonly version: Integer;
}

export interface SchemaUpdateRequestFromServer {
    /** Flag which indicates whether nodes which use this schema store additional child nodes. */
    readonly container: boolean;
    /** Description of the schema */
    readonly description?: string;
    /** Name of the display field. */
    readonly displayField: string;
    /** List of schema fields */
    readonly fields: FieldSchemaFromServer[];
    /** Name of the schema */
    readonly name: string;
    /**
     * Name of the segment field.
     * This field is used to construct the webroot path to the node.
     */
    readonly segmentField: string;
    /** Version of the schema */
    readonly version: Integer;
}

export interface TagFamilyCreateRequestFromServer {
    /** Name of the tag family which will be created. */
    readonly name: string;
}

/**
 * Returned for:
 *     POST /search/tagFamilies
 *     GET /{project}/tagFamilies
 *     POST /{project}/search/tagFamilies
 */
export interface TagFamilyListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: TagFamilyResponseFromServer[];
}

/** Reference to the tag family to which the tag belongs. */
export interface TagFamilyReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *     POST /{project}/tagFamilies
 *     GET /{project}/tagFamilies/{tagFamilyUuid}
 *     POST /{project}/tagFamilies/{tagFamilyUuid}
 */
export interface TagFamilyResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Name of the tag family. */
    readonly name?: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface TagFamilyUpdateRequestFromServer {
    /** New name of the tag family */
    readonly name: string;
}

/**
 * Returned for:
 *     POST /search/tags
 *     GET /{project}/nodes/{nodeUuid}/tags
 *     POST /{project}/nodes/{nodeUuid}/tags
 *     GET /{project}/tagFamilies/{tagFamilyUuid}/tags
 *     POST /{project}/search/tags
 */
export interface TagListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: TagResponseFromServer[];
}

export interface TagListUpdateRequestFromServer {
    /**
     * List of tags which should be assigned to the node.
     * Tags which are not included will be removed from the node.
     */
    readonly tags: TagReferenceFromServer[];
}

export interface TagReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    readonly tagFamily?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *     GET /{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}
 *     POST /{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}
 */
export interface TagResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Name of the tag. */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Reference to the tag family to which the tag belongs. */
    readonly tagFamily: TagFamilyReferenceFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface TagUpdateRequestFromServer {
    /** New name of the tag. */
    readonly name: string;
}

export interface UserCreateRequestFromServer {
    /** New email address of the user */
    readonly emailAddress?: string;
    /** New firstname of the user */
    readonly firstname?: string;
    /**
     * Optional group id for the user.
     * If provided the user will automatically be assigned to the identified group.
     */
    readonly groupUuid?: string;
    /** New lastname of the user */
    readonly lastname?: string;
    /**
     * New node reference of the user.
     * This can also explicitly set to null in order to remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    /** New password of the user */
    readonly password?: string;
    /** New username of the user */
    readonly username: string;
}

/**
 * Returned for:
 *     GET /users
 *     GET /groups/{groupUuid}/users
 *     POST /search/users
 */
export interface UserListResponseFromServer {
    /** Paging information of the list result. */
    readonly _metainfo?: PagingMetaInfoFromServer;
    readonly data?: UserResponseFromServer[];
}

/**
 * Returned for: GET /users/{userUuid}/permissions/{path}
 */
export interface UserPermissionResponseFromServer {
    /** Flag which indicates whether the create permission is granted. */
    readonly create?: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    readonly delete?: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    readonly publish?: boolean;
    /** Flag which indicates whether the read permission is granted. */
    readonly read?: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readonly readPublished?: boolean;
    /** Flag which indicates whether the update permission is granted. */
    readonly update?: boolean;
}

/** User reference of the creator of the element. */
export interface UserReferenceFromServer {
    /** Firstname of the user */
    readonly firstName?: string;
    /** Lastname of the user */
    readonly lastName?: string;
    /** Uuid of the user */
    readonly uuid: string;
}

/**
 * Returned for:
 *     POST /users
 *     POST /users/{userUuid}
 *     GET /users/{userUuid}
 *     GET /auth/me
 */
export interface UserResponseFromServer {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the editor of the element. */
    readonly editor?: UserReferenceFromServer;
    /** Email address of the user */
    readonly emailAddress: string;
    /**
     * Flag which indicates whether the user is enabled or disabled.
     * Deleting a user will disable it.
     */
    readonly enabled: boolean;
    /** Firstname of the user. */
    readonly firstname: string;
    /** List of groups to which the user belongs */
    readonly groups: GroupReferenceFromServer[];
    /** Lastname of the user. */
    readonly lastname: string;
    /**
     * New node reference of the user.
     * This can also explicitly set to null in order to remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    readonly permissions: PermissionInfoFromServer;
    /**
     * Permission information for provided role.
     * This property will only be populated if a role query parameter has been specified.
     */
    readonly rolePerms?: PermissionInfoFromServer;
    /** Username of the user. */
    readonly username: string;
    /** Uuid of the element */
    readonly uuid: string;
}

/**
 * Returned for: GET /users/{userUuid}/token
 */
export interface UserTokenResponseFromServer {
    /** ISO8601 date of the creation date for the provided token */
    readonly created: string;
    /** JSON Web Token which was issued by the API. */
    readonly token: string;
}

export interface UserUpdateRequestFromServer {
    /** New email address of the user */
    readonly emailAddress?: string;
    /** New firstname of the user */
    readonly firstname?: string;
    /** New lastname of the user */
    readonly lastname?: string;
    /**
     * New node reference of the user.
     * This can also explicitly set to null in order to remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    readonly oldPassword?: string;
    /** New password of the user */
    readonly password?: string;
    /** New username of the user */
    readonly username?: string;
}

/** Reference to the version of the node content. */
export interface VersionReferenceFromServer {
    /** Version number */
    readonly number?: string;
    /** Uuid of the element */
    readonly uuid: string;
}
