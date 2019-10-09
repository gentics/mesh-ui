import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { MockI18nNotification } from '../i18n-notification/i18n-notification.service.mock';

import { ApiBase, RequestMethodString } from './api-base.service';

/** Only available in testing. A request tracked by {@link MockApiBase}. */
export declare class MockedApiRequest {
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
    url: string;
    params: any;
    body: any;
    headers: any;
    respond<T>(status: number, responseBody: T): void;
    respond(status: number, responseBody: any): void;
}

/**
 * A mock of {@link ApiBase} for unit tests.
 *
 * Calls to `.get`/`.post` are tracked as `lastRequest` and `allRequest`.
 * The returned observables do not emit by default (like a server that does not respond).
 * To test a response, call `lastRequest.respond()` with the value to test.
 */
export class MockApiBase extends ApiBase {
    /** Only available in testing. Tracks the last request which would be sent to the API. */
    lastRequest: MockedApiRequest;

    /** Only available in testing. Tracks all requests which would be sent to the API. */
    allRequests: MockedApiRequest[] = [];

    constructor() {
        // Provide a spy Http service to ApiBase, we don't want to do actual http calls in unit tests.
        super((undefined as any) as string, (undefined as any) as HttpClient, new MockI18nNotification() as any);
        this.http = ({
            request: (r: Request) => this.interceptHttpRequest(r)
        } as any) as HttpClient;
    }

    protected request(method: RequestMethodString, url: string, params: any = {}, body?: any, extraHeaders?: any): any {
        const result = super.request(method, url, params, body);

        // Add the passed arguments to the tracked request.
        // They are not available on the actual `Request` object.
        this.lastRequest.method = method;
        this.lastRequest.body = body === null ? undefined : body;
        this.lastRequest.url = url;
        this.lastRequest.params = params;
        this.lastRequest.headers = extraHeaders;

        return result;
    }

    /** Intercepts requests made via Angulars `Http` service and stores them on this instance. */
    private interceptHttpRequest(request: Request): Observable<HttpResponse<any>> {
        const trackedRequest = {} as MockedApiRequest;
        const returnedObservable = new Subject<HttpResponse<any>>();

        // Add a non-enumerable "respond" method
        Object.defineProperty(trackedRequest, 'respond', {
            configurable: true,
            enumerable: false,
            writable: true,
            value: (status: number, body: any) => {
                const response = new HttpResponse({
                    body: JSON.stringify(body),
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json'
                    }),
                    status,
                    url: request.url
                });
                returnedObservable.next(response);
                returnedObservable.complete();
                trackedRequest.respond = () => {};
            }
        });
        this.allRequests.push((this.lastRequest = trackedRequest));
        return returnedObservable as Observable<HttpResponse<any>>;
    }
}
