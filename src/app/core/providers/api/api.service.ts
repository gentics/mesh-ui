import { Injectable } from '@angular/core';
import { GraphQLRequest, GraphQLResponse } from 'src/app/common/models/server-models';
import { extractGraphQlResponse } from 'src/app/common/util/util';

import { AdminApi } from './admin-api.class';
import { ApiBase, RequestLanguage } from './api-base.service';
import { apiPost } from './api-methods';
import { AuthApi } from './auth-api.class';
import { ProjectApi } from './project-api.class';
import { SearchApi } from './search-api.service';
import { UserApi } from './user-api.class';

@Injectable()
export class ApiService {
    public auth: AuthApi;
    public project: ProjectApi;
    public user: UserApi;
    public admin: AdminApi;
    public search: SearchApi;

    graphQL = apiPost('/{project}/graphql');

    constructor(protected apiBase: ApiBase) {
        this.auth = new AuthApi(apiBase);
        this.project = new ProjectApi(apiBase);
        this.user = new UserApi(apiBase);
        this.admin = new AdminApi(apiBase);
        this.search = new SearchApi(apiBase);
    }

    public setLanguageForServerMessages(language: RequestLanguage) {
        this.apiBase.setLanguageForServerMessages(language);
    }

    public formatGraphQLSearchQuery(query: Object): string {
        return JSON.stringify(JSON.stringify(query));
    }

    /**
     * Loads a random existing project.
     * This is necessary to query data by GraphQL.
     * Remove this after https://github.com/gentics/mesh/issues/504 is resolved
     */
    private getAnyProjectName(): Promise<string> {
        return this.apiBase
            .get('/projects', { perPage: 1, fields: 'name' })
            .map(projects => projects.data[0].name)
            .toPromise();
    }

    public async graphQLInAnyProject(request: GraphQLRequest): Promise<any> {
        return this.graphQL({ project: await this.getAnyProjectName() }, request)
            .map(extractGraphQlResponse)
            .toPromise();
    }
}
