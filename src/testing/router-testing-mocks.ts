import { convertToParamMap, Data, Params, ParamMap } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 *
 * Based on the implementation from https://angular.io/guide/testing#activatedroutestub
 */
export class MockActivatedRoute {
    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private paramMapSubject = new ReplaySubject<ParamMap>();
    private dataSubject = new ReplaySubject<Data>();

    /** The mock paramMap observable */
    readonly paramMap = this.paramMapSubject.asObservable();
    readonly queryParamMap = this.paramMapSubject.asObservable();
    readonly data = this.dataSubject.asObservable();

    /** Set the paramMap observables's next value */
    setParamMap(params?: Params): void {
        this.paramMapSubject.next(convertToParamMap(params || {}));
    }

    /** Set the data observable's next value */
    setData(key: string, value: any): void {
        this.dataSubject.next({ [key]: value });
    }
}
