import { ApiBase } from './api-base.service';
import { apiGet } from './api-methods';

export class SchemaApi {
    constructor(private apiBase: ApiBase) { }

    /** Load all schemas. */
    getSchemas = apiGet('/schemas');

    /** Load a schema */
    getSchema = apiGet('/schemas/{schemaUuid}');
}
