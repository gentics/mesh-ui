// Auto-generated from the RAML for Version 0.9.19 of the Gentics Mesh REST API.

export type Integer = number;

/** List of all API endpoints and their types */
export interface ApiEndpoints {
    GET: {
        /** Endpoint which returns version information */
        '/': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: MeshServerInfoModelFromServer;
            responseTypes: {
                /** JSON which contains version information */
                200: MeshServerInfoModelFromServer;
            };
        };
        /** Return the mesh system status. */
        '/admin/status': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** System status */
                200: GenericMessageResponse;
            };
        };
        /** Return the current schema or node migration status. */
        '/admin/status/migrations': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Migration status. */
                200: GenericMessageResponse;
            };
        };
        /** Login via basic authentication. */
        '/auth/login': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Logout and delete the currently active session. */
        '/auth/logout': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** User was successfully logged out. */
                200: GenericMessageResponse;
            };
        };
        /** Load your own user which is currently logged in. */
        '/auth/me': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: UserResponse;
            responseTypes: {
                /** Currently logged in user. */
                200: UserResponse;
            };
        };
        /** Read multiple groups and return a paged list response. */
        '/groups': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                };
                body?: undefined;
            };
            responseType: GroupListResponse;
            responseTypes: {
                /** List response which contains the found  groups. */
                200: GroupListResponse;
            };
        };
        /** Read the group with the given uuid. */
        '/groups/{groupUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group which should be deleted.
                     * @example "d3047743ee0f4aa6847743ee0fcaa664"
                     */
                    groupUuid: string;
                };
                queryParams?: {
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                };
                body?: undefined;
            };
            responseType: GroupResponse;
            responseTypes: {
                /** Loaded group. */
                200: GroupResponse;
            };
        };
        /** Load multiple roles that are assigned to the group. Return a paged list response. */
        '/groups/{groupUuid}/roles': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group.
                     * @example "265da54d364e44669da54d364e846628"
                     */
                    groupUuid: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                };
                body?: undefined;
            };
            responseType: RoleListResponse;
            responseTypes: {
                /** List of roles which were assigned to the group. */
                200: RoleListResponse;
            };
        };
        /** Load a list of users which have been assigned to the group. */
        '/groups/{groupUuid}/users': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group.
                     * @example "aa805c39c6ed45f4805c39c6edd5f449"
                     */
                    groupUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: UserListResponse;
            responseTypes: {
                /** List of users which belong to the group. */
                200: UserListResponse;
            };
        };
        /** Read multiple microschemas and return a paged list response. */
        '/microschemas': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: MicroschemaListResponse;
            responseTypes: {
                /** List of miroschemas. */
                200: MicroschemaListResponse;
            };
        };
        /** Read the microschema with the given uuid. */
        '/microschemas/{microschemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the microschema.
                     * @example "eb4630733e8d4b468630733e8ddb46ed"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: MicroschemaResponse;
            responseTypes: {
                /** Loaded microschema. */
                200: MicroschemaResponse;
            };
        };
        /** Load multiple projects and return a paged response. */
        '/projects': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                };
                body?: undefined;
            };
            responseType: ProjectListResponse;
            responseTypes: {
                /** Loaded project list. */
                200: ProjectListResponse;
            };
        };
        /** Load the project with the given uuid. */
        '/projects/{projectUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the project.
                     * @example "b7eb04b45c50438cab04b45c50438cc8"
                     */
                    projectUuid: string;
                };
                queryParams?: {
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                };
                body?: undefined;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Loaded project. */
                200: ProjectResponse;
            };
        };
        /** Endpoint which provides a RAML document for all registed endpoints. */
        '/raml': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Load multiple roles and return a paged list response */
        '/roles': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: RoleListResponse;
            responseTypes: {
                /** Loaded list of roles. */
                200: RoleListResponse;
            };
        };
        /** Load the role with the given uuid. */
        '/roles/{roleUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the role
                     * @example "64b6c92894514a4fb6c92894510a4ff6"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: RoleResponse;
            responseTypes: {
                /** Loaded role. */
                200: RoleResponse;
            };
        };
        /** Load the permissions between given role and the targeted element. */
        '/roles/{roleUuid}/permissions/{path}': {
            request: {
                urlParams: {
                    /**
                     * API path to the element.
                     * @example
                     *     "projects/4344a77c8a74473d84a77c8a74b73dc1"
                     *     "projects/e5c63202e73146aa863202e731d6aa29/nodes/34f350bcada4479eb350bcada4379e82"
                     *     ""
                     */
                    path: string;
                    /**
                     * Uuid of the role.
                     * @example "a258086719f2458198086719f26581d2"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: RolePermissionResponse;
            responseTypes: {
                /** Loaded permissions. */
                200: RolePermissionResponse;
            };
        };
        /** Read multiple schemas and return a paged list response. */
        '/schemas': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: SchemaListResponse;
            responseTypes: {
                /** Loaded list of schemas. */
                200: SchemaListResponse;
            };
        };
        /** Load the schema with the given uuid. */
        '/schemas/{schemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "fafbbc3a5eec44c1bbbc3a5eec14c166"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: SchemaResponse;
            responseTypes: {
                /** Loaded schema. */
                200: SchemaResponse;
            };
        };
        /** Create search index mappings. */
        '/search/createMappings': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Create all mappings. */
                200: GenericMessageResponse;
            };
        };
        /**
         * Invokes a full reindex of the search indices. This operation may take some time
         * to complete.
         */
        '/search/reindex': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Invoked reindex command for all elements. */
                200: GenericMessageResponse;
            };
        };
        /** Returns the search index status. */
        '/search/status': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Search index status. */
                200: GenericMessageResponse;
            };
        };
        /** Load multiple users and return a paged list response. */
        '/users': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * The resolve links parameter can be set to either _short_, _medium_ or _full_.
                     * Stored mesh links will automatically be resolved and replaced by the resolved
                     * webroot link. With the parameter set the _path_ property as well as the
                     * _languagesPath_ property (for available language variants) will be included in
                     * the response. Gentics Mesh links in any HTML-typed field will automatically be
                     * resolved and replaced by the resolved link:features.html#_link_resolving[WebRoot
                     * path]. No resolving occurs if no link has been specified.
                     * @example "medium"
                     */
                    resolveLinks?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                    /**
                     * ISO 639-1 language tag of the language which should be loaded. Fallback handling
                     * can be applied by specifying multiple languages in a comma-separated list. The
                     * first matching language will be returned.  If omitted or the requested language
                     * is not available then the _defaultLanguage_ as configured in _mesh.yml_ will be
                     * returned.
                     * @example "en,de"
                     */
                    lang?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
                body?: undefined;
            };
            responseType: UserListResponse;
            responseTypes: {
                /** User list response which may also contain an expanded node references. */
                200: UserListResponse;
            };
        };
        /** Read the user with the given uuid */
        '/users/{userUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "698bf45547a748bd8bf45547a7b8bd25"
                     */
                    userUuid: string;
                };
                queryParams?: {
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                    /**
                     * ISO 639-1 language tag of the language which should be loaded. Fallback handling
                     * can be applied by specifying multiple languages in a comma-separated list. The
                     * first matching language will be returned.  If omitted or the requested language
                     * is not available then the _defaultLanguage_ as configured in _mesh.yml_ will be
                     * returned.
                     * @example "en,de"
                     */
                    lang?: string;
                    /**
                     * The resolve links parameter can be set to either _short_, _medium_ or _full_.
                     * Stored mesh links will automatically be resolved and replaced by the resolved
                     * webroot link. With the parameter set the _path_ property as well as the
                     * _languagesPath_ property (for available language variants) will be included in
                     * the response. Gentics Mesh links in any HTML-typed field will automatically be
                     * resolved and replaced by the resolved link:features.html#_link_resolving[WebRoot
                     * path]. No resolving occurs if no link has been specified.
                     * @example "medium"
                     */
                    resolveLinks?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                };
                body?: undefined;
            };
            responseType: UserResponse;
            responseTypes: {
                /** User response which may also contain an expanded node. */
                200: UserResponse;
            };
        };
        /**
         * Read the user permissions on the element that can be located by the specified
         * path.
         */
        '/users/{userUuid}/permissions/{path}': {
            request: {
                urlParams: {
                    /**
                     * Path to the element from which the permissions should be loaded.
                     * @example "projects/:projectUuid/schemas"
                     */
                    path: string;
                    /**
                     * Uuid of the user.
                     * @example "cdc026900c5a40648026900c5a9064ce"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: UserPermissionResponse;
            responseTypes: {
                /** Response which contains the loaded permissions. */
                200: UserPermissionResponse;
            };
        };
        /** Return the current project info. */
        '/{project}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Project information. */
                200: ProjectResponse;
            };
        };
        /** Read all microschemas which are assigned to the project. */
        '/{project}/microschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: MicroschemaListResponse;
            responseTypes: {
                /** List of assigned microschemas. */
                200: MicroschemaListResponse;
            };
        };
        /** Return a navigation for the node which is located using the given path. */
        '/{project}/navroot/{path}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Webroot path to the node language variation.
                     * @example "someFolder/somePage.html"
                     */
                    path: string;
                };
                queryParams?: {
                    /**
                     * Specifies the maximum depth for the requested navigation tree structure (default:
                     * 10).
                     * @example 5
                     */
                    maxDepth?: number;
                    /**
                     * If set to true all nodes will be included in the response. By default only
                     * container nodes are included in a navigation response.
                     * @example true
                     */
                    includeAll?: boolean;
                };
                body?: undefined;
            };
            responseType: NavigationResponse;
            responseTypes: {
                /** Loaded navigation. */
                200: NavigationResponse;
            };
        };
        /** Read all nodes and return a paged list response. */
        '/{project}/nodes': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * The resolve links parameter can be set to either _short_, _medium_ or _full_.
                     * Stored mesh links will automatically be resolved and replaced by the resolved
                     * webroot link. With the parameter set the _path_ property as well as the
                     * _languagesPath_ property (for available language variants) will be included in
                     * the response. Gentics Mesh links in any HTML-typed field will automatically be
                     * resolved and replaced by the resolved link:features.html#_link_resolving[WebRoot
                     * path]. No resolving occurs if no link has been specified.
                     * @example "medium"
                     */
                    resolveLinks?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                    /**
                     * ISO 639-1 language tag of the language which should be loaded. Fallback handling
                     * can be applied by specifying multiple languages in a comma-separated list. The
                     * first matching language will be returned.  If omitted or the requested language
                     * is not available then the _defaultLanguage_ as configured in _mesh.yml_ will be
                     * returned.
                     * @example "en,de"
                     */
                    lang?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
                body?: undefined;
            };
            responseType: NodeListResponse;
            responseTypes: {
                /** Loaded list of nodes. */
                200: NodeListResponse;
            };
        };
        /** Load the node with the given uuid. */
        '/{project}/nodes/{nodeUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "bf39f90ab2984cb2b9f90ab2983cb2d3"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * The _role_ query parameter take a UUID of a role and may be used to add
                     * permission information to the response via the _rolePerm_ property which lists
                     * the permissions for the specified role on the element.
                     * This may be useful when you are logged in as admin but you want to retrieve the
                     * editor role permissions on a given node.
                     * Endpoint: _/api/v1/:projectName/nodes?role=:roleUuid_
                     *
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    role?: string;
                    /**
                     * ISO 639-1 language tag of the language which should be loaded. Fallback handling
                     * can be applied by specifying multiple languages in a comma-separated list. The
                     * first matching language will be returned.  If omitted or the requested language
                     * is not available then the _defaultLanguage_ as configured in _mesh.yml_ will be
                     * returned.
                     * @example "en,de"
                     */
                    lang?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * The resolve links parameter can be set to either _short_, _medium_ or _full_.
                     * Stored mesh links will automatically be resolved and replaced by the resolved
                     * webroot link. With the parameter set the _path_ property as well as the
                     * _languagesPath_ property (for available language variants) will be included in
                     * the response. Gentics Mesh links in any HTML-typed field will automatically be
                     * resolved and replaced by the resolved link:features.html#_link_resolving[WebRoot
                     * path]. No resolving occurs if no link has been specified.
                     * @example "medium"
                     */
                    resolveLinks?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                };
                body?: undefined;
            };
            responseType: NodeResponse;
            responseTypes: {
                /** Loaded node. */
                200: NodeResponse;
            };
        };
        /**
         * Download the binary field with the given name. You can use image query parameters
         * for crop and resize if the binary data represents an image.
         */
        '/{project}/nodes/{nodeUuid}/binary/{fieldName}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Name of the binary field
                     * @example "image"
                     */
                    fieldName: string;
                    /**
                     * Uuid of the node.
                     * @example "b74ac23ceecd44b78ac23ceecd94b78f"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Set image crop area start x coordinate.
                     * @example 260
                     */
                    cropx?: number;
                    /**
                     * Set image crop area height.
                     * @example 35
                     */
                    croph?: number;
                    /**
                     * Set image crop area start y coordinate.
                     * @example 260
                     */
                    cropy?: number;
                    /**
                     * Set image target width. The height will automatically be calculated if the width
                     * was omitted.
                     * @example 1280
                     */
                    width?: number;
                    /**
                     * Set image target height. The width will automatically be calculated if the height
                     * was omitted.
                     * @example 720
                     */
                    height?: number;
                    /**
                     * Set image crop area width.
                     * @example 35
                     */
                    cropw?: number;
                };
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Load all child nodes and return a paged list response. */
        '/{project}/nodes/{nodeUuid}/children': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "dca8b6367dee4975a8b6367dee09750f"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                    /**
                     * ISO 639-1 language tag of the language which should be loaded. Fallback handling
                     * can be applied by specifying multiple languages in a comma-separated list. The
                     * first matching language will be returned.  If omitted or the requested language
                     * is not available then the _defaultLanguage_ as configured in _mesh.yml_ will be
                     * returned.
                     * @example "en,de"
                     */
                    lang?: string;
                    /**
                     * The resolve links parameter can be set to either _short_, _medium_ or _full_.
                     * Stored mesh links will automatically be resolved and replaced by the resolved
                     * webroot link. With the parameter set the _path_ property as well as the
                     * _languagesPath_ property (for available language variants) will be included in
                     * the response. Gentics Mesh links in any HTML-typed field will automatically be
                     * resolved and replaced by the resolved link:features.html#_link_resolving[WebRoot
                     * path]. No resolving occurs if no link has been specified.
                     * @example "medium"
                     */
                    resolveLinks?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                };
                body?: undefined;
            };
            responseType: NodeListResponse;
            responseTypes: {
                /** List of loaded node children. */
                200: NodeListResponse;
            };
        };
        /** Return the publish status for the given language of the node. */
        '/{project}/nodes/{nodeUuid}/languages/{language}/published': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Name of the language tag
                     * @example "en"
                     */
                    language: string;
                    /**
                     * Uuid of the node
                     * @example "1e894a4ea9c14687894a4ea9c1b68705"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: PublishStatusModelFromServer;
            responseTypes: {
                /** Publish status of the specific language. */
                200: PublishStatusModelFromServer;
            };
        };
        /** Returns a navigation object for the provided node. */
        '/{project}/nodes/{nodeUuid}/navigation': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "9ec686479cdb48f18686479cdb58f1cf"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the maximum depth for the requested navigation tree structure (default:
                     * 10).
                     * @example 5
                     */
                    maxDepth?: number;
                    /**
                     * If set to true all nodes will be included in the response. By default only
                     * container nodes are included in a navigation response.
                     * @example true
                     */
                    includeAll?: boolean;
                };
                body?: undefined;
            };
            responseType: NavigationResponse;
            responseTypes: {
                /** Loaded navigation. */
                200: NavigationResponse;
            };
        };
        /** Return the published status of the node. */
        '/{project}/nodes/{nodeUuid}/published': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node
                     * @example "5b494dcb7d5c4808894dcb7d5c3808bc"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: PublishStatusResponse;
            responseTypes: {
                /** Publish status of the node. */
                200: PublishStatusResponse;
            };
        };
        /** Return a list of all tags which tag the node. */
        '/{project}/nodes/{nodeUuid}/tags': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "737aa967c585481abaa967c585581ab4"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                };
                body?: undefined;
            };
            responseType: TagListResponse;
            responseTypes: {
                /** List of tags that were used to tag the node. */
                200: TagListResponse;
            };
        };
        /** Load multiple releases and return a paged list response. */
        '/{project}/releases': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: ReleaseListResponse;
            responseTypes: {
                /** Loaded releases. */
                200: ReleaseListResponse;
            };
        };
        /** Load the release with the given uuid. */
        '/{project}/releases/{releaseUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "b733fa9433cc4d29b3fa9433cc9d292b"
                     */
                    releaseUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: ReleaseResponse;
            responseTypes: {
                /** Loaded release. */
                200: ReleaseResponse;
            };
        };
        /**
         * Load microschemas that are assigned to the release and return a paged list
         * response.
         */
        '/{project}/releases/{releaseUuid}/microschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "664326d054a1483e8326d054a1483ee5"
                     */
                    releaseUuid: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: MicroschemaReferenceFromServer[];
            responseTypes: {
                /** List of microschemas. */
                200: MicroschemaReferenceFromServer[];
            };
        };
        /**
         * Invoked the micronode migration for not yet migrated micronodes of microschemas
         * that are assigned to the release.
         */
        '/{project}/releases/{releaseUuid}/migrateMicroschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "7bc5248fd14141df85248fd14121dfb9"
                     */
                    releaseUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** schema_migration_invoked */
                200: GenericMessageResponse;
            };
        };
        /**
         * Invoked the node migration for not yet migrated nodes of schemas that are
         * assigned to the release.
         */
        '/{project}/releases/{releaseUuid}/migrateSchemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "eac010579be54f328010579be55f325b"
                     */
                    releaseUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** schema_migration_invoked */
                200: GenericMessageResponse;
            };
        };
        /** Load schemas that are assigned to the release and return a paged list response. */
        '/{project}/releases/{releaseUuid}/schemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "e5b0174cb81f4bbdb0174cb81fcbbd6f"
                     */
                    releaseUuid: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: SchemaReferenceFromServer[];
            responseTypes: {
                /** Loaded schema list. */
                200: SchemaReferenceFromServer[];
            };
        };
        /** Read multiple schemas and return a paged list response. */
        '/{project}/schemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: SchemaListResponse;
            responseTypes: {
                /** Loaded list of schemas. */
                200: SchemaListResponse;
            };
        };
        /** Load the schema with the given uuid. */
        '/{project}/schemas/{schemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the schema.
                     * @example "8c47bbdeda85436187bbdeda85f361ae"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: SchemaResponse;
            responseTypes: {
                /** Loaded schema. */
                200: SchemaResponse;
            };
        };
        /** Load multiple tag families and return a paged list response. */
        '/{project}/tagFamilies': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: TagFamilyListResponse;
            responseTypes: {
                /** Loaded tag families. */
                200: TagFamilyListResponse;
            };
        };
        /** Read the tag family with the given uuid. */
        '/{project}/tagFamilies/{tagFamilyUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "b52a153423c14046aa153423c1604689"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: TagFamilyResponse;
            responseTypes: {
                /** Loaded tag family. */
                200: TagFamilyResponse;
            };
        };
        /**
         * Load tags which were assigned to this tag family and return a paged list
         * response.
         */
        '/{project}/tagFamilies/{tagFamilyUuid}/tags': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "bda0e746b00a4096a0e746b00a009630"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: TagListResponse;
            responseTypes: {
                /** List of tags. */
                200: TagListResponse;
            };
        };
        /** Read the specified tag from the tag family. */
        '/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "231430fe022349189430fe0223191859"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "bd30996ccde0458bb0996ccde0958b12"
                     */
                    tagUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: TagResponse;
            responseTypes: {
                /** Loaded tag. */
                200: TagResponse;
            };
        };
        /**
         * Load all nodes that have been tagged with the tag and return a paged list
         * response.
         */
        '/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}/nodes': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "6eae6762e02f498eae6762e02ff98e9c"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "0f270c95d76b40b0a70c95d76b60b051"
                     */
                    tagUuid: string;
                };
                queryParams?: {
                    /**
                     * Number of elements per page (default: 25).
                     * @example 42
                     */
                    perPage?: number;
                    /**
                     * Number of page to be loaded (default: 1).
                     * @example 42
                     */
                    page?: number;
                };
                body?: undefined;
            };
            responseType: NodeListResponse;
            responseTypes: {
                /** List of nodes which were tagged using the provided tag. */
                200: NodeListResponse;
            };
        };
        /** Load the node or the node's binary data which is located using the provided path. */
        '/{project}/webroot/{path}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Path to the node
                     * @example "/News/2015/Images/flower.jpg"
                     */
                    path: string;
                };
                queryParams?: {
                    /**
                     * Set image crop area start x coordinate.
                     * @example 260
                     */
                    cropx?: number;
                    /**
                     * Set image crop area height.
                     * @example 35
                     */
                    croph?: number;
                    /**
                     * Set image crop area start y coordinate.
                     * @example 260
                     */
                    cropy?: number;
                    /**
                     * Set image target width. The height will automatically be calculated if the width
                     * was omitted.
                     * @example 1280
                     */
                    width?: number;
                    /**
                     * Set image target height. The width will automatically be calculated if the height
                     * was omitted.
                     * @example 720
                     */
                    height?: number;
                    /**
                     * Set image crop area width.
                     * @example 35
                     */
                    cropw?: number;
                };
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
    };
    POST: {
        /**
         * Invoke a graph database backup and dump the data to the configured backup
         * location. Note that this operation will block all current operation.
         */
        '/admin/graphdb/backup': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Incremental backup was invoked. */
                200: GenericMessageResponse;
            };
        };
        /**
         * Invoke a graph database restore. The latest dump from the backup directory will
         * be inserted. Please note that this operation will block all current operation and
         * effecivly destroy all previously stored data.
         */
        '/admin/graphdb/restore': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Database restore command was invoked. */
                200: GenericMessageResponse;
            };
        };
        /** Login via this dedicated login endpoint. */
        '/auth/login': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: LoginRequest;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Create a new group. */
        '/groups': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: GroupCreateRequest;
            };
            responseType: GroupResponse;
            responseTypes: {
                /** Created group. */
                201: GroupResponse;
            };
        };
        /** Update the group with the given uuid. */
        '/groups/{groupUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group which should be deleted.
                     * @example "d3047743ee0f4aa6847743ee0fcaa664"
                     */
                    groupUuid: string;
                };
                queryParams?: { };
                body: GroupUpdateRequest;
            };
            responseType: GroupResponse;
            responseTypes: {
                /** Updated group. */
                200: GroupResponse;
            };
        };
        /** Add the specified role to the group. */
        '/groups/{groupUuid}/roles/{roleUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group.
                     * @example "8307882920eb4b6b87882920eb2b6bbb"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the role.
                     * @example "fc7cd9ea1c104010bcd9ea1c1020104f"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GroupResponse;
            responseTypes: {
                /** Loaded role. */
                200: GroupResponse;
            };
        };
        /** Add the given user to the group */
        '/groups/{groupUuid}/users/{userUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group.
                     * @example "7024e305c99747c7a4e305c99707c7df"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the user which should be removed from the group.
                     * @example "15b8272d4a3d432fb8272d4a3dd32f4a"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GroupResponse;
            responseTypes: {
                /** Updated group. */
                200: GroupResponse;
            };
        };
        /** Create a new microschema. */
        '/microschemas': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: MicroschemaCreateRequest;
            };
            responseType: MicroschemaResponse;
            responseTypes: {
                /** Created microschema. */
                201: MicroschemaResponse;
            };
        };
        /** Update the microschema with the given uuid. */
        '/microschemas/{microschemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the microschema.
                     * @example "eb4630733e8d4b468630733e8ddb46ed"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body: MicroschemaUpdateRequest;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Migration message. */
                200: GenericMessageResponse;
            };
        };
        /**
         * Apply the provided changes on the latest version of the schema and migrate all
         * nodes which are based on the schema. Please note that this operation is
         * non-blocking and will continue to run in the background.
         */
        '/microschemas/{microschemaUuid}/changes': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the microschema.
                     * @example "f3fe11e4f3064730be11e4f3064730c4"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body: SchemaChangesListModelFromServer;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Microschema migration was invoked. */
                200: GenericMessageResponse;
            };
        };
        /**
         * Compare the provided schema with the schema which is currently stored and
         * generate a set of changes that have been detected.
         */
        '/microschemas/{microschemaUuid}/diff': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the microschema.
                     * @example "b49c10230711425e9c10230711f25e3d"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body: MicroschemaCreateRequest;
            };
            responseType: SchemaChangesListModelFromServer;
            responseTypes: {
                /** Found difference between both microschemas. */
                200: SchemaChangesListModelFromServer;
            };
        };
        /** Create a new project. */
        '/projects': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: ProjectCreateRequest;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Created project. */
                201: ProjectResponse;
            };
        };
        /** Update the project with the given uuid. */
        '/projects/{projectUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the project.
                     * @example "b7eb04b45c50438cab04b45c50438cc8"
                     */
                    projectUuid: string;
                };
                queryParams?: { };
                body: ProjectUpdateRequest;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Updated project. */
                200: ProjectResponse;
            };
        };
        /** Create a new role. */
        '/roles': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: RoleCreateRequest;
            };
            responseType: RoleResponse;
            responseTypes: {
                /** Created role. */
                201: RoleResponse;
            };
        };
        /** Update the role with the given uuid. */
        '/roles/{roleUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the role
                     * @example "64b6c92894514a4fb6c92894510a4ff6"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body: RoleUpdateRequest;
            };
            responseType: RoleResponse;
            responseTypes: {
                /** Updated role. */
                200: RoleResponse;
            };
        };
        /** Set the permissions between role and the targeted element. */
        '/roles/{roleUuid}/permissions/{path}': {
            request: {
                urlParams: {
                    /**
                     * API path to the element.
                     * @example
                     *     "projects/4344a77c8a74473d84a77c8a74b73dc1"
                     *     "projects/e5c63202e73146aa863202e731d6aa29/nodes/34f350bcada4479eb350bcada4379e82"
                     *     ""
                     */
                    path: string;
                    /**
                     * Uuid of the role.
                     * @example "a258086719f2458198086719f26581d2"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body: RolePermissionRequest;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Permissions were set. */
                200: GenericMessageResponse;
            };
        };
        /** Create a new schema. */
        '/schemas': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: SchemaCreateRequest;
            };
            responseType: SchemaResponse;
            responseTypes: {
                /** Created schema. */
                201: SchemaResponse;
            };
        };
        /** Update the schema. */
        '/schemas/{schemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "fafbbc3a5eec44c1bbbc3a5eec14c166"
                     */
                    schemaUuid: string;
                };
                queryParams?: {
                    /**
                     * List of release names which should be included in the update process. By default
                     * all releases which use the schema will be updated. You can thus use this
                     * parameter to only include a subset of release in the update.
                     * @example "summerRelease,winterRelease"
                     */
                    updateReleaseNames?: string;
                    /**
                     * Update the schema version for all releases which already utilize the schema
                     * (default: true).
                     */
                    updateAssignedReleases?: boolean;
                };
                body: SchemaUpdateRequest;
            };
            responseType: SchemaResponse;
            responseTypes: {
                /** Updated schema. */
                200: SchemaResponse;
            };
        };
        /** Apply the posted changes to the schema. */
        '/schemas/{schemaUuid}/changes': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "7787c90bacfa495087c90bacfa8950f9"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body: SchemaChangesListModelFromServer;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Schema migration was started. */
                200: GenericMessageResponse;
            };
        };
        /** Compare the given schema with the stored schema and create a changeset. */
        '/schemas/{schemaUuid}/diff': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "f9080ba244f04824880ba244f0782422"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body: SchemaResponse;
            };
            responseType: SchemaChangesListModelFromServer;
            responseTypes: {
                /**
                 * List of schema changes that were detected by comparing the posted schema and the
                 * current version.
                 */
                200: SchemaChangesListModelFromServer;
            };
        };
        /** Invoke a search query for groups and return a paged list response. */
        '/search/groups': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GroupListResponse;
            responseTypes: {
                /** Paged search result for groups */
                200: GroupListResponse;
            };
        };
        /** Invoke a search query for microschemas and return a paged list response. */
        '/search/microschemas': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: MicroschemaListResponse;
            responseTypes: {
                /** Paged search result for microschemas */
                200: MicroschemaListResponse;
            };
        };
        /** Invoke a search query for nodes and return a paged list response. */
        '/search/nodes': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: NodeListResponse;
            responseTypes: {
                /** Paged search result for nodes */
                200: NodeListResponse;
            };
        };
        /** Invoke a search query for projects and return a paged list response. */
        '/search/projects': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: ProjectListResponse;
            responseTypes: {
                /** Paged search result for projects */
                200: ProjectListResponse;
            };
        };
        /** Invoke a search query for roles and return a paged list response. */
        '/search/roles': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: RoleListResponse;
            responseTypes: {
                /** Paged search result for roles */
                200: RoleListResponse;
            };
        };
        /** Invoke a search query for schemas and return a paged list response. */
        '/search/schemas': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: SchemaListResponse;
            responseTypes: {
                /** Paged search result for schemas */
                200: SchemaListResponse;
            };
        };
        /** Invoke a search query for tagFamilies and return a paged list response. */
        '/search/tagFamilies': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: TagFamilyListResponse;
            responseTypes: {
                /** Paged search result for tagFamilies */
                200: TagFamilyListResponse;
            };
        };
        /** Invoke a search query for tags and return a paged list response. */
        '/search/tags': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: TagListResponse;
            responseTypes: {
                /** Paged search result for tags */
                200: TagListResponse;
            };
        };
        /** Invoke a search query for users and return a paged list response. */
        '/search/users': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body?: undefined;
            };
            responseType: UserListResponse;
            responseTypes: {
                /** Paged search result for users */
                200: UserListResponse;
            };
        };
        /** Create a new user. */
        '/users': {
            request: {
                urlParams?: { };
                queryParams?: { };
                body: UserCreateRequest;
            };
            responseType: UserResponse;
            responseTypes: {
                /** User response of the created user. */
                201: UserResponse;
            };
        };
        /** Update the user with the given uuid. */
        '/users/{userUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "698bf45547a748bd8bf45547a7b8bd25"
                     */
                    userUuid: string;
                };
                queryParams?: {
                    /**
                     * Token code which can be used to update the user even if the connection is not
                     * authenticated. This can be used to implement a password recovery feature.
                     * @example "pQcyhUn6CBsJ"
                     */
                    token?: string;
                };
                body: UserUpdateRequest;
            };
            responseType: UserResponse;
            responseTypes: {
                /** Updated user response. */
                200: UserResponse;
            };
        };
        /**
         * Return a one time token which can be used by any user to update a user (e.g.:
         * Reset the password)
         */
        '/users/{userUuid}/reset_token': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "2ef4ed9d037b4459b4ed9d037bf459b5"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: UserResetTokenResponse;
            responseTypes: {
                /** User token response. */
                200: UserResetTokenResponse;
            };
        };
        /**
         * Return API token which can be used to authenticate the user. Store the key
         * somewhere save since you won't be able to retrieve it later on.
         */
        '/users/{userUuid}/token': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "0a8c835c93b54f5e8c835c93b51f5efc"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: UserAPITokenResponse;
            responseTypes: {
                /** The User API token response. */
                200: UserAPITokenResponse;
            };
        };
        /**
         * Return the posted text and resolve and replace all found mesh links. A mesh link
         * must be in the format {{mesh.link("UUID","languageTag")}}
         */
        '/utilities/linkResolver': {
            request: {
                urlParams?: { };
                queryParams?: {
                    /**
                     * ISO 639-1 language tag of the language which should be loaded. Fallback handling
                     * can be applied by specifying multiple languages in a comma-separated list. The
                     * first matching language will be returned.  If omitted or the requested language
                     * is not available then the _defaultLanguage_ as configured in _mesh.yml_ will be
                     * returned.
                     * @example "en,de"
                     */
                    lang?: string;
                    /**
                     * The resolve links parameter can be set to either _short_, _medium_ or _full_.
                     * Stored mesh links will automatically be resolved and replaced by the resolved
                     * webroot link. With the parameter set the _path_ property as well as the
                     * _languagesPath_ property (for available language variants) will be included in
                     * the response. Gentics Mesh links in any HTML-typed field will automatically be
                     * resolved and replaced by the resolved link:features.html#_link_resolving[WebRoot
                     * path]. No resolving occurs if no link has been specified.
                     * @example "medium"
                     */
                    resolveLinks?: string;
                };
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Endpoint which accepts GraphQL queries. */
        '/{project}/graphql': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body: GraphQLRequest;
            };
            responseType: GraphQLResponse;
            responseTypes: {
                /** Basic GraphQL response. */
                200: GraphQLResponse;
            };
        };
        /** Add the microschema to the project. */
        '/{project}/microschemas/{microschemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the microschema.
                     * @example "96af9c5a0d2141d6af9c5a0d2121d657"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: MicroschemaResponse;
            responseTypes: {
                /** Microschema was added to the project. */
                200: MicroschemaResponse;
            };
        };
        /** Create a new node. */
        '/{project}/nodes': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body: NodeCreateRequest;
            };
            responseType: NodeResponse;
            responseTypes: {
                /** Created node. */
                201: NodeResponse;
            };
        };
        /**
         * Update the node with the given uuid. It is mandatory to specify the version
         * within the update request. Mesh will automatically check for version conflicts
         * and return a 409 error if a conflict has been detected. Additional conflict
         * checks for WebRoot path conflicts will also be performed.
         */
        '/{project}/nodes/{nodeUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "bf39f90ab2984cb2b9f90ab2983cb2d3"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body: NodeUpdateRequest;
            };
            responseType: NodeResponse | GenericMessageResponse;
            responseTypes: {
                /** Updated node. */
                200: NodeResponse;
                /** A conflict has been detected. */
                409: GenericMessageResponse;
            };
        };
        /** Update the binaryfield with the given name. */
        '/{project}/nodes/{nodeUuid}/binary/{fieldName}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Name of the binary field
                     * @example "image"
                     */
                    fieldName: string;
                    /**
                     * Uuid of the node.
                     * @example "b74ac23ceecd44b78ac23ceecd94b78f"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body: {
                    /** Single binary file part. */
                    binary: File;
                    /**
                     * Language of the node content which contains the binary field which should be
                     * updated.
                     * @example "en"
                     */
                    language: string;
                    /**
                     * Version of the node which should be updated. This information is used to
                     * determine conflicting updates.
                     * @example "1.0"
                     */
                    version: string;
                };
            };
            responseType: NodeResponse;
            responseTypes: {
                /** The response contains the updated node. */
                200: NodeResponse;
            };
        };
        /**
         * Transform the image with the given field name and overwrite the stored image with
         * the transformation result.
         */
        '/{project}/nodes/{nodeUuid}/binaryTransform/{fieldName}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Name of the field
                     * @example "image"
                     */
                    fieldName: string;
                    /**
                     * Uuid of the node.
                     * @example "6d68ee475c524adfa8ee475c52cadf7b"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body: BinaryFieldTransformRequest;
            };
            responseType: NodeResponse;
            responseTypes: {
                /** Transformation was executed and updated node was returned. */
                200: NodeResponse;
            };
        };
        /**
         * Publish the language of the node. This will automatically assign a new major
         * version to the node and update the draft version to the published version.
         */
        '/{project}/nodes/{nodeUuid}/languages/{language}/published': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Name of the language tag
                     * @example "en"
                     */
                    language: string;
                    /**
                     * Uuid of the node
                     * @example "1e894a4ea9c14687894a4ea9c1b68705"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: PublishStatusModelFromServer;
            responseTypes: {
                /** Updated publish status. */
                200: PublishStatusModelFromServer;
            };
        };
        /** Move the node into the target node. */
        '/{project}/nodes/{nodeUuid}/moveTo/{toUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of target the node.
                     * @example "959b2967587a4d349b2967587a5d3455"
                     */
                    toUuid: string;
                    /**
                     * Uuid of the node which should be moved.
                     * @example "f5c58bb0be8347da858bb0be8317da90"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Node was moved. */
                204: undefined;
            };
        };
        /** Publish the node with the given uuid. */
        '/{project}/nodes/{nodeUuid}/published': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node
                     * @example "5b494dcb7d5c4808894dcb7d5c3808bc"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifiy whether the invoked action should be applied recursively (default:
                     * false).
                     * @example true
                     */
                    recursive?: boolean;
                };
                body?: undefined;
            };
            responseType: PublishStatusResponse;
            responseTypes: {
                /** Publish status of the node. */
                200: PublishStatusResponse;
            };
        };
        /** Update the list of assigned tags */
        '/{project}/nodes/{nodeUuid}/tags': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "737aa967c585481abaa967c585581ab4"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body: TagListUpdateRequest;
            };
            responseType: TagListResponse;
            responseTypes: {
                /** Updated tag list. */
                200: TagListResponse;
            };
        };
        /** Assign the given tag to the node. */
        '/{project}/nodes/{nodeUuid}/tags/{tagUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag
                     * @example "c89ab26593574df19ab2659357cdf132"
                     */
                    tagUuid: string;
                    /**
                     * Uuid of the node
                     * @example "2d68653a2f9542efa8653a2f9582ef15"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * Specifies the release to be used for loading data. The latest project release
                     * will be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    release?: string;
                };
                body?: undefined;
            };
            responseType: NodeResponse;
            responseTypes: {
                /** Updated node. */
                200: NodeResponse;
            };
        };
        /** Create a new release and automatically invoke a node migration. */
        '/{project}/releases': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body: ReleaseCreateRequest;
            };
            responseType: ReleaseResponse;
            responseTypes: {
                /** Created release. */
                201: ReleaseResponse;
            };
        };
        /** Update the release with the given uuid. */
        '/{project}/releases/{releaseUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "b733fa9433cc4d29b3fa9433cc9d292b"
                     */
                    releaseUuid: string;
                };
                queryParams?: { };
                body: ReleaseUpdateRequest;
            };
            responseType: ReleaseResponse;
            responseTypes: {
                /** Updated release */
                200: ReleaseResponse;
            };
        };
        /** Assign a microschema version to the release. */
        '/{project}/releases/{releaseUuid}/microschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "664326d054a1483e8326d054a1483ee5"
                     */
                    releaseUuid: string;
                };
                queryParams?: { };
                body: MicroschemaReferenceFromServer[];
            };
            responseType: MicroschemaReferenceFromServer[];
            responseTypes: {
                /** Updated microschema list. */
                200: MicroschemaReferenceFromServer[];
            };
        };
        /** Assign a schema version to the release. */
        '/{project}/releases/{releaseUuid}/schemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the release
                     * @example "e5b0174cb81f4bbdb0174cb81fcbbd6f"
                     */
                    releaseUuid: string;
                };
                queryParams?: { };
                body: SchemaReferenceFromServer[];
            };
            responseType: SchemaReferenceFromServer[];
            responseTypes: {
                /** Updated schema list. */
                200: SchemaReferenceFromServer[];
            };
        };
        /**
         * Assign the schema to the project. This will automatically assign the latest
         * schema version to all releases of the project.
         */
        '/{project}/schemas/{schemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the schema.
                     * @example "8c47bbdeda85436187bbdeda85f361ae"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body: SchemaUpdateRequest;
            };
            responseType: SchemaResponse;
            responseTypes: {
                /** Assigned schema. */
                200: SchemaResponse;
            };
        };
        /** Invoke a search query for nodes and return a paged list response. */
        '/{project}/search/nodes': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: NodeListResponse;
            responseTypes: {
                /** Paged search result list. */
                200: NodeListResponse;
            };
        };
        /** Invoke a search query for tagFamilies and return a paged list response. */
        '/{project}/search/tagFamilies': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: TagFamilyListResponse;
            responseTypes: {
                /** Paged search result list. */
                200: TagFamilyListResponse;
            };
        };
        /** Invoke a search query for tags and return a paged list response. */
        '/{project}/search/tags': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: TagListResponse;
            responseTypes: {
                /** Paged search result list. */
                200: TagListResponse;
            };
        };
        /** Create a new tag family. */
        '/{project}/tagFamilies': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: { };
                body: TagFamilyCreateRequest;
            };
            responseType: TagFamilyResponse;
            responseTypes: {
                /** Created tag family. */
                201: TagFamilyResponse;
            };
        };
        /** Update the tag family with the given uuid. */
        '/{project}/tagFamilies/{tagFamilyUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "b52a153423c14046aa153423c1604689"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: { };
                body: TagFamilyUpdateRequest;
            };
            responseType: TagFamilyResponse;
            responseTypes: {
                /** Updated tag family. */
                200: TagFamilyResponse;
            };
        };
        /** Create a new tag within the tag family. */
        '/{project}/tagFamilies/{tagFamilyUuid}/tags': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "bda0e746b00a4096a0e746b00a009630"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: { };
                body: TagCreateRequest;
            };
            responseType: TagResponse;
            responseTypes: {
                /** Created tag */
                200: TagResponse;
            };
        };
        /** Update the specified tag */
        '/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "231430fe022349189430fe0223191859"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "bd30996ccde0458bb0996ccde0958b12"
                     */
                    tagUuid: string;
                };
                queryParams?: { };
                body: TagUpdateRequest;
            };
            responseType: TagResponse;
            responseTypes: {
                /** Updated tag. */
                200: TagResponse;
            };
        };
    };
    PATCH: { };
    PUT: { };
    DELETE: {
        /** Delete the given group. */
        '/groups/{groupUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group which should be deleted.
                     * @example "d3047743ee0f4aa6847743ee0fcaa664"
                     */
                    groupUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Group was deleted. */
                204: undefined;
            };
        };
        /** Remove the given role from the group. */
        '/groups/{groupUuid}/roles/{roleUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group.
                     * @example "8307882920eb4b6b87882920eb2b6bbb"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the role.
                     * @example "fc7cd9ea1c104010bcd9ea1c1020104f"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Role was removed from the group. */
                204: undefined;
            };
        };
        /** Remove the given user from the group. */
        '/groups/{groupUuid}/users/{userUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group.
                     * @example "7024e305c99747c7a4e305c99707c7df"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the user which should be removed from the group.
                     * @example "15b8272d4a3d432fb8272d4a3dd32f4a"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** User was removed from the group. */
                204: undefined;
            };
        };
        /** Delete the microschema with the given uuid. */
        '/microschemas/{microschemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the microschema.
                     * @example "eb4630733e8d4b468630733e8ddb46ed"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Microschema was deleted. */
                204: undefined;
            };
        };
        /** Delete the project and all attached nodes. */
        '/projects/{projectUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the project.
                     * @example "b7eb04b45c50438cab04b45c50438cc8"
                     */
                    projectUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Project was deleted. */
                204: undefined;
            };
        };
        /** Delete the role with the given uuid */
        '/roles/{roleUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the role
                     * @example "64b6c92894514a4fb6c92894510a4ff6"
                     */
                    roleUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Role was deleted. */
                204: undefined;
            };
        };
        /** Delete the schema with the given uuid. */
        '/schemas/{schemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "fafbbc3a5eec44c1bbbc3a5eec14c166"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Schema was successfully deleted. */
                204: undefined;
            };
        };
        /**
         * Deactivate the user with the given uuid. Please note that users can't be deleted
         * since they are needed to construct creator/editor information.
         */
        '/users/{userUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "698bf45547a748bd8bf45547a7b8bd25"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** User was deactivated. */
                204: undefined;
            };
        };
        /** Invalidate the issued API token. */
        '/users/{userUuid}/token': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "0a8c835c93b54f5e8c835c93b51f5efc"
                     */
                    userUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Message confirming the invalidation of the API token. */
                200: GenericMessageResponse;
            };
        };
        /** Remove the microschema from the project. */
        '/{project}/microschemas/{microschemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the microschema.
                     * @example "96af9c5a0d2141d6af9c5a0d2121d657"
                     */
                    microschemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Microschema was removed from project. */
                204: undefined;
            };
        };
        /** Delete the node with the given uuid. */
        '/{project}/nodes/{nodeUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node.
                     * @example "bf39f90ab2984cb2b9f90ab2983cb2d3"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Deletion was successful. */
                204: undefined;
            };
        };
        /** Delete the language specific content of the node. */
        '/{project}/nodes/{nodeUuid}/languages/{language}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Language tag of the content which should be deleted.
                     * @example "en"
                     */
                    language: string;
                    /**
                     * Uuid of the node.
                     * @example "c1d09db438b54c9c909db438b51c9ce3"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Language variation of the node has been deleted. */
                204: undefined;
            };
        };
        /** Take the language of the node offline. */
        '/{project}/nodes/{nodeUuid}/languages/{language}/published': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Name of the language tag
                     * @example "en"
                     */
                    language: string;
                    /**
                     * Uuid of the node
                     * @example "1e894a4ea9c14687894a4ea9c1b68705"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: PublishStatusModelFromServer;
            responseTypes: {
                /** Node language was taken offline. */
                204: PublishStatusModelFromServer;
            };
        };
        /** Unpublish the given node. */
        '/{project}/nodes/{nodeUuid}/published': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the node
                     * @example "5b494dcb7d5c4808894dcb7d5c3808bc"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifiy whether the invoked action should be applied recursively (default:
                     * false).
                     * @example true
                     */
                    recursive?: boolean;
                };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Node was unpublished. */
                204: undefined;
            };
        };
        /** Remove the given tag from the node. */
        '/{project}/nodes/{nodeUuid}/tags/{tagUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag
                     * @example "c89ab26593574df19ab2659357cdf132"
                     */
                    tagUuid: string;
                    /**
                     * Uuid of the node
                     * @example "2d68653a2f9542efa8653a2f9582ef15"
                     */
                    nodeUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Removal was successful. */
                204: undefined;
            };
        };
        /**
         * Remove the schema with the given uuid from the project. This will automatically
         * remove all schema versions of the given schema from all releases of the project.
         */
        '/{project}/schemas/{schemaUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the schema.
                     * @example "8c47bbdeda85436187bbdeda85f361ae"
                     */
                    schemaUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Schema was successfully removed. */
                204: undefined;
            };
        };
        /** Delete the tag family. */
        '/{project}/tagFamilies/{tagFamilyUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "b52a153423c14046aa153423c1604689"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Tag family was deleted. */
                204: undefined;
            };
        };
        /** Remove the tag from the tag family. */
        '/{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the tag family.
                     * @example "231430fe022349189430fe0223191859"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "bd30996ccde0458bb0996ccde0958b12"
                     */
                    tagUuid: string;
                };
                queryParams?: { };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Tag was removed from the tag family */
                204: undefined;
            };
        };
    };
}

export interface BinaryFieldTransformRequest {
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
    /**
     * ISO 639-1 language tag of the node which provides the image which should be
     * transformed.
     */
    readonly language: string;
    /**
     * Version number which must be provided in order to handle and detect concurrent
     * changes to the node content.
     */
    readonly version: string;
    /** New width of the image. */
    readonly width?: Integer;
}

export interface ErrorLocationFromServer {
    /** Error column number. */
    readonly column: Integer;
    /** Error line number. */
    readonly line: Integer;
}

/**
 * New node reference of the user. This can also explicitly set to null in order to
 * remove the assigned node from the user
 */
export interface ExpandableNodeFromServer {
    readonly uuid?: string;
}

/** Dynamic map with fields of the node language specific content. */
export interface FieldMapFromServer {
    readonly empty?: boolean;
}

export interface FieldSchemaFromServer {
    /** Label of the field. */
    readonly label?: string;
    /** Name of the field. */
    readonly name: string;
    readonly required?: boolean;
    /** Type of the field. */
    readonly type: string;
}

/**
 * Returned for:
 *   - `GET /admin/status`
 *   - `GET /admin/status/migrations`
 *   - `GET /auth/logout`
 *   - `GET /search/createMappings`
 *   - `GET /search/reindex`
 *   - `GET /search/status`
 *   - `GET /{project}/releases/{releaseUuid}/migrateMicroschemas`
 *   - `GET /{project}/releases/{releaseUuid}/migrateSchemas`
 *   - `POST /admin/graphdb/backup`
 *   - `POST /admin/graphdb/restore`
 *   - `POST /microschemas/{microschemaUuid}`
 *   - `POST /microschemas/{microschemaUuid}/changes`
 *   - `POST /roles/{roleUuid}/permissions/{path}`
 *   - `POST /schemas/{schemaUuid}/changes`
 *   - `POST /{project}/nodes/{nodeUuid}`
 *   - `DELETE /users/{userUuid}/token`
 */
export interface GenericMessageResponse {
    /** Internal developer friendly message */
    readonly internalMessage: string;
    /**
     * Enduser friendly translated message. Translation depends on the 'Accept-Language'
     * header value
     */
    readonly message: string;
    /** Map of i18n properties which were used to construct the provided message */
    readonly properties?: { [key: string]: any };
}

export interface GraphQLErrorFromServer {
    /** Mesh element id which is related to the error. */
    readonly elementId?: string;
    /** Mesh element type which is related to the error. */
    readonly elementType?: string;
    /** List of locations which are related to the error. */
    readonly locations?: ErrorLocationFromServer[];
    /** The error message. */
    readonly message: string;
    /** Type of the error. */
    readonly type: string;
}

export interface GraphQLRequest {
    /** GraphQL operation name. */
    readonly operationName?: string;
    /** The actual GraphQL query. */
    readonly query: string;
    /** JSON object which contains the variables. */
    readonly variables?: JsonObjectFromServer;
}

/**
 * Returned for `POST /{project}/graphql`
 */
export interface GraphQLResponse {
    /** JSON object which contains the variables. */
    readonly data?: JsonObjectFromServer;
    /** Array of errors which were encoutered when handling the query. */
    readonly errors?: GraphQLErrorFromServer[];
}

export interface GroupCreateRequest {
    /** Name of the group. */
    readonly name: string;
}

/**
 * Returned for:
 *   - `GET /groups`
 *   - `POST /search/groups`
 */
export interface GroupListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: GroupResponse[];
}

export interface GroupReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *   - `GET /groups/{groupUuid}`
 *   - `POST /groups`
 *   - `POST /groups/{groupUuid}`
 *   - `POST /groups/{groupUuid}/roles/{roleUuid}`
 *   - `POST /groups/{groupUuid}/users/{userUuid}`
 */
export interface GroupResponse {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Name of the group */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** List of role references */
    readonly roles: RoleReferenceFromServer[];
    /** Uuid of the element */
    readonly uuid: string;
}

export interface GroupUpdateRequest {
    /** New name of the group */
    readonly name: string;
}

/** JSON object which contains the variables. */
export interface JsonObjectFromServer {
    readonly empty?: boolean;
    readonly map?: { [key: string]: any };
}

export interface LoginRequest {
    /** Password of the user which should be logged in. */
    readonly password: string;
    /** Username of the user which should be logged in. */
    readonly username: string;
}

/**
 * Returned for `GET /`
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

export interface MicroschemaCreateRequest {
    /** Description of the microschema */
    readonly description?: string;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name?: string;
}

/**
 * Returned for:
 *   - `GET /microschemas`
 *   - `GET /{project}/microschemas`
 *   - `POST /search/microschemas`
 */
export interface MicroschemaListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: MicroschemaResponse[];
}

export interface MicroschemaReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
    readonly version?: string;
}

/**
 * Returned for:
 *   - `GET /microschemas/{microschemaUuid}`
 *   - `POST /microschemas`
 *   - `POST /{project}/microschemas/{microschemaUuid}`
 */
export interface MicroschemaResponse {
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
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the microschema */
    readonly version: string;
}

export interface MicroschemaUpdateRequest {
    /** Description of the microschema */
    readonly description?: string;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name?: string;
    /** Version of the microschema */
    readonly version: string;
}

export interface NavigationElementFromServer {
    /** List of further child elements of the node. */
    readonly children?: NavigationElementFromServer[];
    readonly node?: NodeResponse;
    /** Uuid of the node within this navigation element. */
    readonly uuid?: string;
}

/**
 * Returned for:
 *   - `GET /{project}/navroot/{path}`
 *   - `GET /{project}/nodes/{nodeUuid}/navigation`
 */
export interface NavigationResponse {
    /** List of further child elements of the node. */
    readonly children?: NavigationElementFromServer[];
    readonly node?: NodeResponse;
    /** Uuid of the node within this navigation element. */
    readonly uuid?: string;
}

export interface NodeChildrenInfoFromServer {
    /** Count of children which utilize the schema. */
    readonly count: Integer;
    /** Reference to the schema of the node child */
    readonly schemaUuid: string;
}

export interface NodeCreateRequest {
    /** Dynamic map with fields of the node language specific content. */
    readonly fields: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    readonly language: string;
    /** The project root node. All futher nodes are children of this node. */
    readonly parentNode: NodeReferenceFromServer;
    /**
     * Reference to the schema of the root node. Creating a project will also
     * automatically create the base node of the project and link the schema to the
     * initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
}

/**
 * Returned for:
 *   - `GET /{project}/nodes`
 *   - `GET /{project}/nodes/{nodeUuid}/children`
 *   - `GET /{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}/nodes`
 *   - `POST /search/nodes`
 *   - `POST /{project}/search/nodes`
 */
export interface NodeListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: NodeResponse[];
}

/** The project root node. All futher nodes are children of this node. */
export interface NodeReferenceFromServer {
    /**
     * Optional display name of the node. A display field must be set in the schema in
     * order to populate this property.
     */
    readonly displayName?: string;
    /**
     * Webroot path of the node. The path property will only be provided if the
     * resolveLinks query parameter has been set.
     */
    readonly path?: string;
    /** Name of the project to which the node belongs */
    readonly projectName: string;
    /**
     * Reference to the schema of the root node. Creating a project will also
     * automatically create the base node of the project and link the schema to the
     * initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
    /** Uuid of the node */
    readonly uuid: string;
}

/**
 * Returned for:
 *   - `GET /{project}/nodes/{nodeUuid}`
 *   - `POST /{project}/nodes`
 *   - `POST /{project}/nodes/{nodeUuid}`
 *   - `POST /{project}/nodes/{nodeUuid}/binary/{fieldName}`
 *   - `POST /{project}/nodes/{nodeUuid}/binaryTransform/{fieldName}`
 *   - `POST /{project}/nodes/{nodeUuid}/tags/{tagUuid}`
 */
export interface NodeResponse {
    /** List of languages for which content is available. */
    readonly availableLanguages: string[];
    /**
     * List of nodes which construct the breadcrumb. Note that the start node will not
     * be included in the list.
     */
    readonly breadcrumb: NodeReferenceFromServer[];
    /** Object which contains information about child elements. */
    readonly childrenInfo?: { [key: string]: NodeChildrenInfoFromServer };
    /**
     * Flag which indicates whether the node is a container and can contain nested
     * elements.
     */
    readonly container: boolean;
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /**
     * Display field value of the node. May not be retured if the node schema has no
     * display field value.
     */
    readonly displayField?: string;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** Dynamic map with fields of the node language specific content. */
    readonly fields: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    readonly language?: string;
    /**
     * Map of webroot paths per language. This property will only be populated if the
     * resolveLinks query parameter has been set accordingly.
     */
    readonly languagePaths?: { [key: string]: string };
    /** The project root node. All futher nodes are children of this node. */
    readonly parentNode: NodeReferenceFromServer;
    /**
     * Webroot path to the node content. Will only be provided if the resolveLinks query
     * parameter has been set accordingly.
     */
    readonly path?: string;
    readonly permissions: PermissionInfoFromServer;
    /** Reference to the project of the node. */
    readonly project: ProjectReferenceFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /**
     * Reference to the schema of the root node. Creating a project will also
     * automatically create the base node of the project and link the schema to the
     * initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
    /** List of tags that were used to tag the node. */
    readonly tags: TagReferenceFromServer[];
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the node content. */
    readonly version: string;
}

export interface NodeUpdateRequest {
    /** Dynamic map with fields of the node language specific content. */
    readonly fields: FieldMapFromServer;
    /** ISO 639-1 language tag of the node content. */
    readonly language: string;
    /**
     * Version number which must be provided in order to handle and detect concurrent
     * changes to the node content.
     */
    readonly version: string;
}

/** Paging information of the list result. */
export interface PagingMetaInfoFromServer {
    /** Number of the current page. */
    readonly currentPage: Integer;
    /** Number of the pages which can be found for the given per page count. */
    readonly pageCount: Integer;
    /** Number of elements which can be included in a single page. */
    readonly perPage: Integer;
    /** Number of all elements which could be found. */
    readonly totalCount: Integer;
}

export interface PermissionInfoFromServer {
    /** Flag which indicates whether the create permission is granted. */
    readonly create: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    readonly delete: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    readonly publish: boolean;
    /** Flag which indicates whether the read permission is granted. */
    readonly read: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readonly readPublished: boolean;
    /** Flag which indicates whether the update permission is granted. */
    readonly update: boolean;
}

export interface ProjectCreateRequest {
    /** Name of the project */
    readonly name: string;
    /**
     * Reference to the schema of the root node. Creating a project will also
     * automatically create the base node of the project and link the schema to the
     * initial release of the project.
     */
    readonly schema: SchemaReferenceFromServer;
}

/**
 * Returned for:
 *   - `GET /projects`
 *   - `POST /search/projects`
 */
export interface ProjectListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: ProjectResponse[];
}

/** Reference to the project of the node. */
export interface ProjectReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *   - `GET /projects/{projectUuid}`
 *   - `GET /{project}`
 *   - `POST /projects`
 *   - `POST /projects/{projectUuid}`
 */
export interface ProjectResponse {
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
    /** The project root node. All futher nodes are children of this node. */
    readonly rootNode: NodeReferenceFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface ProjectUpdateRequest {
    /** New name of the project */
    readonly name: string;
}

/**
 * Returned for:
 *   - `GET /{project}/nodes/{nodeUuid}/languages/{language}/published`
 *   - `POST /{project}/nodes/{nodeUuid}/languages/{language}/published`
 *   - `DELETE /{project}/nodes/{nodeUuid}/languages/{language}/published`
 */
export interface PublishStatusModelFromServer {
    /** ISO8601 formatted publish date string. */
    readonly publishDate?: string;
    /** Flag which indicates whether the content is published. */
    readonly published?: boolean;
    /** User reference of the creator of the element. */
    readonly publisher: UserReferenceFromServer;
    /** Version number. */
    readonly version?: string;
}

/**
 * Returned for:
 *   - `GET /{project}/nodes/{nodeUuid}/published`
 *   - `POST /{project}/nodes/{nodeUuid}/published`
 */
export interface PublishStatusResponse {
    /** Map of publish status entries per language */
    readonly availableLanguages?: { [key: string]: PublishStatusModelFromServer };
}

export interface ReleaseCreateRequest {
    /** Name of the release */
    readonly name: string;
}

/**
 * Returned for `GET /{project}/releases`
 */
export interface ReleaseListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: ReleaseResponse[];
}

/**
 * Returned for:
 *   - `GET /{project}/releases/{releaseUuid}`
 *   - `POST /{project}/releases`
 *   - `POST /{project}/releases/{releaseUuid}`
 */
export interface ReleaseResponse {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /**
     * Flag which indicates whether any active node migration for this release is still
     * running or whether all nodes have been migrated to this release
     */
    readonly migrated: boolean;
    /** Name of the release */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface ReleaseUpdateRequest {
    /** Name of the release */
    readonly name: string;
}

export interface RoleCreateRequest {
    /** New name of the role */
    readonly name: string;
}

/**
 * Returned for:
 *   - `GET /groups/{groupUuid}/roles`
 *   - `GET /roles`
 *   - `POST /search/roles`
 */
export interface RoleListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: RoleResponse[];
}

export interface RolePermissionRequest {
    readonly permissions: PermissionInfoFromServer;
    /** Flag which indicates whether the permission update should be applied recursivly. */
    readonly recursive?: boolean;
}

/**
 * Returned for `GET /roles/{roleUuid}/permissions/{path}`
 */
export interface RolePermissionResponse {
    /** Flag which indicates whether the create permission is granted. */
    readonly create: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    readonly delete: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    readonly publish: boolean;
    /** Flag which indicates whether the read permission is granted. */
    readonly read: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readonly readPublished: boolean;
    /** Flag which indicates whether the update permission is granted. */
    readonly update: boolean;
}

export interface RoleReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
}

/**
 * Returned for:
 *   - `GET /roles/{roleUuid}`
 *   - `POST /roles`
 *   - `POST /roles/{roleUuid}`
 */
export interface RoleResponse {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /** List of groups which are assigned to the role. */
    readonly groups: GroupReferenceFromServer[];
    /** Name of the role. */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface RoleUpdateRequest {
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
 *   - `POST /microschemas/{microschemaUuid}/diff`
 *   - `POST /schemas/{schemaUuid}/diff`
 */
export interface SchemaChangesListModelFromServer {
    readonly changes?: SchemaChangeModelFromServer[];
}

export interface SchemaCreateRequest {
    /**
     * Flag which indicates whether nodes which use this schema store additional child
     * nodes.
     */
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
     * Name of the segment field. This field is used to construct the webroot path to
     * the node.
     */
    readonly segmentField: string;
}

/**
 * Returned for:
 *   - `GET /schemas`
 *   - `GET /{project}/schemas`
 *   - `POST /search/schemas`
 */
export interface SchemaListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: SchemaResponse[];
}

/**
 * Reference to the schema of the root node. Creating a project will also
 * automatically create the base node of the project and link the schema to the
 * initial release of the project.
 */
export interface SchemaReferenceFromServer {
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
    readonly version?: string;
}

/**
 * Returned for:
 *   - `GET /schemas/{schemaUuid}`
 *   - `GET /{project}/schemas/{schemaUuid}`
 *   - `POST /schemas`
 *   - `POST /schemas/{schemaUuid}`
 *   - `POST /{project}/schemas/{schemaUuid}`
 */
export interface SchemaResponse {
    /**
     * Flag which indicates whether nodes which use this schema store additional child
     * nodes.
     */
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
     * Name of the segment field. This field is used to construct the webroot path to
     * the node.
     */
    readonly segmentField: string;
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the schema */
    readonly version: string;
}

export interface SchemaUpdateRequest {
    /**
     * Flag which indicates whether nodes which use this schema store additional child
     * nodes.
     */
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
     * Name of the segment field. This field is used to construct the webroot path to
     * the node.
     */
    readonly segmentField: string;
    /** Version of the schema */
    readonly version: string;
}

export interface TagCreateRequest {
    /** Name of the tag which will be created. */
    readonly name: string;
}

export interface TagFamilyCreateRequest {
    /** Name of the tag family which will be created. */
    readonly name: string;
}

/**
 * Returned for:
 *   - `GET /{project}/tagFamilies`
 *   - `POST /search/tagFamilies`
 *   - `POST /{project}/search/tagFamilies`
 */
export interface TagFamilyListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: TagFamilyResponse[];
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
 *   - `GET /{project}/tagFamilies/{tagFamilyUuid}`
 *   - `POST /{project}/tagFamilies`
 *   - `POST /{project}/tagFamilies/{tagFamilyUuid}`
 */
export interface TagFamilyResponse {
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

export interface TagFamilyUpdateRequest {
    /** New name of the tag family */
    readonly name: string;
}

/**
 * Returned for:
 *   - `GET /{project}/nodes/{nodeUuid}/tags`
 *   - `GET /{project}/tagFamilies/{tagFamilyUuid}/tags`
 *   - `POST /search/tags`
 *   - `POST /{project}/nodes/{nodeUuid}/tags`
 *   - `POST /{project}/search/tags`
 */
export interface TagListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: TagResponse[];
}

export interface TagListUpdateRequest {
    /**
     * List of tags which should be assigned to the node. Tags which are not included
     * will be removed from the node.
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
 *   - `GET /{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}`
 *   - `POST /{project}/tagFamilies/{tagFamilyUuid}/tags`
 *   - `POST /{project}/tagFamilies/{tagFamilyUuid}/tags/{tagUuid}`
 */
export interface TagResponse {
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

export interface TagUpdateRequest {
    /** New name of the tag. */
    readonly name: string;
}

/**
 * Returned for `POST /users/{userUuid}/token`
 */
export interface UserAPITokenResponse {
    /** Date of the last time the API token was issued. */
    readonly previousIssueDate: string;
    /** Issued client API token. */
    readonly token: string;
}

export interface UserCreateRequest {
    /** New email address of the user */
    readonly emailAddress?: string;
    /** New firstname of the user */
    readonly firstname?: string;
    /**
     * Optional group id for the user. If provided the user will automatically be
     * assigned to the identified group.
     */
    readonly groupUuid?: string;
    /** New lastname of the user */
    readonly lastname?: string;
    /**
     * New node reference of the user. This can also explicitly set to null in order to
     * remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    /** New password of the user */
    readonly password?: string;
    /** New username of the user */
    readonly username: string;
}

/**
 * Returned for:
 *   - `GET /groups/{groupUuid}/users`
 *   - `GET /users`
 *   - `POST /search/users`
 */
export interface UserListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: UserResponse[];
}

/**
 * Returned for `GET /users/{userUuid}/permissions/{path}`
 */
export interface UserPermissionResponse {
    /** Flag which indicates whether the create permission is granted. */
    readonly create: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    readonly delete: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    readonly publish: boolean;
    /** Flag which indicates whether the read permission is granted. */
    readonly read: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readonly readPublished: boolean;
    /** Flag which indicates whether the update permission is granted. */
    readonly update: boolean;
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
 * Returned for `POST /users/{userUuid}/reset_token`
 */
export interface UserResetTokenResponse {
    /** ISO8601 date of the creation date for the provided token */
    readonly created: string;
    /** JSON Web Token which was issued by the API. */
    readonly token: string;
}

/**
 * Returned for:
 *   - `GET /auth/me`
 *   - `GET /users/{userUuid}`
 *   - `POST /users`
 *   - `POST /users/{userUuid}`
 */
export interface UserResponse {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the editor of the element. */
    readonly editor?: UserReferenceFromServer;
    /** Email address of the user */
    readonly emailAddress?: string;
    /**
     * Flag which indicates whether the user is enabled or disabled. Disabled users can
     * no longer log into Gentics Mesh. Deleting a user user will not remove it. Instead
     * the user will just be disabled.
     */
    readonly enabled: boolean;
    /** Firstname of the user. */
    readonly firstname?: string;
    /** List of group references to which the user belongs. */
    readonly groups: GroupReferenceFromServer[];
    /** Lastname of the user. */
    readonly lastname?: string;
    /**
     * New node reference of the user. This can also explicitly set to null in order to
     * remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    readonly permissions: PermissionInfoFromServer;
    /**
     * Permission information for provided role. This property will only be populated if
     * a role query parameter has been specified.
     */
    readonly rolePerms?: PermissionInfoFromServer;
    /** Username of the user. */
    readonly username: string;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface UserUpdateRequest {
    /** New email address of the user */
    readonly emailAddress?: string;
    /** New firstname of the user */
    readonly firstname?: string;
    /** New lastname of the user */
    readonly lastname?: string;
    /**
     * New node reference of the user. This can also explicitly set to null in order to
     * remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    readonly oldPassword?: string;
    /** New password of the user */
    readonly password?: string;
    /** New username of the user */
    readonly username?: string;
}
