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
    appList$: Observable<any>;

    constructor(public state: ApplicationStateService, devtools: ApplicationStateDevtools, private router: Router) {
        this.loggedIn$ = state.select(_state => _state.auth.loggedIn);
        this.adminMode$ = this.router.events
            .filter((event: NavigationEnd) => event instanceof NavigationEnd)
            .map((event: NavigationEnd) => /^\/admin/.test(event.url));

        // configure app navigator list
        this.appList$ = this.adminMode$.map((adminMode: boolean) => {
            if (adminMode) {
                return [
                    {
                        name: 'editor',
                        label: 'CMS',
                        icon: 'edit'
                    }
                ];
            } else {
                return [
                    {
                        name: 'admin',
                        label: 'Administration',
                        icon: 'vpn_key'
                    }
                ];
            }
        });
    }

    /**
     * On click on app navigator app icon
     * @param app identifier string for app route
     */
    navigateToApp(app: string) {
        const routerLink: any[] = [`/${app}`];
        // provide routing information
        if (app !== 'admin') {
            routerLink.push('project');
        }
        this.router.navigate(routerLink);
    }
}
