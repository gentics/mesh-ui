import { ApiBase } from './api-base.service';
import { apiDelete, apiGet, apiPost, apiPostWithoutBody } from './api-methods';


export class AdminApi {
    constructor(private apiBase: ApiBase) { }

    /** Add a role to an existing group. */
    addRoleToGroup = apiPostWithoutBody('/groups/{groupUuid}/roles/{roleUuid}');

    /** Add a user to an existing group. */
    addUserToGroup = apiPostWithoutBody('/groups/{groupUuid}/users/{userUuid}');

    /**
     * Apply the provided changes on the latest version of the microschema and migrate all
     * nodes which are based on the microschema. This operation is non-blocking
     * and will continue to run in the background.
     */
    applyMicroschemaChanges = apiPost('/microschemas/{microschemaUuid}/changes');

    /**
     * Apply the provided changes on the latest version of the schema and migrate all nodes
     * which are based on the schema. This operation is non-blocking and will continue to run
     * in the background.
     */
    applySchemaChanges = apiPost('/schemas/{schemaUuid}/changes');

    /** Assign a microschema to a project. */
    assignMicroschemaToProject = apiPost('/{project}/microschemas/{microschemaUuid}');

    /** Assign a schema version to a project. */
    assignSchemaToProject = apiPost('/{project}/schemas/{schemaUuid}');

    /** Create a new group. */
    createGroup = apiPostWithoutBody('/groups');

    /** Create a new microschema. */
    createMicroschema = apiPost('/microschemas');

    /** Create a new project. */
    createProject = apiPost('/projects');

    /** Create a new role. */
    createRole = apiPost('/roles');

    /** Create a new schema. */
    createSchema = apiPost('/schemas');

    /** Create a new user. */
    createUser = apiPost('/users');

    /** Deactivate the user with the given uuid. */
    deactivateUser = apiDelete('/users/{userUuid}');

    /** Delete the group with the given uuid */
    deleteGroup = apiDelete('/groups/{groupUuid}');

    /** Delete the microschema with the given uuid */
    deleteMicroschema = apiDelete('/microschemas/{microschemaUuid}');

    /** Delete a project and all attached nodes. */
    deleteProject = apiDelete('/projects/{projectUuid}');

    /** Delete the role with the given uuid */
    deleteRole = apiDelete('/roles/{roleUuid}');

    /** Delete the schema with the given uuid */
    deleteSchema = apiDelete('/schemas/{schemaUuid}');

    /** Compare the provided microschema with the miroschema which is currently stored. */
    diffMicroschemaChanges = apiPost('/microschemas/{microschemaUuid}/diff');

    /** Compare the provided schema with the schema which is currently stored. */
    diffSchemaChanges = apiPost('/schemas/{schemaUuid}/diff');

    /** Delete the microschema with the given uuid */
    getMicroschema = apiGet('/microschemas/{microschemaUuid}');

    /** Load all microschemas. */
    getMicroschemas = apiGet('/microschemas');

    /** Get the current schema or node migration status. */
    getMigrationStatus = apiGet('/admin/status/migrations');

    /** Get the mesh system status. */
    getSystemStatus = apiGet('/admin/status');

    /** Get the version info of the server software. */
    getVersionInfo = apiGet('/');

    /** Invalidate the issued API token. */
    invalidateUserToken = apiDelete('/users/{userUuid}/token');

    /** Remove the given role from the group. */
    removeRoleFromGroup = apiDelete('/groups/{groupUuid}/roles/{roleUuid}');

    /** Remove a microschema from the given project. */
    removeMicroschemaFromProject = apiDelete('/{project}/microschemas/{microschemaUuid}');

    /** Set the permissions between role and the targeted element. */
    setRolePermissions = apiPost('/roles/{roleUuid}/permissions/{path}');

    /**
     * Invoke a graph database backup and dump the data to the configured backup
     * location. Note that this operation will block all current operation.
     */
    startDatabaseBackup = apiPostWithoutBody('/admin/graphdb/backup');

    /**
     * Invoke a graph database restore. The latest dump from the backup directory will
     * be inserted. Please note that this operation will block all current operation and
     * effectively destroy all previously stored data.
     */
    startDatabaseRestore = apiPostWithoutBody('/admin/graphdb/restore');

    /** Update the group with the given uuid. */
    updateGroup = apiPost('/groups/{groupUuid}');

    /** Update the microschema with the given uuid. */
    updateMicroschema = apiPost('/microschemas/{microschemaUuid}');

    /** Update the project with the given uuid. */
    updateProject = apiPost('/projects/{projectUuid}');

    /** Update the role with the given uuid. */
    updateRole = apiPost('/roles/{roleUuid}');

    /** Update the schema with the given uuid. */
    updateSchema = apiPost('/schemas/{schemaUuid}');

    /** Update the user with the given uuid. */
    updateUser = apiPost('/users/{userUuid}');
}
