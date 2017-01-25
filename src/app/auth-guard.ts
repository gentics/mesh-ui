import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppState } from './state/providers/app-state.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private appState: AppState, private router: Router) {}

    /**
     * Returns true if the user is logged in according to the app state.
     */
    canActivate(): boolean {
        if (this.appState.get('loggedIn')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
