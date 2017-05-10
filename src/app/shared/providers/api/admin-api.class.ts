import { Observable } from 'rxjs/Observable';

import { ApiBase } from './api-base.service';
import { apiGetMethod, apiDeleteMethod, apiPostMethod, apiPostMethodWithBody } from './api-methods';


export class AdminApi {
    constructor(private apiBase: ApiBase) { }

    /** Add a role to an existing group. */
    addRoleToGroup = apiPostMethod('/groups/{groupUuid}/roles/{roleUuid}');

    /** Add a user to an existing group. */
    addUserToGroup = apiPostMethod('/groups/{groupUuid}/users/{userUuid}');

    /**
     * Apply the provided changes on the latest version of the microschema and migrate all
     * nodes which are based on the microschema. This operation is non-blocking
     * and will continue to run in the background.
     */
    applyMicroschemaChanges = apiPostMethodWithBody('/microschemas/{microschemaUuid}/changes');

    /**
     * Apply the provided changes on the latest version of the schema and migrate all nodes
     * which are based on the schema. This operation is non-blocking and will continue to run
     * in the background.
     */
    applySchemaChanges = apiPostMethodWithBody('/schemas/{schemaUuid}/changes');

    /** Assign a microschema to a project. */
    assignMicroschemaToProject = apiPostMethodWithBody('/{project}/microschemas/{microschemaUuid}');

    /** Assign a schema version to a project. */
    assignSchemaToProject = apiPostMethodWithBody('/{project}/schemas/{schemaUuid}');

    /** Create a new group. */
    createGroup = apiPostMethod('/groups');

    /** Create a new microschema. */
    createMicroschema = apiPostMethodWithBody('/microschemas');

    /** Create a new project. */
    createProject = apiPostMethodWithBody('/projects');

    /** Create a new role. */
    createRole = apiPostMethodWithBody('/roles');

    /** Create a new schema. */
    createSchema = apiPostMethodWithBody('/schemas');

    /** Create a new user. */
    createUser = apiPostMethodWithBody('/users');

    /** Deactivate the user with the given uuid. */
    deactivateUser = apiDeleteMethod('/users/{userUuid}');

    /** Delete the group with the given uuid */
    deleteGroup = apiDeleteMethod('/groups/{groupUuid}');

    /** Delete the microschema with the given uuid */
    deleteMicroschema = apiDeleteMethod('/microschemas/{microschemaUuid}');

    /** Delete a project and all attached nodes. */
    deleteProject = apiDeleteMethod('/projects/{projectUuid}');

    /** Delete the role with the given uuid */
    deleteRole = apiDeleteMethod('/roles/{roleUuid}');

    /** Delete the schema with the given uuid */
    deleteSchema = apiDeleteMethod('/schemas/{schemaUuid}');

    /** Compare the provided microschema with the miroschema which is currently stored. */
    diffMicroschemaChanges = apiPostMethodWithBody('/microschemas/{microschemaUuid}/diff');

    /** Compare the provided schema with the schema which is currently stored. */
    diffSchemaChanges = apiPostMethodWithBody('/schemas/{schemaUuid}/diff');

    /** Get the current schema or node migration status. */
    getMigrationStatus = apiGetMethod('/admin/status/migrations');

    /** Get the mesh system status. */
    getSystemStatus = apiGetMethod('/admin/status');

    /** Get the version info of the server software. */
    getVersionInfo = apiGetMethod('/');

    /** Invalidate the issued API token. */
    invalidateUserToken = apiDeleteMethod('/users/{userUuid}/token');

    /** Remove the given role from the group. */
    removeRoleFromGroup = apiDeleteMethod('/groups/{groupUuid}/roles/{roleUuid}');

    /** Remove a microschema from the given project. */
    removeMicroschemaFromProject = apiDeleteMethod('/{project}/microschemas/{microschemaUuid}');

    /** Set the permissions between role and the targeted element. */
    setRolePermissions = apiPostMethodWithBody('/roles/{roleUuid}/permissions/{pathToElement}');

    /**
     * Invoke a graph database backup and dump the data to the configured backup
     * location. Note that this operation will block all current operation.
     */
    startDatabaseBackup = apiPostMethod('/admin/backup');

    /** Invoke a orientdb graph database export. */
    startDatabaseExport = apiPostMethod('/admin/export');

    /**
     * Invoke a orientdb graph database import. The latest import file from the import
     * directory will be used for this operation.
     */
    startDatabaseImport = apiPostMethod('/admin/import');

    /**
     * Invoke a graph database restore. The latest dump from the backup directory will
     * be inserted. Please note that this operation will block all current operation and
     * effectively destroy all previously stored data.
     */
    startDatabaseRestore = apiPostMethod('/admin/restore');

    /** Update the group with the given uuid. */
    updateGroup = apiPostMethodWithBody('/groups/{groupUuid}');

    /** Update the microschema with the given uuid. */
    updateMicroschema = apiPostMethodWithBody('/microschemas/{microschemaUuid}');

    /** Update the project with the given uuid. */
    updateProject = apiPostMethodWithBody('/projects/{projectUuid}');

    /** Update the role with the given uuid. */
    updateRole = apiPostMethodWithBody('/roles/{roleUuid}');

    /** Update the schema with the given uuid. */
    updateSchema = apiPostMethodWithBody('/schemas/{schemaUuid}');

    /** Update the user with the given uuid. */
    updateUser = apiPostMethodWithBody('/users/{userUuid}');
}
