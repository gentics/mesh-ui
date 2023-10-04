import { HttpHeaders } from '@angular/common/http';

import { ListTypeFieldType } from './schema.model';

// Auto-generated from the RAML for Version 0.22.0-SNAPSHOT of the Gentics Mesh REST API.

export type Integer = number;

/** List of all API endpoints and their types */
export interface ApiEndpoints {
    GET: {
        /** Endpoint which returns version information */
        '/': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: MeshServerInfoModelFromServer;
            responseTypes: {
                /** JSON which contains version information */
                200: MeshServerInfoModelFromServer;
            };
        };
        /** Loads the cluster status information. */
        '/admin/cluster/status': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: ClusterStatusResponse;
            responseTypes: {
                /** Cluster status. */
                200: ClusterStatusResponse;
            };
        };
        /**
         * Invokes a consistency check of the graph database without attempting to repairing
         * the found issues. A list of found issues will be returned.
         */
        '/admin/consistency/check': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: ConsistencyCheckResponse;
            responseTypes: {
                /** Consistency check report */
                200: ConsistencyCheckResponse;
            };
        };
        /** List all currently queued jobs. */
        '/admin/jobs': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: JobListResponse;
            responseTypes: {
                /** List of jobs. */
                200: JobListResponse;
            };
        };
        /** Load a specific job. */
        '/admin/jobs/{jobUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the job.
                     * @example "ae8ea9edd0af475b8ea9edd0afc75b0f"
                     */
                    jobUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: JobResponse;
            responseTypes: {
                /** Job information. */
                200: JobResponse;
            };
        };
        /** Loads deployment information for all deployed plugins. */
        '/admin/plugins': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: PluginListResponse;
            responseTypes: {
                /** Plugin list response. */
                200: PluginListResponse;
            };
        };
        /** Loads deployment information for the plugin with the given id. */
        '/admin/plugins/{uuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the plugin.
                     * @example "79c973278d8c466f8973278d8ce66ff5"
                     */
                    uuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: PluginResponse;
            responseTypes: {
                /** Plugin response. */
                200: PluginResponse;
            };
        };
        /** Return the Gentics Mesh server status. */
        '/admin/status': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: MeshStatusResponse;
            responseTypes: {
                /** Status of the Gentics Mesh server. */
                200: MeshStatusResponse;
            };
        };
        /** Login via basic authentication. */
        '/auth/login': {
            request: {
                urlParams?: {};
                queryParams?: {};
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
                urlParams?: {};
                queryParams?: {};
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
                urlParams?: {};
                queryParams?: {
                    fields?: string;
                    etag?: boolean;
                };
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
                urlParams?: {};
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
                     * @example "0f02358b9fa548d582358b9fa5d8d5c6"
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
                     * @example "fba72edfc7bd41a0a72edfc7bd51a0e6"
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
                     * @example "10e8e6e6979b4573a8e6e6979b357332"
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
                };
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
                urlParams?: {};
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
                     * @example "20893dcd3d644489893dcd3d6434891d"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
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
                urlParams?: {};
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
                    fields?: string;
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
                     * @example "aa2d2421ce06487cad2421ce06087c8a"
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
                urlParams?: {};
                queryParams?: {};
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
                urlParams?: {};
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
                     * @example "4cfdd318868f4354bdd318868f435431"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                     *     "projects/1452bf5893f842dd92bf5893f812dd82"
                     *     "projects/87e5c286ed7a46cda5c286ed7a26cd43/nodes/ec5b4fda50c34ecf9b4fda50c37ecffd"
                     *     ""
                     */
                    path: string;
                    /**
                     * Uuid of the role.
                     * @example "59db1218b6ce4cb09b1218b6ceccb04d"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                urlParams?: {};
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
                     * @example "f41898e932414d079898e932413d07a0"
                     */
                    schemaUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
                body?: undefined;
            };
            responseType: SchemaResponse;
            responseTypes: {
                /** Loaded schema. */
                200: SchemaResponse;
            };
        };
        /** Returns the search index status. */
        '/search/status': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: SearchStatusResponse;
            responseTypes: {
                /** Search index status. */
                200: SearchStatusResponse;
            };
        };
        /** Load multiple users and return a paged list response. */
        '/users': {
            request: {
                urlParams?: {};
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
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
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
                     * @example "43673ba298f34398a73ba298f303983b"
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
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
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
                     * @example "d595f3309fb94ba795f3309fb99ba7d8"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                queryParams?: {};
                body?: undefined;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Project information. */
                200: ProjectResponse;
            };
        };
        /** Load multiple branches and return a paged list response. */
        '/{project}/branches': {
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
            responseType: BranchListResponse;
            responseTypes: {
                /** Loaded branches. */
                200: BranchListResponse;
            };
        };
        /** Load the branch with the given uuid. */
        '/{project}/branches/{branchUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "e47186d5f0f24427b186d5f0f2e427b8"
                     */
                    branchUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: BranchResponse;
            responseTypes: {
                /** Loaded branch. */
                200: BranchResponse;
            };
        };
        /**
         * Load microschemas that are assigned to the branch and return a paged list
         * response.
         */
        '/{project}/branches/{branchUuid}/microschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "683bb3381d8d430cbbb3381d8d230cb1"
                     */
                    branchUuid: string;
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
            responseType: BranchInfoMicroschemaListFromServer;
            responseTypes: {
                /** List of microschemas. */
                200: BranchInfoMicroschemaListFromServer;
            };
        };
        /** Load schemas that are assigned to the branch and return a paged list response. */
        '/{project}/branches/{branchUuid}/schemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "cc5c470efa7441d59c470efa74d1d5ce"
                     */
                    branchUuid: string;
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
            responseType: BranchInfoSchemaListFromServer;
            responseTypes: {
                /** Loaded schema list. */
                200: BranchInfoSchemaListFromServer;
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
                queryParams?: {};
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
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
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
                     * @example "d46763a2cb5a4fb7a763a2cb5a1fb7ff"
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
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
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
                     * @example "87a6c6088afa4f5fa6c6088afa2f5f33"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Set the focal point zoom factor. The value must be greater than one.
                     * @example 1.5
                     */
                    fpz?: number;
                    /**
                     * Set image crop area.
                     * @example "20,20,128,128"
                     */
                    rect?: string;
                    /**
                     * Set image target width. The height will automatically be calculated if the width
                     * was omitted.
                     * @example 1280
                     */
                    w?: number;
                    /**
                     * Set image target height. The width will automatically be calculated if the height
                     * was omitted.
                     * @example 720
                     */
                    h?: number;
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                    /**
                     * Set the focal point y factor between 0  and 1 where 0.5 is the middle of the
                     * image. You can use this parameter in combination with the crop=fp parameter in
                     * order to crop and resize the image in relation to the given point.
                     * @example 0.2
                     */
                    fpy?: number;
                    /**
                     * Set the crop mode. Possible modes:
                     * rect : The rect mode will work in combination with the rect parameter and crop
                     * the specified area.
                     * fp : The fp mode will utilize the specified or pre-selected focal point and crop
                     * the image according to the position of the focus point and the specified image
                     * size.
                     *
                     * @example "rect"
                     */
                    crop?: string;
                    /**
                     * Set the focal point x factor between 0  and 1 where 0.5 is the middle of the
                     * image.  You can use this parameter in combination with the crop=fp parameter in
                     * order to crop and resize the image in relation to the given point.
                     * @example 0.1
                     */
                    fpx?: number;
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
                     * @example "cb80cde5b57b4cda80cde5b57bacda6a"
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
                     * Parameter which can be used to disable the etag parameter generation and thus increase performance when etags are not needed.
                     */
                    fields?: string;
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
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
                     * @example "4b97bb21b4594d3697bb21b4593d361c"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
                     * @example "774bc609ae2d44648bc609ae2da46461"
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
                     * @example "37421ba204434d18821ba20443cd18db"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
                     * @example "6593bdb70944456393bdb70944d56340"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
                body?: undefined;
            };
            responseType: TagListResponse;
            responseTypes: {
                /** List of tags that were used to tag the node. */
                200: TagListResponse;
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
                queryParams?: {};
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
                     * @example "ba1901cc79ec42249901cc79ec022430"
                     */
                    schemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "fb206e4224aa4fcea06e4224aabfce1b"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: {};
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
                     * @example "de71dc1ed4ac4658b1dc1ed4ac96581b"
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
                     * @example "0dbd803118c84c69bd803118c8ec6981"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "0219964486e6401599964486e60015c7"
                     */
                    tagUuid: string;
                };
                queryParams?: {};
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
                     * @example "dcf253f352924cc4b253f35292bcc44b"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "95f397d38b664b5cb397d38b660b5c42"
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
                     * Set the focal point zoom factor. The value must be greater than one.
                     * @example 1.5
                     */
                    fpz?: number;
                    /**
                     * Set image crop area.
                     * @example "20,20,128,128"
                     */
                    rect?: string;
                    /**
                     * Set image target width. The height will automatically be calculated if the width
                     * was omitted.
                     * @example 1280
                     */
                    w?: number;
                    /**
                     * Set image target height. The width will automatically be calculated if the height
                     * was omitted.
                     * @example 720
                     */
                    h?: number;
                    /**
                     * Set the focal point y factor between 0  and 1 where 0.5 is the middle of the
                     * image. You can use this parameter in combination with the crop=fp parameter in
                     * order to crop and resize the image in relation to the given point.
                     * @example 0.2
                     */
                    fpy?: number;
                    /**
                     * Set the crop mode. Possible modes:
                     * rect : The rect mode will work in combination with the rect parameter and crop
                     * the specified area.
                     * fp : The fp mode will utilize the specified or pre-selected focal point and crop
                     * the image according to the position of the focus point and the specified image
                     * size.
                     *
                     * @example "rect"
                     */
                    crop?: string;
                    /**
                     * Set the focal point x factor between 0  and 1 where 0.5 is the middle of the
                     * image.  You can use this parameter in combination with the crop=fp parameter in
                     * order to crop and resize the image in relation to the given point.
                     * @example 0.1
                     */
                    fpx?: number;
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
         * Invokes a consistency check and repair of the graph database and returns a list
         * of found issues and their state.
         */
        '/admin/consistency/repair': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: ConsistencyCheckResponse;
            responseTypes: {
                /** Consistency check and repair report */
                200: ConsistencyCheckResponse;
            };
        };
        /**
         * Invoke a graph database backup and dump the data to the configured backup
         * location. Note that this operation will block all current operation.
         */
        '/admin/graphdb/backup': {
            request: {
                urlParams?: {};
                queryParams?: {};
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
         * effectively destroy all previously stored data.
         */
        '/admin/graphdb/restore': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Database restore command was invoked. */
                200: GenericMessageResponse;
            };
        };
        /** Deploys the plugin using the provided deployment information. */
        '/admin/plugins': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: PluginDeploymentRequest;
            };
            responseType: PluginResponse;
            responseTypes: {
                /** Plugin response. */
                200: PluginResponse;
            };
        };
        /** Invoke the processing of remaining jobs. */
        '/admin/processJobs': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Response message. */
                200: GenericMessageResponse;
            };
        };
        /** Login via this dedicated login endpoint. */
        '/auth/login': {
            request: {
                urlParams?: {};
                queryParams?: {};
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
                urlParams?: {};
                queryParams?: {};
                body: GroupCreateRequest;
            };
            responseType: GroupResponse;
            responseTypes: {
                /** Created group. */
                201: GroupResponse;
            };
        };
        /**
         * Update the group with the given uuid. The group is created if no group with the
         * specified uuid could be found.
         */
        '/groups/{groupUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group which should be deleted.
                     * @example "0f02358b9fa548d582358b9fa5d8d5c6"
                     */
                    groupUuid: string;
                };
                queryParams?: {};
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
                     * @example "a7233ba6df804deca33ba6df806dec2a"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the role.
                     * @example "eff7860e746a4c7ab7860e746aac7ae1"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                     * @example "a85ef6865b594dcc9ef6865b594dcc59"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the user which should be removed from the group.
                     * @example "d8b25d6a7c7c4490b25d6a7c7ca490c1"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                urlParams?: {};
                queryParams?: {};
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
                     * @example "20893dcd3d644489893dcd3d6434891d"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "7ba2a4b71f7a445fa2a4b71f7a045f4b"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "cf996df98c8e4d40996df98c8efd40ae"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {};
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
                urlParams?: {};
                queryParams?: {};
                body: ProjectCreateRequest;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Created project. */
                201: ProjectResponse;
            };
        };
        /**
         * Update the project with the given uuid. The project is created if no project with
         * the specified uuid could be found.
         */
        '/projects/{projectUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the project.
                     * @example "aa2d2421ce06487cad2421ce06087c8a"
                     */
                    projectUuid: string;
                };
                queryParams?: {};
                body: ProjectUpdateRequest;
            };
            responseType: ProjectResponse;
            responseTypes: {
                /** Updated project. */
                200: ProjectResponse;
            };
        };
        /**
         * Invoke a search query for groups and return the unmodified Elasticsearch
         * response. Note that the query will be executed using the multi search API of
         * Elasticsearch.
         */
        '/rawSearch/groups': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for microschemas and return the unmodified Elasticsearch
         * response. Note that the query will be executed using the multi search API of
         * Elasticsearch.
         */
        '/rawSearch/microschemas': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for nodes and return the unmodified Elasticsearch response.
         * Note that the query will be executed using the multi search API of Elasticsearch.
         */
        '/rawSearch/nodes': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for projects and return the unmodified Elasticsearch
         * response. Note that the query will be executed using the multi search API of
         * Elasticsearch.
         */
        '/rawSearch/projects': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for roles and return the unmodified Elasticsearch response.
         * Note that the query will be executed using the multi search API of Elasticsearch.
         */
        '/rawSearch/roles': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for schemas and return the unmodified Elasticsearch
         * response. Note that the query will be executed using the multi search API of
         * Elasticsearch.
         */
        '/rawSearch/schemas': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for tagFamilies and return the unmodified Elasticsearch
         * response. Note that the query will be executed using the multi search API of
         * Elasticsearch.
         */
        '/rawSearch/tagFamilies': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for tags and return the unmodified Elasticsearch response.
         * Note that the query will be executed using the multi search API of Elasticsearch.
         */
        '/rawSearch/tags': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for users and return the unmodified Elasticsearch response.
         * Note that the query will be executed using the multi search API of Elasticsearch.
         */
        '/rawSearch/users': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Create a new role. */
        '/roles': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: RoleCreateRequest;
            };
            responseType: RoleResponse;
            responseTypes: {
                /** Created role. */
                201: RoleResponse;
            };
        };
        /**
         * Update the role with the given uuid. The role is created if no role with the
         * specified uuid could be found.
         */
        '/roles/{roleUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the role
                     * @example "4cfdd318868f4354bdd318868f435431"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                     *     "projects/1452bf5893f842dd92bf5893f812dd82"
                     *     "projects/87e5c286ed7a46cda5c286ed7a26cd43/nodes/ec5b4fda50c34ecf9b4fda50c37ecffd"
                     *     ""
                     */
                    path: string;
                    /**
                     * Uuid of the role.
                     * @example "59db1218b6ce4cb09b1218b6ceccb04d"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                urlParams?: {};
                queryParams?: {};
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
                     * @example "f41898e932414d079898e932413d07a0"
                     */
                    schemaUuid: string;
                };
                queryParams?: {
                    /**
                     * Update the schema version for all branches which already utilize the schema
                     * (default: true).
                     */
                    updateAssignedBranches?: boolean;
                    /**
                     * List of branch names which should be included in the update process. By default
                     * all branches which use the schema will be updated. You can thus use this
                     * parameter to only include a subset of branch in the update.
                     * @example "summerBranch,winterBranch"
                     */
                    updateBranchNames?: string;
                };
                body: SchemaUpdateRequest;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Updated schema. */
                200: GenericMessageResponse;
            };
        };
        /**
         * Apply the posted changes to the schema. The schema migration will not
         * automatically be started.
         */
        '/schemas/{schemaUuid}/changes': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "129c496b4df64b779c496b4df60b77f3"
                     */
                    schemaUuid: string;
                };
                queryParams?: {};
                body: SchemaChangesListModelFromServer;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Schema changes have been applied. */
                200: GenericMessageResponse;
            };
        };
        /** Compare the given schema with the stored schema and create a changeset. */
        '/schemas/{schemaUuid}/diff': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the schema.
                     * @example "81f58e9844a3441bb58e9844a3241b79"
                     */
                    schemaUuid: string;
                };
                queryParams?: {};
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
        /**
         * Drops all indices and recreates them. The index sync is not invoked
         * automatically.
         */
        '/search/clear': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Recreated all indices. */
                200: GenericMessageResponse;
            };
        };
        /** Invoke a search query for groups and return a paged list response. */
        '/search/groups': {
            request: {
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
            };
            responseType: SchemaListResponse;
            responseTypes: {
                /** Paged search result for schemas */
                200: SchemaListResponse;
            };
        };
        /**
         * Invokes the manual synchronisation of the search indices. This operation may take
         * some time to complete and is performed asynchronously. When clustering is enabled
         * it will be executed on any free instance.
         */
        '/search/sync': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** Invoked index synchronisation on all indices. */
                200: GenericMessageResponse;
            };
        };
        /** Invoke a search query for tagFamilies and return a paged list response. */
        '/search/tagFamilies': {
            request: {
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
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
                body: any;
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
                urlParams?: {};
                queryParams?: {};
                body: UserCreateRequest;
            };
            responseType: UserResponse;
            responseTypes: {
                /** User response of the created user. */
                201: UserResponse;
            };
        };
        /**
         * Update the user with the given uuid. The user is created if no user with the
         * specified uuid could be found.
         */
        '/users/{userUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the user.
                     * @example "43673ba298f34398a73ba298f303983b"
                     */
                    userUuid: string;
                };
                queryParams?: {
                    /**
                     * Token code which can be used to update the user even if the connection is not
                     * authenticated. This can be used to implement a password recovery feature.
                     * @example "cGrv42FB8RkJ"
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
                     * @example "cfaaa63c0aa04f30aaa63c0aa01f301e"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                     * @example "2f6cfd4584cf4890acfd4584cf38903a"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                urlParams?: {};
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
        /** Validate the posted microschema and report errors. */
        '/utilities/validateMicroschema': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: MicroschemaCreateRequest;
            };
            responseType: SchemaValidationResponse;
            responseTypes: {
                /** The validation report */
                200: SchemaValidationResponse;
            };
        };
        /** Validate the posted schema and report errors. */
        '/utilities/validateSchema': {
            request: {
                urlParams?: {};
                queryParams?: {};
                body: SchemaUpdateRequest;
            };
            responseType: SchemaValidationResponse;
            responseTypes: {
                /** The validation message */
                200: SchemaValidationResponse;
            };
        };
        /** Create a new branch and automatically invoke a node migration. */
        '/{project}/branches': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {};
                body: BranchCreateRequest;
            };
            responseType: BranchResponse;
            responseTypes: {
                /** Created branch. */
                201: BranchResponse;
            };
        };
        /**
         * Update the branch with the given uuid. The branch is created if no branch with
         * the specified uuid could be found.
         */
        '/{project}/branches/{branchUuid}': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "e47186d5f0f24427b186d5f0f2e427b8"
                     */
                    branchUuid: string;
                };
                queryParams?: {};
                body: BranchUpdateRequest;
            };
            responseType: BranchResponse;
            responseTypes: {
                /** Updated branch */
                200: BranchResponse;
            };
        };
        /** Assign a microschema version to the branch. */
        '/{project}/branches/{branchUuid}/microschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "683bb3381d8d430cbbb3381d8d230cb1"
                     */
                    branchUuid: string;
                };
                queryParams?: {};
                body: BranchInfoMicroschemaListFromServer;
            };
            responseType: BranchInfoMicroschemaListFromServer;
            responseTypes: {
                /** Updated microschema list. */
                200: BranchInfoMicroschemaListFromServer;
            };
        };
        /**
         * Invoked the micronode migration for not yet migrated micronodes of microschemas
         * that are assigned to the branch.
         */
        '/{project}/branches/{branchUuid}/migrateMicroschemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "117dce6865404265bdce6865402265a6"
                     */
                    branchUuid: string;
                };
                queryParams?: {};
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
         * assigned to the branch.
         */
        '/{project}/branches/{branchUuid}/migrateSchemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "61878e7cff564150878e7cff56815078"
                     */
                    branchUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: GenericMessageResponse;
            responseTypes: {
                /** schema_migration_invoked */
                200: GenericMessageResponse;
            };
        };
        /** Assign a schema version to the breanch. */
        '/{project}/branches/{branchUuid}/schemas': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                    /**
                     * Uuid of the branch
                     * @example "cc5c470efa7441d59c470efa74d1d5ce"
                     */
                    branchUuid: string;
                };
                queryParams?: {};
                body: BranchInfoSchemaListFromServer;
            };
            responseType: BranchInfoSchemaListFromServer;
            responseTypes: {
                /** Updated schema list. */
                200: BranchInfoSchemaListFromServer;
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
                queryParams?: {};
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
                     * @example "3a2b70b5811f4d94ab70b5811f2d9478"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {};
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
                queryParams?: {};
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
         * checks for WebRoot path conflicts will also be performed. The node is created if
         * no node with the specified uuid could be found.
         * Also, 400 needs to be checked for malformed requests.
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
                     * @example "d46763a2cb5a4fb7a763a2cb5a1fb7ff"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
                body: NodeUpdateRequest;
            };
            responseType: NodeResponse | GenericMessageResponse;
            responseTypes: {
                /** Updated node. */
                200: NodeResponse;
                /** Malformed request */
                400: GenericMessageResponse;
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
                     * @example "87a6c6088afa4f5fa6c6088afa2f5f33"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
        /** Generate URL for the s3binaryfield upload. */
        '/{project}/nodes/{nodeUuid}/s3binary/{fieldName}': {
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
                     * @example "87a6c6088afa4f5fa6c6088afa2f5f33"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
                body: {
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
                    /**
                     * Name of the file which should be uploaded.
                     * @example "test.jpg"
                     */
                    filename: string;
                };
            };
            responseType: S3BinaryUrlGenerationResponse;
            responseTypes: {
                /** The response contains the presigned URL. */
                200: S3BinaryUrlGenerationResponse;
            };
        };
        /** Parse metadata for s3binaryfield. */
        '/{project}/nodes/{nodeUuid}/s3binary/{fieldName}/parseMetadata': {
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
                     * @example "87a6c6088afa4f5fa6c6088afa2f5f33"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
                body: {
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
                     * @example "a57eb063c07446d9beb063c07466d94c"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
                     * @example "4b97bb21b4594d3697bb21b4593d361c"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
                     * @example "bb30943a754f4e6db0943a754fae6da1"
                     */
                    toUuid: string;
                    /**
                     * Uuid of the node which should be moved.
                     * @example "a95b2b8fe7a548759b2b8fe7a5f875a1"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Node was moved. */
                204: undefined;
            };
        };
        /** Publish all language specific contents of the node with the given uuid. */
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
                     * @example "37421ba204434d18821ba20443cd18db"
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
                     * @example "6593bdb70944456393bdb70944d56340"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
                     * @example "084c1daa79364be08c1daa7936bbe0d5"
                     */
                    tagUuid: string;
                    /**
                     * Uuid of the node
                     * @example "6ea7175dbd24418aa7175dbd24818acb"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifies the branch to be used for loading data. The latest project branch will
                     * be used if this parameter is omitted.
                     * @example "24cf92691c7641158f92691c76c115ef"
                     */
                    branch?: string;
                    /**
                     * Specifies the version to be loaded (default: 'draft'). Can either be
                     * published/draft or version number. e.g.: _0.1_, _1.0_, _draft_, _published_.
                     * @example "1.1"
                     */
                    version?: string;
                };
                body?: undefined;
            };
            responseType: NodeResponse;
            responseTypes: {
                /** Updated node. */
                200: NodeResponse;
            };
        };
        /**
         * Invoke a search query for nodes and return the unmodified Elasticsearch response.
         * Note that the query will be executed using the multi search API of Elasticsearch.
         */
        '/{project}/rawSearch/nodes': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for tagFamilies and return the unmodified Elasticsearch
         * response. Note that the query will be executed using the multi search API of
         * Elasticsearch.
         */
        '/{project}/rawSearch/tagFamilies': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Invoke a search query for tags and return the unmodified Elasticsearch response.
         * Note that the query will be executed using the multi search API of Elasticsearch.
         */
        '/{project}/rawSearch/tags': {
            request: {
                urlParams: {
                    /**
                     * Name of the project.
                     * @example "demo"
                     */
                    project: string;
                };
                queryParams?: {};
                body: any;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Assign the schema to the project. This will automatically assign the latest
         * schema version to all branches of the project.
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
                     * @example "ba1901cc79ec42249901cc79ec022430"
                     */
                    schemaUuid: string;
                };
                queryParams?: {};
                body?: undefined;
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
                queryParams?: {};
                body: any;
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
                queryParams?: {};
                body: any;
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
                queryParams?: {};
                body: any;
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
                queryParams?: {};
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
                     * @example "fb206e4224aa4fcea06e4224aabfce1b"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: {};
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
                     * @example "de71dc1ed4ac4658b1dc1ed4ac96581b"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: {};
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
                     * @example "0dbd803118c84c69bd803118c8ec6981"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "0219964486e6401599964486e60015c7"
                     */
                    tagUuid: string;
                };
                queryParams?: {};
                body: TagUpdateRequest;
            };
            responseType: TagResponse;
            responseTypes: {
                /** Updated tag. */
                200: TagResponse;
            };
        };
    };
    PATCH: {};
    PUT: {};
    DELETE: {
        /** Deletes the job. Note that it is only possible to delete failed jobs */
        '/admin/jobs/{jobUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the job.
                     * @example "ae8ea9edd0af475b8ea9edd0afc75b0f"
                     */
                    jobUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /**
         * Deletes error state from the job. This will make it possible to execute the job
         * once again.
         */
        '/admin/jobs/{jobUuid}/error': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the job.
                     * @example "ab7bf4acbf1f4dacbbf4acbf1f6dacef"
                     */
                    jobUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: any; // TODO: This is not typed in the RAML
            responseTypes: {
                200: any; // TODO: This is not typed in the RAML
            };
        };
        /** Undeploys the plugin with the given uuid. */
        '/admin/plugins/{uuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the plugin.
                     * @example "79c973278d8c466f8973278d8ce66ff5"
                     */
                    uuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: PluginResponse;
            responseTypes: {
                /** Plugin response. */
                200: PluginResponse;
            };
        };
        /** Delete the given group. */
        '/groups/{groupUuid}': {
            request: {
                urlParams: {
                    /**
                     * Uuid of the group which should be deleted.
                     * @example "0f02358b9fa548d582358b9fa5d8d5c6"
                     */
                    groupUuid: string;
                };
                queryParams?: {};
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
                     * @example "a7233ba6df804deca33ba6df806dec2a"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the role.
                     * @example "eff7860e746a4c7ab7860e746aac7ae1"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                     * @example "a85ef6865b594dcc9ef6865b594dcc59"
                     */
                    groupUuid: string;
                    /**
                     * Uuid of the user which should be removed from the group.
                     * @example "d8b25d6a7c7c4490b25d6a7c7ca490c1"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                     * @example "20893dcd3d644489893dcd3d6434891d"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "aa2d2421ce06487cad2421ce06087c8a"
                     */
                    projectUuid: string;
                };
                queryParams?: {};
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
                     * @example "4cfdd318868f4354bdd318868f435431"
                     */
                    roleUuid: string;
                };
                queryParams?: {};
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
                     * @example "f41898e932414d079898e932413d07a0"
                     */
                    schemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "43673ba298f34398a73ba298f303983b"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                     * @example "2f6cfd4584cf4890acfd4584cf38903a"
                     */
                    userUuid: string;
                };
                queryParams?: {};
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
                     * @example "3a2b70b5811f4d94ab70b5811f2d9478"
                     */
                    microschemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "d46763a2cb5a4fb7a763a2cb5a1fb7ff"
                     */
                    nodeUuid: string;
                };
                queryParams?: {
                    /**
                     * Specifiy whether deletion should also be applied recursively (default: false)
                     * @example true
                     */
                    recursive?: boolean;
                };
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
                     * @example "8fa345a98b35476aa345a98b35b76a84"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Language variation of the node has been deleted. */
                204: undefined;
                404: GenericMessageResponse;
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
                     * @example "4b97bb21b4594d3697bb21b4593d361c"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
                body?: undefined;
            };
            responseType: undefined;
            responseTypes: {
                /** Node language was taken offline. */
                204: undefined;
                404: GenericMessageResponse;
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
                     * @example "37421ba204434d18821ba20443cd18db"
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
                     * @example "084c1daa79364be08c1daa7936bbe0d5"
                     */
                    tagUuid: string;
                    /**
                     * Uuid of the node
                     * @example "6ea7175dbd24418aa7175dbd24818acb"
                     */
                    nodeUuid: string;
                };
                queryParams?: {};
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
         * remove all schema versions of the given schema from all branches of the project.
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
                     * @example "ba1901cc79ec42249901cc79ec022430"
                     */
                    schemaUuid: string;
                };
                queryParams?: {};
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
                     * @example "fb206e4224aa4fcea06e4224aabfce1b"
                     */
                    tagFamilyUuid: string;
                };
                queryParams?: {};
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
                     * @example "0dbd803118c84c69bd803118c8ec6981"
                     */
                    tagFamilyUuid: string;
                    /**
                     * Uuid of the tag.
                     * @example "0219964486e6401599964486e60015c7"
                     */
                    tagUuid: string;
                };
                queryParams?: {};
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
    /** Crop area. */
    readonly cropRect?: ImageRectFromServer;
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

export interface BranchCreateRequest {
    /**
     * The hostname of the branch which will be used to generate links across multiple
     * projects.
     */
    readonly hostname?: string;
    /** Name of the branch. */
    readonly name: string;
    /**
     * SSL flag of the branch which will be used to generate links across multiple
     * projects.
     */
    readonly ssl?: boolean;
}

/**
 * Returned for:
 *   - `GET /{project}/branches/{branchUuid}/microschemas`
 *   - `POST /{project}/branches/{branchUuid}/microschemas`
 */
export interface BranchInfoMicroschemaListFromServer {
    /** List of microschema references. */
    readonly microschemas?: BranchMicroschemaInfoFromServer[];
}

/**
 * Returned for:
 *   - `GET /{project}/branches/{branchUuid}/schemas`
 *   - `POST /{project}/branches/{branchUuid}/schemas`
 */
export interface BranchInfoSchemaListFromServer {
    /** List of schema references. */
    readonly schemas?: BranchSchemaInfoFromServer[];
}

/**
 * Returned for `GET /{project}/branches`
 */
export interface BranchListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: BranchResponse[];
}

export interface BranchMicroschemaInfoFromServer {
    /** Uuid of the migration job. */
    readonly jobUuid?: string;
    /**
     * Status of the migration which was triggered when the schema/microschema was added
     * to the branch.
     */
    readonly migrationStatus?: string;
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
    /** The version of the microschema. */
    readonly version: string;
}

/**
 * Returned for:
 *   - `GET /{project}/branches/{branchUuid}`
 *   - `POST /{project}/branches`
 *   - `POST /{project}/branches/{branchUuid}`
 */
export interface BranchResponse {
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /**
     * The hostname of the branch which will be used to generate links across multiple
     * projects.
     */
    readonly hostname?: string;
    /**
     * Flag which indicates whether any active node migration for this branch is still
     * running or whether all nodes have been migrated to this branch.
     */
    readonly migrated: boolean;
    /** Name of the branch. */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /**
     * SSL flag of the branch which will be used to generate links across multiple
     * projects.
     */
    readonly ssl?: boolean;
    /** Uuid of the element */
    readonly uuid: string;
}

export interface BranchSchemaInfoFromServer {
    /** Uuid of the migration job. */
    readonly jobUuid?: string;
    /**
     * Status of the migration which was triggered when the schema/microschema was added
     * to the branch.
     */
    readonly migrationStatus?: string;
    /** Name of the referenced element */
    readonly name?: string;
    /** Uuid of the referenced element */
    readonly uuid: string;
    /** The version of the microschema. */
    readonly version: string;
}

export interface BranchUpdateRequest {
    /**
     * The hostname of the branch which will be used to generate links across multiple
     * projects.
     */
    readonly hostname?: string;
    /** Name of the branch. */
    readonly name: string;
    /**
     * SSL flag of the branch which will be used to generate links across multiple
     * projects.
     */
    readonly ssl?: boolean;
}

export interface ClusterInstanceInfoFromServer {
    readonly address?: string;
    readonly name?: string;
    readonly startDate?: string;
    readonly status?: string;
}

/**
 * Returned for `GET /admin/cluster/status`
 */
export interface ClusterStatusResponse {
    readonly instances?: ClusterInstanceInfoFromServer[];
}

/**
 * Returned for:
 *   - `GET /admin/consistency/check`
 *   - `POST /admin/consistency/repair`
 */
export interface ConsistencyCheckResponse {
    /** List of found inconsistencies. */
    readonly inconsistencies: InconsistencyInfoFromServer[];
    /** Result of the consistency check. */
    readonly result: string;
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
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** Label of the field. */
    readonly label?: string;
    /** Name of the field. */
    readonly name: string;
    readonly required?: boolean;
    /** Omit indexing */
    readonly noIndex?: boolean;
    /** Type of the field. */
    readonly type: string;
    /** Type of the field. */
    readonly listType?: ListTypeFieldType;

    readonly allow?: string[];
}

/**
 * Returned for:
 *   - `GET /auth/logout`
 *   - `POST /admin/graphdb/backup`
 *   - `POST /admin/graphdb/restore`
 *   - `POST /admin/processJobs`
 *   - `POST /microschemas/{microschemaUuid}`
 *   - `POST /microschemas/{microschemaUuid}/changes`
 *   - `POST /roles/{roleUuid}/permissions/{path}`
 *   - `POST /schemas/{schemaUuid}/changes`
 *   - `POST /search/clear`
 *   - `POST /search/sync`
 *   - `POST /{project}/branches/{branchUuid}/migrateMicroschemas`
 *   - `POST /{project}/branches/{branchUuid}/migrateSchemas`
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
    /** translation identifiers */
    readonly i18nParameters?: string[];
}

export interface GraphQLRequest {
    /** GraphQL operation name. */
    readonly operationName?: string;
    /** The actual GraphQL query. */
    readonly query: string;
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly variables?: any;
}

/**
 * Returned for `POST /{project}/graphql`
 */
export interface GraphQLResponse {
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly data?: any;
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

/** Crop area. */
export interface ImageRectFromServer {
    readonly height?: Integer;
    readonly startX?: Integer;
    readonly startY?: Integer;
    readonly width?: Integer;
}

export interface InconsistencyInfoFromServer {
    /** Description of the inconsistency. */
    readonly description: string;
    /** Uuid of the element which is related to the inconsistency. */
    readonly elementUuid: string;
    /**
     * Repair action which will attept to fix the inconsistency. The action will only be
     * invoked when using invoking the rapair endpoint.
     */
    readonly repairAction: string;
    /**
     * Status of the inconsistency. This will indicate whether the inconsistency could
     * be resolved via the repair action.
     */
    readonly repaired: boolean;
    /** Level of severity of the inconsistency. */
    readonly severity: string;
}

/**
 * Returned for `GET /admin/jobs`
 */
export interface JobListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: JobResponse[];
}

/**
 * Returned for `GET /admin/jobs/{jobUuid}`
 */
export interface JobResponse {
    /**
     * The completion count of the job. This indicates how many items the job has
     * processed.
     */
    readonly completionCount: Integer;
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** The detailed error information of the job. */
    readonly errorDetail?: string;
    /** The error message of the job. */
    readonly errorMessage?: string;
    /** Name of the Gentics Mesh instance on which the job was executed. */
    readonly nodeName?: string;
    /** Properties of the job. */
    readonly properties: { [key: string]: string };
    /** The start date of the job. */
    readonly startDate: string;
    /** Migration status. */
    readonly status: string;
    /** The stop date of the job. */
    readonly stopDate: string;
    /** The type of the job. */
    readonly type: string;
    /** Uuid of the element */
    readonly uuid: string;
}

/**
 * Additional search index configuration. This can be used to setup custom analyzers
 * and filters.
 */
export interface JsonObjectFromServer {
    readonly empty?: boolean;
    readonly map?: { [key: string]: any };
}

export interface LoginRequest {
    /** Password of the user which should be logged in. */
    readonly password: string;
    /** Username of the user which should be logged in. */
    readonly username: string;
    /** New password that will be set after successful login. */
    readonly newPassword?: string;
}

/**
 * Returned for `GET /`
 */
export interface MeshServerInfoModelFromServer {
    /** Database structure revision hash. */
    readonly databaseRevision?: string;
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
    /** Used Vert.x version. */
    readonly vertxVersion?: string;
}

/**
 * Returned for `GET /admin/status`
 */
export interface MeshStatusResponse {
    /** The current Gentics Mesh server status. */
    readonly status: string;
}

export interface MicroschemaCreateRequest {
    /** Description of the microschema */
    readonly description?: string;
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name: string;
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
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** List of microschema fields */
    readonly fields: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the microschema */
    readonly version: string;
    /** Exclude micronode entities from indexing */
    readonly noIndex?: boolean;
}

export interface MicroschemaUpdateRequest {
    /** Description of the microschema */
    readonly description?: string;
    /** Exclude the microschema instances from indexing */
    readonly noIndex?: boolean;
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** List of microschema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the microschema */
    readonly name?: string;
    /** Version of the microschema */
    readonly version?: string;
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
    readonly parentNode: { uuid: string };
    /**
     * Reference to the schema of the root node. Creating a project will also
     * automatically create the base node of the project and link the schema to the
     * initial branch  of the project.
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
     * initial branch  of the project.
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
    /** Map of languages for which content is available and their publish status. */
    readonly availableLanguages: { [key: string]: PublishStatusModelFromServer };
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
     * Display field name of the node. May not be retured if the node schema has no
     * display field.
     */
    readonly displayField?: string;
    /**
     * Display field value of the node. May not be retured if the node schema has no
     * display field.
     */
    readonly displayName?: string;
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
     * initial branch  of the project.
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
    create: boolean;
    /** Flag which indicates whether the delete permission is granted. */
    delete: boolean;
    /** Flag which indicates whether the publish permission is granted. */
    publish: boolean;
    /** Flag which indicates whether the read permission is granted. */
    read: boolean;
    /** Flag which indicates whether the read published permission is granted. */
    readPublished: boolean;
    /** Flag which indicates whether the update permission is granted. */
    update: boolean;
}

export interface PluginDeploymentRequest {
    /**
     * Deployment name of the plugin. This can either be a filesystem or maven
     * deployment.
     */
    readonly name: string;
}

/**
 * Returned for `GET /admin/plugins`
 */
export interface PluginListResponse {
    /** Paging information of the list result. */
    readonly _metainfo: PagingMetaInfoFromServer;
    /** Array which contains the found elements. */
    readonly data: PluginResponse[];
}

/** Manifest of the plugin */
export interface PluginManifestFromServer {
    /**
     * API name of the plugin. This will be used to construct the REST API path to the
     * plugin.
     */
    readonly apiName: string;
    /** Author of the plugin. */
    readonly author: string;
    /** Description of the plugin. */
    readonly description: string;
    /** Inception date of the plugin. */
    readonly inception: string;
    /** License of the plugin. */
    readonly license: string;
    /** Human readable name of the plugin. */
    readonly name: string;
    /** Version of the plugin. */
    readonly version: string;
}

/**
 * Returned for:
 *   - `GET /admin/plugins/{uuid}`
 *   - `POST /admin/plugins`
 *   - `DELETE /admin/plugins/{uuid}`
 */
export interface PluginResponse {
    /** Manifest of the plugin */
    readonly manifest: PluginManifestFromServer;
    /** Name of the plugin. */
    readonly name: string;
    /** Deployment UUUID of the plugin. Note that each deployment will get a new UUID. */
    readonly uuid: string;
}

export interface ProjectCreateRequest {
    /**
     * The hostname of the project can be used to generate links across multiple
     * projects. The hostname will be stored along the initial branch of the project.
     */
    readonly hostname?: string;
    /** Name of the project */
    readonly name: string;
    /**
     * Reference to the schema of the root node. Creating a project will also
     * automatically create the base node of the project and link the schema to the
     * initial branch  of the project.
     */
    readonly schema: SchemaReferenceFromServer;
    /**
     * SSL flag of the project which will be used to generate links across multiple
     * projects. The flag will be stored along the intial branch of the project.
     */
    readonly ssl?: boolean;
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
    readonly published: boolean;
    /** User reference of the creator of the element. */
    readonly publisher?: UserReferenceFromServer;
    /** Version number. */
    readonly version: string;
}

/**
 * Returned for:
 *   - `GET /{project}/nodes/{nodeUuid}/published`
 *   - `POST /{project}/nodes/{nodeUuid}/published`
 */
export interface PublishStatusResponse {
    /** Map of publish status entries per language */
    readonly availableLanguages: { [key: string]: PublishStatusModelFromServer };
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
    readonly permissions: Partial<PermissionInfoFromServer>;
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

export interface S3BinaryUrlGenerationResponse {
    /** Optional migation script */
    presignedUrl: string;
    /** Type of operation for this change */
    httpRequestMethod: string;
    signedHeaders: HttpHeaders | { [header: string]: string | string[] };
    version: string;
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
     * Flag which indicates whether version history should be squashed or retained.
     * See Mesh docs: https://getmesh.io/docs/features/#auto-purge
     */
    readonly autoPurge?: boolean;
    /**
     * Flag which indicates whether the nodes of this version should be excluded from the indexing.
     */
    readonly noIndex?: boolean;
    /**
     * Flag which indicates whether nodes which use this schema store additional child
     * nodes.
     */
    readonly container?: boolean;
    /** Description of the schema */
    readonly description?: string;
    /** Name of the display field. */
    readonly displayField?: string;
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** List of schema fields */
    readonly fields?: FieldSchemaFromServer[];
    /** Name of the schema */
    readonly name: string;
    /**
     * Name of the segment field. This field is used to construct the webroot path to
     * the node.
     */
    readonly segmentField?: string;
    /**
     * Names of the fields which provide a compete url to the node. This property can be
     * used to define custom urls for certain nodes. The webroot API will try to locate
     * the node via it's segment field and via the specified url fields.
     */
    readonly urlFields?: string[];
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
 * initial branch  of the project.
 */
export interface SchemaReferenceFromServer {
    readonly name: string;
    readonly uuid: string;
    readonly version: string;
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
     * Flag which indicates whether version history should be squashed or retained.
     * See Mesh docs: https://getmesh.io/docs/features/#auto-purge
     */
    readonly autoPurge: boolean;
    /**
     * Flag which indicates whether the nodes of this version should be excluded from the indexing.
     */
    readonly noIndex?: boolean;
    /**
     * Flag which indicates whether nodes which use this schema store additional child
     * nodes.
     */
    readonly container: boolean;
    /** ISO8601 formatted created date string. */
    readonly created: string;
    /** User reference of the creator of the element. */
    readonly creator: UserReferenceFromServer;
    /** Description of the schema. */
    readonly description?: string;
    /** Name of the display field. */
    readonly displayField: string;
    /** ISO8601 formatted edited date string. */
    readonly edited: string;
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** List of schema fields */
    readonly fields: FieldSchemaFromServer[];
    /** Name of the schema. */
    readonly name: string;
    readonly permissions: PermissionInfoFromServer;
    readonly rolePerms: PermissionInfoFromServer;
    /**
     * Name of the segment field. This field is used to construct the webroot path to
     * the node.
     */
    readonly segmentField?: string;
    /**
     * Names of the fields which provide a compete url to the node. This property can be
     * used to define custom urls for certain nodes. The webroot API will try to locate
     * the node via it's segment field and via the specified url fields.
     */
    readonly urlFields?: string[];
    /** Uuid of the element */
    readonly uuid: string;
    /** Version of the schema. */
    readonly version: string;
}

export interface SchemaUpdateRequest {
    /**
     * Flag which indicates whether version history should be squashed or retained.
     * See Mesh docs: https://getmesh.io/docs/features/#auto-purge
     */
    readonly autoPurge: boolean;
    /**
     * Flag which indicates whether nodes which use this schema store additional child
     * nodes.
     */
    readonly container?: boolean;
    /**
     * Flag which indicates whether nodes which use this schema should be excluded from the indexing.
     */
    readonly noIndex?: boolean;
    /** New description of the schema. */
    readonly description?: string;
    /** Name of the display field. */
    readonly displayField?: string;
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    /** List of schema fields */
    readonly fields: FieldSchemaFromServer[];
    /** Name of the schema. */
    readonly name: string;
    /**
     * Name of the segment field. This field is used to construct the webroot path to
     * the node.
     */
    readonly segmentField?: string;
    /**
     * Names of the fields which provide a compete url to the node. This property can be
     * used to define custom urls for certain nodes. The webroot API will try to locate
     * the node via it's segment field and via the specified url fields.
     */
    readonly urlFields?: string[];
    /** Version of the schema. */
    readonly version?: string;
}

/**
 * Returned for:
 *   - `POST /utilities/validateMicroschema`
 *   - `POST /utilities/validateSchema`
 */
export interface SchemaValidationResponse {
    /**
     * Additional search index configuration. This can be used to setup custom analyzers
     * and filters.
     */
    readonly elasticsearch?: JsonObjectFromServer;
    readonly message?: GenericMessageResponse;
    /** Status of the validation. */
    readonly status: string;
}

/**
 * Returned for `GET /search/status`
 */
export interface SearchStatusResponse {
    /**
     * Flag which indicates whether Elasticsearch is available and search queries can be
     * executed.
     */
    readonly available: boolean;
    /** Flag which indicates whether a index synchronization is currently running. */
    readonly indexSyncRunning?: boolean;
    /** Map which contains various metric values. */
    readonly metrics?: { [key: string]: any };
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
    rolePerms: PermissionInfoFromServer;
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
    rolePerms: PermissionInfoFromServer;
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
    /** Email address of the user. */
    readonly emailAddress?: string;
    /** Firstname of the user. */
    readonly firstname?: string;
    /**
     * Optional group id for the user. If provided the user will automatically be
     * assigned to the identified group.
     */
    readonly groupUuid?: string;
    /** Lastname of the user. */
    readonly lastname?: string;
    /**
     * New node reference of the user. This can also explicitly set to null in order to
     * remove the assigned node from the user
     */
    readonly nodeReference?: ExpandableNodeFromServer;
    /** Password of the new user. */
    readonly password: string;
    /** Username of the user. */
    readonly username: string;
    /** When true, the user needs to change their password on the next login. */
    readonly forcedPasswordChange?: boolean;
    /** Grant the user admin privileges */
    readonly admin?: boolean;
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
    /** User reference of the creator of the element. */
    readonly editor: UserReferenceFromServer;
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
    readonly rolePerms: PermissionInfoFromServer;
    /** Username of the user. */
    readonly username: string;
    /** Uuid of the element */
    readonly uuid: string;
    /** When true, the user needs to change their password on the next login. */
    readonly forcedPasswordChange: boolean;
    /** Grant the user admin privileges */
    readonly admin?: boolean;
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
    /** When true, the user needs to change their password on the next login. */
    readonly forcedPasswordChange?: boolean;
    /** Grant the user admin privileges */
    readonly admin?: boolean;
}
