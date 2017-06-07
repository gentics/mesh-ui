import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { ApplicationStateService } from '../../../state/providers/application-state.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private state: ApplicationStateService,
                private router: Router) { }

    /**
     * Returns true if the user is logged in according to the app state.
     */
    canActivate(): boolean {
        console.log(`auth guard`);
        if (this.state.now.auth.loggedIn) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
