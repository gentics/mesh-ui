import { Injectable } from '@angular/core';
import { head, values } from 'ramda';
import * as GroupQuery from 'raw-loader!./admin-group-query.gql';
import { Observable } from 'rxjs/Observable';

import { extractGraphQlResponse } from '../../../common/util/util';
import { ApiService } from '../../../core/providers/api/api.service';
import { AppState } from '../../../state/models/app-state.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

import { AdminProjectEffectsService } from './admin-project-effects.service';

export interface AdminGroupListResponse {
    groups: {
        currentPage: number;
        pageCount: number;
        elements: AdminGroupResponse[];
    };
    allRoles: {
        elements: AdminGroupRoleResponse[];
    };
}

export interface AdminGroupResponse {
    uuid: string;
    name: string;
    roles: {
        elements: AdminGroupRoleResponse[];
    };
}

export interface AdminGroupRoleResponse {
    uuid: string;
    name: string;
}

@Injectable()
export class AdminGroupEffectsService {
    constructor(
        private api: ApiService,
        private state: ApplicationStateService,
        private project: AdminProjectEffectsService
    ) {}

    /**
     * Loads a random existing project.
     * This is necessary to query data by GraphQL.
     * Remove this after https://github.com/gentics/mesh/issues/504 is resolved
     */
    private getAnyProjectName(): Observable<string> {
        if (Object.keys(this.state.now.entities.project).length === 0) {
            this.project.loadProjects();
        }
        return this.state
            .select(state => {
                const project = head(values(state.entities.project));
                return project && project.name;
            })
            .filter(Boolean)
            .take(1);
    }

    /**
     * Loads groups and their roles. The number of elements per page (groups and roles) is limited to 10.
     * @param page The page to load.
     */
    loadGroups(page: number): Observable<AdminGroupListResponse> {
        // TODO Make filterable by name and role
        return this.getAnyProjectName()
            .flatMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: GroupQuery,
                        variables: { page }
                    }
                )
            )
            .map(extractGraphQlResponse);
    }
}
