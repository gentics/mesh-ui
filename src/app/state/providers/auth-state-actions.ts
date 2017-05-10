import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';
import { UserResponse } from '../../common/models/server-models';
import { EntityState } from '../models/entity-state.model';


@Injectable()
@Immutable()
export class AuthStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private auth: AuthState;
    @CloneDepth(2) private entities: EntityState;

    constructor() {
        super({
            uses: ['auth', 'entities'],
            initialState: {
                auth: {
                    loggedIn: false,
                    loggingIn: false,
                    loggingOut: false,
                    currentUser: null
                }
            }
        });
    }

    loginStart(): void {
        this.auth.loggingIn = true;
    }

    loginSuccess(user: UserResponse): void {
        // TODO: Save user session date (if there is any to save)
        this.auth.loggedIn = true;
        this.auth.loggingIn = false;
        this.entities.user[user.uuid] = user;
        this.auth.currentUser = user.uuid;
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
