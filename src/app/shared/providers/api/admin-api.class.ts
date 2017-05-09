import { Observable } from 'rxjs/Observable';

import { ApiBase } from './api-base.service';
import { apiGetMethod, apiDeleteMethod, apiPostMethod } from './api-methods';


export class AdminApi {
    constructor(private apiBase: ApiBase) { }

    /** Get the current schema or node migration status. */
    getMigrationStatus = apiGetMethod('/admin/status/migrations');

    /** Get the mesh system status. */
    getSystemStatus = apiGetMethod('/admin/status');

    /** Get the version info of the server software. */
    getVersionInfo = apiGetMethod('/');

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

    /** Invalidate the issued API token. */
    invalidateUserToken = apiDeleteMethod('/users/{userUuid}/token');

    /** Remove the given role from the group. */
    removeRoleFromGroup = apiDeleteMethod('/groups/{groupUuid}/roles/{roleUuid}');

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
}
