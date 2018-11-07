import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AdminGroupOnlyResponse } from '../../admin/providers/effects/admin-group-effects.service';
import { Microschema } from '../../common/models/microschema.model';
import { MeshNode } from '../../common/models/node.model';
import { Schema } from '../../common/models/schema.model';
import { GroupResponse, UserListResponse, UserResponse } from '../../common/models/server-models';
import { User } from '../../common/models/user.model';
import { AdminGroupsState } from '../models/admin-groups-state.model';
import { AdminUsersState } from '../models/admin-users-state.model';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';

import { mergeEntityState, EntityStateType } from './entity-state-actions';

@Injectable()
@Immutable()
export class AdminGroupsStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1)
    private adminGroups: AdminGroupsState;

    constructor() {
        super({
            uses: ['adminGroups'],
            initialState: {
                adminGroups: {
                    groupDetail: null
                }
            }
        });
    }

    loadGroupSuccess(group: AdminGroupOnlyResponse) {
        this.adminGroups.groupDetail = group;
    }
}
