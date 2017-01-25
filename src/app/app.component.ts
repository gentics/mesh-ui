import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './state/providers/app-state.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
    loggedIn$: Observable<boolean>;
    adminMode$: Observable<boolean>;

    constructor(public state: AppState,
                private router: Router) {

        this.loggedIn$ = state.changes$.map(state => state.loggedIn);
        this.adminMode$ = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(event => /^\/admin/.test(event.url));
    }

    logOut(): void {
        this.state.set('loggedIn', false);
        this.router.navigate(['/login']);
    }
}
