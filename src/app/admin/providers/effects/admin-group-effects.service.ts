import { from as observableFrom, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { head, values } from 'ramda';
import * as GroupQuery from 'raw-loader!./admin-group-query.gql';
import * as GroupsQuery from 'raw-loader!./admin-groups-query.gql';
import { filter, map, mergeMap, take, tap, toArray } from 'rxjs/operators';

import { GroupCreateRequest, GroupUpdateRequest } from '../../../common/models/server-models';
import { extractGraphQlResponse } from '../../../common/util/util';
import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

import { AdminProjectEffectsService } from './admin-project-effects.service';

export interface AdminGroupListResponse {
    groups: {
        currentPage: number;
        totalCount: number;
        elements: AdminGroupResponse[];
    };
    allRoles: {
        elements: AdminGroupRoleResponse[];
    };
}
export interface AdminGroupOnlyResponse {
    uuid: string;
    name: string;
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
            .pipe(
                filter<string>(Boolean),
                take(1)
            );
    }

    /**
     * Loads groups and their roles. The number of elements per page (groups and roles) is limited to 10.
     * @param page The page to load.
     * @param query A query that the user entered.
     */
    loadGroups(page: number, query?: string): Observable<AdminGroupListResponse> {
        // TODO Make filterable by role
        return this.getAnyProjectName().pipe(
            mergeMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: GroupsQuery,
                        variables: { page, query }
                    }
                )
            ),
            map(extractGraphQlResponse)
        );
    }

    loadGroup(uuid: string): Observable<AdminGroupOnlyResponse> {
        return this.getAnyProjectName().pipe(
            mergeMap(project =>
                this.api.graphQL(
                    { project },
                    {
                        query: GroupQuery,
                        variables: { uuid }
                    }
                )
            ),
            map(extractGraphQlResponse),
            map(response => response.group),
            tap(group => this.state.actions.adminGroups.loadGroupSuccess(group))
        );
    }

    addGroupsToRole(groups: AdminGroupResponse[], role: AdminGroupRoleResponse) {
        return observableFrom(groups).pipe(
            mergeMap(group =>
                this.api.admin.addRoleToGroup({
                    groupUuid: group.uuid,
                    roleUuid: role.uuid
                })
            ),
            toArray()
        );
    }

    removeGroupsFromRole(groups: AdminGroupResponse[], role: AdminGroupRoleResponse) {
        return observableFrom(groups).pipe(
            mergeMap(group =>
                this.api.admin.removeRoleFromGroup({
                    groupUuid: group.uuid,
                    roleUuid: role.uuid
                })
            ),
            toArray()
        );
    }

    deleteGroups(groups: AdminGroupResponse[]) {
        const notificationKey = groups.length === 1 ? 'admin.group_deleted' : 'admin.groups_deleted';

        return observableFrom(groups)
            .pipe(
                mergeMap(group =>
                    this.api.admin.deleteGroup({
                        groupUuid: group.uuid
                    })
                )
            )
            .pipe(this.notification.rxSuccess(notificationKey))
            .pipe(toArray());
    }

    createGroup(createRequest: GroupCreateRequest) {
        return this.api.admin
            .createGroup(undefined, createRequest)
            .pipe(this.notification.rxSuccess('admin.group_created'));
    }

    updateGroup(groupUuid: string, updateRequest: GroupUpdateRequest) {
        return this.api.admin
            .updateGroup({ groupUuid }, updateRequest)
            .pipe(this.notification.rxSuccess('admin.group_updated'));
    }
}
