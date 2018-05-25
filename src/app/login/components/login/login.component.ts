import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AuthEffectsService } from '../../providers/auth-effects.service';


@Component({
    selector: 'mesh-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnDestroy {

    username = '';
    password = '';

    private subscription: Subscription;

    constructor(private appState: ApplicationStateService,
                private authEffects: AuthEffectsService,
                private router: Router) {
        this.subscription = this.appState
            .select(state => state.auth.loggedIn)
            .filter(isLoggedIn => isLoggedIn)
            .take(1)
            .subscribe(() => {
                this.router.navigate(['/editor', 'project']);
            });
    }

    onSubmit(): void {
        this.authEffects.login(this.username, this.password);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
