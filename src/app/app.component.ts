import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { ApplicationStateService } from './state/providers/application-state.service';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['app.component.scss'],
    templateUrl: './app.component.html'
})
export class AppComponent {
    loggedIn$: Observable<boolean>;
    adminMode$: Observable<boolean>;

    constructor(public state: ApplicationStateService,
                private router: Router) {

        this.loggedIn$ = state.select(state => state.auth.loggedIn);
        this.adminMode$ = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map((event: NavigationEnd) => /^\/admin/.test(event.url));
    }
}
