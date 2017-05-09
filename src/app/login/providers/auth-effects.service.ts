import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';

@Injectable()
export class AuthEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {}

    login(username: string, password: string): void {
        this.state.actions.auth.loginStart();
        this.api.auth.login({ username, password })
            .subscribe(successful => {
                if (successful) {
                    this.state.actions.auth.loginSuccess();
                } else {
                    this.state.actions.auth.loginError();
                    // TODO: Show a "wrong password" notification
                }
            });

        // TODO: Add general error handler
    }
}
