import { Injectable } from '@angular/core';

import { AdminApi } from './admin-api.class';
import { ApiBase, RequestLanguage } from './api-base.service';
import { apiPost } from './api-methods';
import { AuthApi } from './auth-api.class';
import { ProjectApi } from './project-api.class';
import { UserApi } from './user-api.class';

@Injectable()
export class ApiService {
    public auth: AuthApi;
    public project: ProjectApi;
    public user: UserApi;
    public admin: AdminApi;

    graphQL = apiPost('/{project}/graphql');

    constructor(protected apiBase: ApiBase) {
        this.auth = new AuthApi(apiBase);
        this.project = new ProjectApi(apiBase);
        this.user = new UserApi(apiBase);
        this.admin = new AdminApi(apiBase);
    }

    public setLanguageForServerMessages(language: RequestLanguage) {
        this.apiBase.setLanguageForServerMessages(language);
    }

    public formatGraphQLSearchQuery(query: Object): string {
        return JSON.stringify(JSON.stringify(query));
    }
}
