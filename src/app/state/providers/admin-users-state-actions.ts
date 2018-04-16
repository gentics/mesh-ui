import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { UserListResponse, UserResponse } from '../../common/models/server-models';
import { mergeEntityState } from './entity-state-actions';
import { AdminUsersState } from '../models/admin-users-state.model';

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
                        totalItems: 0
                    }
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
            user: users
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

    createUserStart(): void {
        this.adminUsers.loadCount++;
    }

    createUserSuccess(user: UserResponse) {
        this.adminUsers.loadCount--;
        this.entities = mergeEntityState(this.entities, { user: [user] });
        this.adminUsers.userList = [...this.adminUsers.userList, user.uuid];
    }

    createUserError(): void {
        this.adminUsers.loadCount--;
    }

    deleteUserStart(): void {
        this.adminUsers.loadCount++;
    }

    deleteUserSuccess(userUuid: string) {
        this.adminUsers.userList = this.adminUsers.userList.filter(uuid => uuid !== userUuid);
    }

    deleteUserError(): void {
        this.adminUsers.loadCount--;
    }
}
