import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';
import { UserResponse } from '../../common/models/server-models';
import { EntityState } from '../models/entity-state.model';
import { mergeEntityState } from './entity-state-actions';
import { User } from '../../common/models/user.model';


@Injectable()
@Immutable()
export class AuthStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private auth: AuthState;
    @CloneDepth(0) private entities: EntityState;

    constructor() {
        super({
            uses: ['auth', 'entities'],
            initialState: {
                auth: {
                    changingPassword: false,
                    loggedIn: false,
                    loggingIn: false,
                    loggingOut: false,
                    currentUser: null
                }
            }
        });
    }

    changePasswordStart() {
        this.auth.changingPassword = true;
    }

    changePasswordSuccess() {
        this.auth.changingPassword = false;
    }

    changePasswordError() {
        this.auth.changingPassword = false;
    }

    loginStart(): void {
        this.auth.loggingIn = true;
    }

    loginSuccess(user: UserResponse): void {
        // TODO: Save user session data (if there is any to save)
        this.auth.loggedIn = true;
        this.auth.loggingIn = false;
        this.auth.currentUser = user.uuid;
        this.entities = mergeEntityState(this.entities, {
            user: [user as User]
        });
    }

    loginError(): void {
        this.auth.loggedIn = false;
        this.auth.loggingIn = false;
    }

    logoutStart(): void {
        this.auth.loggingOut = true;
    }

    logoutSuccess(): void {
        this.auth.currentUser = null;
        this.auth.loggedIn = false;
        this.auth.loggingOut = false;
    }

    logoutError(): void {
        this.auth.loggingOut = false;
    }
}
