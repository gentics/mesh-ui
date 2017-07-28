import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';
import { Observable } from 'rxjs';

import { RoleUpdateRequest } from '../../../common/models/server-models';
import { BreadcrumbsComponent } from '../../../editor/components/breadcrumbs/breadcrumbs.component';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { StateActionBranch } from 'immutablets';
import { AppState } from '../../../state/models/app-state.model';

/**
 * A breadcrumbs component which reads the route config and any route that has a `data.breadcrumb` property will
 * be displayed in the breadcrumb trail.
 *
 * The `breadcrumb` property can be a string or a function. If a function, it will be passed the route's `data`
 * object (which will include all resolved keys) and any route params, and should return a string.
 */
@Component({
    selector: 'admin-breadcrumbs',
    templateUrl: './admin-breadcrumbs.component.html',
    styleUrls: ['./admin-breadcrumbs.scss']
})
export class AdminBreadcrumbsComponent implements OnInit {
    breadcrumbs$: Observable<IBreadcrumbRouterLink[]>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private state: ApplicationStateService) { }

    ngOnInit() {
        this.breadcrumbs$ = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .switchMap(() => Observable.combineLatest(
                ...flatRoute(this.route.root.snapshot)
                    .filter(getBreadcrumbText) // has breadcrumb text
                    .map(it => this.toBreadcrumb(it))
            ));
    }

    /**
     * Maps a route to a breadcrumb usable by the gtx-breadcrumbs component.
     * The route must have the `data.breadcrumb` property defined, which will determine the name of the breadcrumb.
     * The `data.breadcrumb` can be one of the following:
     * * string
     * * Observable<string>
     * * (appState) => string
     *
     * @param route
     */
    toBreadcrumb(route: ActivatedRouteSnapshot): Observable<IBreadcrumbRouterLink> {
        const breadcrumb = getBreadcrumbText(route);
        if (!breadcrumb) {
            throw new Error('Could not find breadcrumb data');
        }

        const paths = routeUrl(route);
        let result;
        if (typeof breadcrumb === 'function') {
            result = this.state.select(breadcrumb);
        } else {
            result = breadcrumb;
        }

        if (typeof result === 'string') {
            return Observable.of({
                text: result,
                route: paths
            });
        } else if (result instanceof Observable) {
            return result.map(text => ({
                text,
                route: paths
            }));
        } else {
            throw new Error('Invalid type of data.breadcrumb');
        }
    }
}

/**
 * Flatten the nested routes of the router.
 * @param route
 */
function flatRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot[] {
    if (route.children.length === 0) {
        return [route];
    } else if (route.children.length === 1) {
        return [route, ...flatRoute(route.children[0])];
    } else {
        throw new Error('Unexpected: Multiple children activated');
    }
}

/**
 * Returns all path segments of a route.
 * @param route
 */
function routeUrl(route: ActivatedRouteSnapshot): string[] {
    const paths = recur(route);
    if (paths.length > 0) {
        paths[0] = '/' + paths[0];
    }
    return paths;

    function recur(route: ActivatedRouteSnapshot | null): string[] {
        if (!route) {
            return [];
        }
        const url = route.url[0];
        if (url) {
            return [...recur(route.parent), url.path];
        } else {
            return recur(route.parent);
        }
    }
}

type BreadcrumbText = string | Observable<string> | ((state: AppState) => Observable<string>) | null;

/**
 * Returns breadcrumb text or null if it does not exist
 */
function getBreadcrumbText(route: ActivatedRouteSnapshot): BreadcrumbText {
    return route && route.routeConfig && route.routeConfig.data && route.routeConfig.data.breadcrumb;
}
