import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../../state/providers/app-state.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent {

    username = '';
    password = '';

    constructor(private state: AppState, private router: Router) {}

    onSubmit(e: Event): void {
        e.preventDefault();
        this.state.set('loggedIn', true);
        this.router.navigate(['/']);
    }
}
