import { Injectable } from '@angular/core';
import { Immutable, StateActionBranch, CloneDepth } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';
import { AdminState } from '../models/admin-state.model';
import { ChangePasswordModalComponent } from '../../core/components/change-password-modal/change-password-modal.component';
import { EntityState } from '../models/entity-state.model';
import { ProjectResponse } from '../../common/models/server-models';
import { uuidHash } from '../../common/util/util';

@Injectable()
@Immutable()
export class AdminStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private admin: AdminState;
    @CloneDepth(2) private entities: EntityState;

    constructor() {
        super({
            uses: ['admin', 'entities'],
            initialState: {
                admin: {
                    changingPassword: false,
                    projectsLoading: false
                }
            }
        });
    }

    changePasswordStart() {
        this.admin.changingPassword = true;
    }

    changePasswordEnd() {
        this.admin.changingPassword = false;
    }

    loadProjectsStart() {
        this.admin.projectsLoading = true;
    }

    loadProjectsEnd(projects: ProjectResponse[]) {
        this.entities.project = uuidHash(projects);
        this.admin.projectsLoading = false;
    }
}
