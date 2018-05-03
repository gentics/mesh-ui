import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { GroupResponse, UserListResponse, UserResponse } from '../../common/models/server-models';
import { EntityStateType, mergeEntityState } from './entity-state-actions';
import { AdminUsersState } from '../models/admin-users-state.model';
import { User } from '../../common/models/user.model';
import { MeshNode } from '../../common/models/node.model';
import { Schema } from '../../common/models/schema.model';
import { Microschema } from '../../common/models/microschema.model';

@Injectable()
@Immutable()
export class AdminUsersStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private adminUsers: AdminUsersState;
    @CloneDepth(0) private entities: EntityState;

    constructor() {
        super({
            uses: ['adminUsers', 'entities'],
            initialState: {
                adminUsers: {
                    loadCount: 0,
                    userList: [],
                    userDetail: null,
                    pagination: {
                        currentPage: 1,
                        itemsPerPage: 25,
                        totalItems: null
                    },
                    filterTerm: '',
                    filterGroups: []
                }
            }
        });
    }

    fetchUsersStart() {
        this.adminUsers.loadCount++;
    }

    fetchUsersSuccess(response: UserListResponse) {
        const users = response.data;
        const metaInfo = response._metainfo;
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            user: users as User[]
        });
        this.adminUsers.userList = users.map(user => user.uuid);
        this.adminUsers.pagination = {
            currentPage: metaInfo.currentPage,
            itemsPerPage: metaInfo.perPage,
            totalItems: metaInfo.totalCount
        };
    }

    fetchUsersError() {
        this.adminUsers.loadCount--;
    }

    fetchAllGroupsStart(): void {
        this.adminUsers.loadCount ++;
    }

    fetchAllGroupsSuccess(groups: GroupResponse[]): void {
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            group: groups
        });
    }

    fetchAllGroupsError(): void {
        this.adminUsers.loadCount--;
    }

    /**
     * To be used only when client-side paging strategy is used.
     */
    setUserListPagination(currentPage: number, itemsPerPage: number): void {
        this.adminUsers.pagination = {
            currentPage,
            itemsPerPage,
            totalItems: null
        };
    }

    setFilterTerm(term: string): void {
        this.adminUsers.filterTerm = term;
    }

    setFilterGroups(groups: string[]): void {
        this.adminUsers.filterGroups = groups;
    }

    newUser() {
        this.adminUsers.userDetail = null;
    }

    openUserStart() {
        this.adminUsers.loadCount++;
        this.adminUsers.userDetail = null;
    }

    openUserSuccess(user: UserResponse, userNode?: MeshNode, userNodeSchema?: Schema, microschemas?: Microschema[]) {
        this.adminUsers.loadCount--;
        this.adminUsers.userDetail = user.uuid;
        const changes: {[K in keyof EntityState]?: Array<EntityStateType[K]>; } = {
            user: [user as User],
        };
        if (userNode) {
            changes.node = [userNode];
        }
        if (userNodeSchema) {
            changes.schema = [userNodeSchema];
        }
        if (microschemas) {
            changes.microschema = microschemas;
        }

        this.entities = mergeEntityState(this.entities, changes);
    }

    openUserError() {
        this.adminUsers.loadCount--;
    }

    createUserStart(): void {
        this.adminUsers.loadCount++;
    }

    createUserSuccess(user: UserResponse) {
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, { user: [user as User] });
        this.adminUsers.userList = [...this.adminUsers.userList, user.uuid];
    }

    createUserError(): void {
        this.adminUsers.loadCount--;
    }

    updateUserStart(): void {
        this.adminUsers.loadCount++;
    }

    updateUserSuccess(user: UserResponse) {
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, { user: [user as User] });
    }

    updateUserError(): void {
        this.adminUsers.loadCount--;
    }

    deleteUserStart(): void {
        this.adminUsers.loadCount++;
    }

    deleteUserSuccess(userUuid: string) {
        this.adminUsers.loadCount--;
        this.adminUsers.userList = this.adminUsers.userList.filter(uuid => uuid !== userUuid);
    }

    deleteUserError(): void {
        this.adminUsers.loadCount--;
    }

    addUserToGroupStart(): void {
        this.adminUsers.loadCount++;
    }

    addUserToGroupSuccess(user: UserResponse) {
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, { user: [user as User] });
    }

    addUserToGroupError(): void {
        this.adminUsers.loadCount--;
    }

    removeUserFromGroupStart(): void {
        this.adminUsers.loadCount++;
    }

    removeUserFromGroupSuccess(user: UserResponse) {
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, { user: [user as User] });
    }

    removeUserFromGroupError(): void {
        this.adminUsers.loadCount--;
    }
}
