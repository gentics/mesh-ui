import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

 /**
 * Returns an Observable which emits whenever a route query param with the given name changes.
 */
export function observeQueryParam<T extends string | number>(queryParamMap: Observable<ParamMap>, paramName: string, defaultValue: T): Observable < T > {
    return queryParamMap
        .map(paramMap => {
            const value = paramMap.get(paramName) as T || defaultValue;
            return (typeof defaultValue === 'number' ? +value : value) as T;
        })
        .distinctUntilChanged();
}
