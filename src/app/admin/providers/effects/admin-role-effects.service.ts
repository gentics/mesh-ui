import { from as observableFrom, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { head, values } from 'ramda';
import * as RoleQuery from 'raw-loader!./admin-role-query.gql';
import * as RolesQuery from 'raw-loader!./admin-roles-query.gql';
import { filter, map, mergeMap, take, tap, toArray } from 'rxjs/operators';

import { RoleCreateRequest, RoleUpdateRequest } from '../../../common/models/server-models';
import { extractGraphQlResponse } from '../../../common/util/util';
import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

import { AdminProjectEffectsService } from './admin-project-effects.service';

export interface AdminRoleListResponse {
    roles: {
        currentPage: number;
        totalCount: number;
        elements: AdminRoleResponse[];
    };
}

export interface AdminRoleResponse {
    uuid: string;
    name: string;
}

@Injectable()
export class AdminRoleEffectsService {
    constructor(
        private api: ApiService,
        private state: ApplicationStateService,
        private project: AdminProjectEffectsService,
        private notification: I18nNotification
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
                return (project && project.name) || '';
            })
            .pipe(
                filter<string>(Boolean),
                take(1)
            );
    }

    /**
     * Loads roles. The number of elements per page (roles and groups) is limited to 10.
     * @param page The page to load.
     * @param query A query that the user entered.
     */
    loadRoles(page: number, query?: string): Observable<AdminRoleListResponse> {
        // TODO Make filterable by role
        return this.getAnyProjectName().pipe(
            mergeMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: RolesQuery,
                        variables: { page, query }
                    }
                )
            ),
            map(extractGraphQlResponse)
        );
    }

    loadRole(uuid: string): Observable<AdminRoleResponse> {
        return this.getAnyProjectName().pipe(
            mergeMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: RoleQuery,
                        variables: { uuid }
                    }
                )
            ),
            map(extractGraphQlResponse),
            map(response => response.role),
            tap(role => this.state.actions.adminRoles.loadRoleSuccess(role))
        );
    }

    async loadRoleUuidByName(name: string): Promise<string> {
        const project = await this.getAnyProjectName().toPromise();
        return this.api
            .graphQL(
                { project },
                {
                    query: `
            query roleByName($name: String) {
                role(name: $name) {
                  uuid
                }
              }
            `,
                    variables: { name }
                }
            )
            .pipe(
                map(extractGraphQlResponse),
                map(response => response.role.uuid)
            )
            .toPromise();
    }

    loadAnonymousRoleUuid(): Promise<string> {
        return this.loadRoleUuidByName('anonymous');
    }

    deleteRoles(roles: AdminRoleResponse[]) {
        const notificationKey = roles.length === 1 ? 'admin.role_deleted' : 'admin.roles_deleted';

        return observableFrom(roles)
            .pipe(
                mergeMap(role =>
                    this.api.admin.deleteRole({
                        roleUuid: role.uuid
                    })
                )
            )
            .pipe(this.notification.rxSuccess(notificationKey))
            .pipe(toArray());
    }

    createRole(createRequest: RoleCreateRequest) {
        return this.api.admin
            .createRole(undefined, createRequest)
            .pipe(this.notification.rxSuccess('admin.role_created'));
    }

    updateRole(roleUuid: string, updateRequest: RoleUpdateRequest) {
        return this.api.admin
            .updateRole({ roleUuid }, updateRequest)
            .pipe(this.notification.rxSuccess('admin.role_updated'));
    }
}
