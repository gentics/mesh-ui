import { ApiBase } from './api-base.service';
import { apiDelete, apiGet, apiPost, apiPostWithoutBody } from './api-methods';
import { ApiEndpoints, NodeResponse, NodeUpdateRequest, GenericMessageResponse } from '../../../common/models/server-models';

export class SchemaApi {
    constructor(private apiBase: ApiBase) { }

    /** Load all schemas. */
    getSchemas = apiGet('/schemas');
}
