import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { matchOtherValidator } from 'src/app/common/util/util';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AuthEffectsService } from '../../providers/auth-effects.service';

@Component({
    selector: 'mesh-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
    /** CSS class string defining logo animation state */
    animclasscontainer = '';
    animclasslogo = 'cube__face--front';
    animclassimg = '';
    animclassform = '';

    private subscription: Subscription;

    public forcedPasswordChange: boolean;

    public loginForm: FormGroup;

    constructor(
        private appState: ApplicationStateService,
        private authEffects: AuthEffectsService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.subscription = this.appState
            .select(state => state.auth.loggedIn)
            .filter(isLoggedIn => isLoggedIn)
            .take(1)
            .subscribe(() => {
                this.router.navigate(['/editor', 'project']);
            });

        this.loginForm = fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            newPassword: '',
            newPasswordRepeat: ['', matchOtherValidator('newPassword')]
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

    async onSubmit() {
        const values = this.loginForm.value;
        this.forcedPasswordChange = false;
        try {
            await this.authEffects.login(values.username, values.password, values.newPassword || undefined);
        } catch (err) {
            if (err && err.i18nKey === 'auth_login_password_change_required') {
                this.forcedPasswordChange = true;
            }
        }
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
