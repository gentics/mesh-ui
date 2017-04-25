import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';


@Injectable()
@Immutable()
export class AuthStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private auth: AuthState;

    constructor() {
        super({
            uses: ['auth'],
            initialState: {
                auth: {
                    // TODO: set to false. True for now to speed up development time in absence of
                    // persistent logged-in state.
                    loggedIn: true,
                    loggingIn: false,
                    loggingOut: false
                }
            }
        });
    }

    loginStart(): void {
        this.auth.loggingIn = true;
    }

    loginSuccess(): void {
        // TODO: Save user session date (if there is any to save)
        this.auth.loggedIn = true;
        this.auth.loggingIn = false;
    }

    loginError(): void {
        this.auth.loggedIn = false;
        this.auth.loggingIn = false;
    }

    logoutStart(): void {
        this.auth.loggingOut = true;
    }

    logoutSuccess(): void {
        this.auth.loggedIn = false;
        this.auth.loggingOut = false;
    }

    logoutError(): void {
        this.auth.loggingOut = false;
    }
}
