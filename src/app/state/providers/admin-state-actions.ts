import { Injectable } from '@angular/core';
import { Immutable, StateActionBranch, CloneDepth } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';
import { AdminState } from '../models/admin-state.model';
import { ChangePasswordModalComponent } from '../../core/components/change-password-modal/change-password-modal.component';

@Injectable()
@Immutable()
export class AdminStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private admin: AdminState;

    constructor() {
        super({
            uses: ['admin'],
            initialState: {
                admin: {
                    changingPassword: false
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
}
