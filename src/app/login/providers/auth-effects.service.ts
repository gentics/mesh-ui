import { Injectable } from '@angular/core';
import { ApiService } from '../../core/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';
import { noop } from '../../common/util/util';
import { Router } from '@angular/router';
import { ANONYMOUS_USER_NAME } from '../../common/config/config';

@Injectable()
export class AuthEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService,
                private router: Router) {}

    /**
     *
     */
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
                    return Observable.throw('autherror');
                    // TODO: Show a "wrong password" notification
                }
            })
            .do(noop, error => {
                this.state.actions.auth.loginError();
            })
            .subscribe(
                user => {
                    if (user.username === ANONYMOUS_USER_NAME) {
                        this.state.actions.auth.loginError();
                    } else {
                        this.state.actions.auth.loginSuccess(user);
                    }
                },
                err => {
                    console.log(`BALLS`, err);
                });

        // TODO: Add general error handler
    }

    logout(): void {
        this.state.actions.auth.logoutStart();
        this.api.auth.logout()
            .subscribe(successful => {
                if (successful) {
                    this.state.actions.auth.logoutSuccess();
                    this.router.navigate(['/login']);
                } else {
                    this.state.actions.auth.logoutError();
                }
            });

        // TODO: Add general error handler
    }
}
