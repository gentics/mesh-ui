import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AdminRoleResponse } from '../../admin/providers/effects/admin-role-effects.service';
import { Microschema } from '../../common/models/microschema.model';
import { MeshNode } from '../../common/models/node.model';
import { Schema } from '../../common/models/schema.model';
import { RoleResponse, UserListResponse, UserResponse } from '../../common/models/server-models';
import { User } from '../../common/models/user.model';
import { AdminRolesState } from '../models/admin-roles-state.model';
import { AdminUsersState } from '../models/admin-users-state.model';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';

import { mergeEntityState, EntityStateType } from './entity-state-actions';

@Injectable()
@Immutable()
export class AdminRolesStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1)
    private adminRoles: AdminRolesState;

    constructor() {
        super({
            uses: ['adminRoles'],
            initialState: {
                adminRoles: {
                    roleDetail: null
                }
            }
        });
    }

    loadRoleSuccess(role: AdminRoleResponse) {
        this.adminRoles.roleDetail = role;
    }
}
