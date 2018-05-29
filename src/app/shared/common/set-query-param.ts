import { Router, ActivatedRoute } from '@angular/router';

/**
* Updates the query params whilst preserving existing params.
*/
export function setQueryParams(router: Router, route: ActivatedRoute, params: { [key: string]: string | number; }): void {
    router.navigate(['./'], {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: route
    });
}
