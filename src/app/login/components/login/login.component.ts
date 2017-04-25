import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationStateService } from '../../../state/providers/application-state.service';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent {

    username = '';
    password = '';

    constructor(private state: ApplicationStateService,
                private router: Router) {}

    onSubmit(e: Event): void {
        e.preventDefault();

        // TODO: actually login
        this.state.actions.auth.loginStart();
        this.state.actions.auth.loginSuccess();

        this.router.navigate(['/editor', 'project']);
    }
}
