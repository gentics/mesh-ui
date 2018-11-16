import { Injectable } from '@angular/core';
import { head, values } from 'ramda';
import * as RoleQuery from 'raw-loader!./admin-role-query.gql';
import * as RolesQuery from 'raw-loader!./admin-roles-query.gql';
import { Observable } from 'rxjs/Observable';

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
    allRoles: {
        elements: AdminRolePermissionResponse[];
    };
}
export interface AdminRoleOnlyResponse {
    uuid: string;
    name: string;
}

export interface AdminRoleResponse {
    uuid: string;
    name: string;
    groups: {
        elements: AdminRolePermissionResponse[];
    };
}

export interface AdminRolePermissionResponse {
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
                return project && project.name;
            })
            .filter(Boolean)
            .take(1);
    }

    /**
     * Loads roles and their groups. The number of elements per page (roles and groups) is limited to 10.
     * @param page The page to load.
     * @param query A query that the user entered.
     */
    loadRoles(page: number, query?: string): Observable<AdminRoleListResponse> {
        // TODO Make filterable by role
        return this.getAnyProjectName()
            .flatMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: RolesQuery,
                        variables: { page, query }
                    }
                )
            )
            .map(extractGraphQlResponse);
    }

    loadRole(uuid: string): Observable<AdminRoleOnlyResponse> {
        return this.getAnyProjectName()
            .flatMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: RoleQuery,
                        variables: { uuid }
                    }
                )
            )
            .map(extractGraphQlResponse)
            .map(response => response.role)
            .do(role => this.state.actions.adminRoles.loadRoleSuccess(role));
    }

    addPermissionsToRole(permissions: AdminRolePermissionResponse[], role: AdminRolePermissionResponse) {
        return Observable.from(permissions)
            .flatMap(permission =>
                this.api.admin.addPermissionToRole({
                    roleUuid: role.uuid,
                    permissionUuid: permission.uuid
                })
            )
            .toArray();
    }

    removePermissionsFromRole(permissions: AdminRolePermissionResponse[], role: AdminRolePermissionResponse) {
        return Observable.from(permissions)
            .flatMap(permission =>
                this.api.admin.removePermissionFromRole({
                    roleUuid: role.uuid,
                    permissionUuid: permission.uuid
                })
            )
            .toArray();
    }

    deleteRoles(roles: AdminRoleResponse[]) {
        const notificationKey = roles.length === 1 ? 'admin.role_deleted' : 'admin.roles_deleted';

        return Observable.from(roles)
            .flatMap(role =>
                this.api.admin.deleteRole({
                    roleUuid: role.uuid
                })
            )
            .pipe(this.notification.rxSuccess(notificationKey))
            .toArray();
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
