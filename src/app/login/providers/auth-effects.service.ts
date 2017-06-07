import { Injectable } from '@angular/core';
import { ApiService } from '../../core/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';
import { Router } from '@angular/router';
import { ANONYMOUS_USER_NAME } from '../../common/config/config';
import { I18nNotification } from '../../core/providers/i18n-notification/i18n-notification.service';

@Injectable()
export class AuthEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService,
                private notification: I18nNotification,
                private router: Router) {}

    /** Check if the user has an active authenticated session already */
    validateSession(): void {
        this.state.actions.auth.loginStart();

        this.api.auth.getCurrentUser()
            .subscribe(user => {
                if (user.username === ANONYMOUS_USER_NAME) {
                    this.state.actions.auth.loginError();
                } else {
                    this.state.actions.auth.loginSuccess(user);
                }
            });
    }

    login(username: string, password: string): void {
        this.state.actions.auth.loginStart();
        this.api.auth.login({ username, password })
            .flatMap(successful => {
                if (successful) {
                    return this.api.auth.getCurrentUser();
                } else {
                    this.notification.show({
                        type: 'error',
                        message: 'auth.auth_error',
                        delay: 5000
                    });
                    return [];
                }
            })
            .subscribe(
                user => {
                    if (!user || user.username === ANONYMOUS_USER_NAME) {
                        this.state.actions.auth.loginError();
                    } else {
                        this.state.actions.auth.loginSuccess(user);
                    }
                },
                error => {
                    this.state.actions.auth.loginError();
                    // TODO: Add general error handler
                    throw error;
                });
    }

    logout(): void {
        this.state.actions.auth.logoutStart();
        this.api.auth.logout()
            .subscribe(
                successful => {
                    if (successful) {
                        this.state.actions.auth.logoutSuccess();
                        this.router.navigate(['/login']);
                    } else {
                        this.state.actions.auth.logoutError();
                    }
                },
                error => {
                    this.state.actions.auth.logoutError();
                    // TODO: Add general error handler
                    throw error;
                }
            );
    }
}
