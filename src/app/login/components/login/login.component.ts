import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AuthEffectsService } from '../../providers/auth-effects.service';

@Component({
    selector: 'mesh-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
    username = '';
    password = '';

    /** CSS class string defining logo animation state */
    animclasscontainer = '';
    animclasslogo = 'cube__face--front';
    animclassimg = '';
    animclassform = '';

    private subscription: Subscription;

    constructor(
        private appState: ApplicationStateService,
        private authEffects: AuthEffectsService,
        private router: Router
    ) {
        this.subscription = this.appState
            .select(state => state.auth.loggedIn)
            .filter(isLoggedIn => isLoggedIn)
            .take(1)
            .subscribe(() => {
                this.router.navigate(['/editor', 'project']);
            });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.animclasscontainer = ELogoAnimClass.FADE_IN;
        }, 0);

        setTimeout(() => {
            this.animate();
        }, 150);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(): void {
        this.authEffects.login(this.username, this.password);
    }

    animate(): void {
        this.animclasslogo = ELogoAnimClass.ANGLE;
        this.animclassimg = ELogoAnimClass.ROTATE;

        setTimeout(() => {
            this.animclasslogo += ' ' + ELogoAnimClass.FADE_OUT;
            this.animclassimg += ' ' + ELogoAnimClass.FADE_IN;
        }, 250);

        setTimeout(() => {
            this.animclassform = ELogoAnimClass.FADE_IN;
        }, 300);
    }
}

enum ELogoAnimClass {
    ANGLE = 'show-angle',
    FADE_IN = 'fade-in',
    FADE_OUT = 'fade-out',
    ROTATE = 'rotate'
}
