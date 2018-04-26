import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, RouteConfigLoadEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AppState } from '../../../state/models/app-state.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';

export type BreadcrumbTextFunction =
    (route: ActivatedRouteSnapshot, state: AppState, entities: EntitiesService) => string | Observable<string>;

/**
 * A breadcrumbs component which reads the route config and any route that has a `data.breadcrumb` property will
 * be displayed in the breadcrumb trail.
 *
 * The `breadcrumb` property can be a string or a function. If a function, it will be passed the route's `data`
 * object (which will include all resolved keys) and any route params, and should return a string.
 */
@Component({
    selector: 'mesh-admin-breadcrumbs',
    templateUrl: './admin-breadcrumbs.component.html',
    styleUrls: ['./admin-breadcrumbs.scss']
})
export class AdminBreadcrumbsComponent implements OnInit {
    breadcrumbs$: Observable<IBreadcrumbRouterLink[]>;
    loading$: Observable<boolean>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private entities: EntitiesService,
                private i18nService: I18nService,
                private state: ApplicationStateService) { }

    ngOnInit() {
        this.breadcrumbs$ = this.router.events                      // On router event
            .filter(event => event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd)   // when user navigated somewhere...
            .switchMap(() => Observable.combineLatest(
                ...flatRoute(this.route.root.snapshot)              // get the current route,
                    .filter(getBreadcrumbSource)                    // that have breadcrumb options set
                    .map(it => this.toBreadcrumb(it))     // and map them to breadcrumbs
            ));

        this.loading$ = this.state.select(state =>
            0 < state.adminUsers.loadCount ||
            0 < state.adminSchemas.loadCount ||
            0 < state.adminProjects.loadCount
        );
    }

    /**
     * Maps a route to a breadcrumb usable by the gtx-breadcrumbs component.
     * The route must have the `data.breadcrumb` property defined, which will determine the name of the breadcrumb.
     */
    toBreadcrumb(route: ActivatedRouteSnapshot): Observable<IBreadcrumbRouterLink> {
        const breadcrumbSource = getBreadcrumbSource(route);
        if (!breadcrumbSource) {
            throw new Error('Could not find breadcrumb data');
        }

        const paths = routeUrl(route);

        if (typeof breadcrumbSource === 'function') {
            return this.state.select(state => state)
                .switchMap(state => {
                    const stringOrObservable = breadcrumbSource(route, state, this.entities);
                    return typeof stringOrObservable === 'string' ? [stringOrObservable] : stringOrObservable;
                })
                .map(text => ({
                    text: this.i18nService.translate(text),
                    route: paths
                }));
        } else if (typeof breadcrumbSource === 'string') {
            return Observable.of({
                text: this.i18nService.translate(breadcrumbSource),
                route: paths
            });
        } else {
            throw new Error('Invalid type of data.breadcrumb');
        }
    }
}

/**
 * Flatten the nested routes of the router.
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
 */
function routeUrl(route: ActivatedRouteSnapshot): string[] {
    const paths = recur(route);
    if (paths.length > 0) {
        paths[0] = '/' + paths[0];
    }
    return paths;
}

function recur(route: ActivatedRouteSnapshot | null): string[] {
    if (!route) {
        return [];
    }
    const urls = route.url.map(it => it.path);
    if (urls.length > 0) {
        return [...recur(route.parent), ...urls];
    } else {
        return recur(route.parent);
    }
}

/**
 * Returns breadcrumb text or null if it does not exist
 */
function getBreadcrumbSource(route: ActivatedRouteSnapshot): string | BreadcrumbTextFunction | null {
    return route && route.routeConfig && route.routeConfig.data && route.routeConfig.data.breadcrumb;
}
