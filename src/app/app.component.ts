import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateDevtools } from './state/providers/application-state-devtools';
import { ApplicationStateService } from './state/providers/application-state.service';

@Component({
    selector: 'mesh-app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['app.component.scss'],
    templateUrl: './app.component.html'
})
export class AppComponent {
    loggedIn$: Observable<boolean>;
    adminMode$: Observable<boolean>;

    displayMenu = false;

    constructor(public state: ApplicationStateService, devtools: ApplicationStateDevtools, private router: Router) {
        this.loggedIn$ = state.select(_state => _state.auth.loggedIn);
        this.adminMode$ = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map((event: NavigationEnd) => {
                this.displayMenu = false;
                return /^\/admin/.test(event.url);
            });
    }
}
