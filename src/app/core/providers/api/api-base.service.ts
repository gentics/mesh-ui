import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';
import { catchError, last, map, materialize } from 'rxjs/operators';

import { ApiEndpoints } from '../../../common/models/server-models';
import { AlreadyHandledError, I18nNotification } from '../i18n-notification/i18n-notification.service';

import { API_BASE_URL } from './api-di-tokens';
import { ApiError } from './api-error';

const API_VERSION = 'v1';

export type RequestLanguage = 'de' | 'en';

export type RequestMethodString = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** An observable with a `mapResponses` method which can be used to handle expected errors.  */
export interface HttpResponseObservable<T> extends Observable<T[keyof T]> {
    rawResponse: Observable<HttpResponse<T>>;
    mapResponses<R>(mapping: ResponseMap<T, R>): Observable<R>;
}

type ResponseMapCallback<T, R> = (data: T) => R;

/** A map of values to return for expected status codes */
export type ResponseMap<T extends { [status: number]: any }, R> = FullResponseMap<T, R> | PartialResponseMap<T, R>;

type FullResponseMap<T extends { [status: number]: any }, R> = {
    /** Handles an expected status code */
    [K in keyof T]: R | ResponseMapCallback<T[K], R>
};

type PartialResponseMap<T extends { [status: number]: any }, R> = {
    /** Handles an expected status code. Can be ommitted if "success" is provided. */
    [K in keyof T]?: R | ResponseMapCallback<T[K], R>
} & {
    /** Status codes not mentioned in the RAML */
    [status: number]: R;
    /** Handles all other successful status codes */
    success: R | ResponseMapCallback<T[keyof T], R>;
};

interface QueryParams {
    [name: string]: string | number | boolean | Array<string | number | boolean>;
}

interface UrlParams {
    [name: string]: string | number | boolean;
}

/**
 * Base service for all Api classes that performs all requests to the API requests
 */
@Injectable()
export class ApiBase {
    protected requestLanguage: RequestLanguage = 'en';
    protected baseUrl = `/api/${API_VERSION}`;

    constructor(
        @Inject(API_BASE_URL)
        @Optional()
        baseUrl: string | null,
        protected http: HttpClient,
        private I18nNotification: I18nNotification
    ) {
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    /**
     * Create an Observable that will send a GET request to the API when subscribed to.
     *
     * @param {string} url The url to request with placeholders, e.g. `"/projects/{project}/groups/"`.
     * @param {object} params Url and query parameters of the request.
     */
    get<U extends keyof ApiEndpoints['GET']>(
        url: U,
        params: ApiEndpoints['GET'][U]['request']['urlParams'] & ApiEndpoints['GET'][U]['request']['queryParams'],
        headers?: any
    ): HttpResponseObservable<ApiEndpoints['GET'][U]['responseTypes']> {
        return this.request('GET', url, params as any, null, headers);
    }

    /**
     * Create an Observable that will send a POST request to the API when subscribed to.
     *
     * @param {string} url The url to request with placeholders, e.g. `"/projects/{project}/groups/"`.
     * @param {object} params Url and query parameters of the request.
     * @param {object} body The POST body of the request.
     *     When a `FormData` or an object containing `File` values are passed, the request is sent
     *     as a file upload with a `Content-Type` request header set to `"multipart/form-data"`.
     */
    post<U extends keyof ApiEndpoints['POST']>(
        url: U,
        params: ApiEndpoints['POST'][U]['request']['urlParams'] & ApiEndpoints['POST'][U]['request']['queryParams'],
        body: ApiEndpoints['POST'][U]['request']['body']
    ): HttpResponseObservable<ApiEndpoints['POST'][U]['responseTypes']> {
        return this.request('POST', url, params as any, body);
    }

    /**
     * Create an Observable that will send a DELETE request to the API when subscribed to.
     *
     * @param {string} url The url to request with placeholders, e.g. `"/projects/{project}/groups/"`.
     * @param {object} requestProps Properties of the request (`urlParams`, `queryParams` and `body`).
     */
    delete<U extends keyof ApiEndpoints['DELETE']>(
        url: U,
        params: ApiEndpoints['DELETE'][U]['request']['urlParams'] & ApiEndpoints['DELETE'][U]['request']['queryParams']
    ): HttpResponseObservable<ApiEndpoints['DELETE'][U]['responseTypes']> {
        return this.request('DELETE', url, params as any);
    }

    // /**
    //  * Create an Observable that will send a PATCH request to the API when subscribed to.
    //  *
    //  * @param {string} url The url to request with placeholders, e.g. `"/projects/{project}/groups/"`.
    //  * @param {object} requestProps Properties of the request (`urlParams`, `queryParams` and `body`).
    //  */
    // patch<U extends keyof ApiEndpoints['PATCH']>(
    //     url: U,
    //     params: ApiEndpoints['PATCH'][U]['request']['urlParams'] & ApiEndpoints['PATCH'][U]['request']['queryParams'],
    //     body: ApiEndpoints['PATCH'][U]['request']['body']
    // ): ResponseObservable<ApiEndpoints['PATCH'][U]['responseTypes']> {
    //     return this.request('PATCH' as any, url, params as any, body);
    // }

    // /**
    //  * Create an Observable that will send a PUT request to the API when subscribed to.
    //  *
    //  * @param {string} url The url to request with placeholders, e.g. `"/projects/{project}/groups/"`.
    //  * @param {object} requestProps Properties of the request (`urlParams`, `queryParams` and `body`).
    //  */
    // put<U extends keyof ApiEndpoints['PUT']>(
    //     url: U,
    //     params: ApiEndpoints['PUT'][U]['request']['urlParams'] & ApiEndpoints['PUT'][U]['request']['queryParams'],
    //     body: ApiEndpoints['PUT'][U]['request']['body']
    // ): ResponseObservable<ApiEndpoints['PUT'][U]['responseTypes']> {
    //     return this.request('PUT', url, params as any, body);
    // }

    /**
     * Change the language to set as "Accept-Language" header of requests.
     * The server will return status/error messages in this language.
     */
    setLanguageForServerMessages(lang: RequestLanguage): void {
        this.requestLanguage = lang;
    }

    /** Use the parameters to create a request and handle critical errors. */
    protected request(
        method: RequestMethodString,
        url: string,
        params: QueryParams & UrlParams,
        body?: any,
        extraHeaders?: { [key: string]: string | number }
    ): HttpResponseObservable<any> {
        // Append request headers
        const headers = new HttpHeaders({
            Accept: 'application/json',
            'Accept-Language': this.requestLanguage,
            ...extraHeaders
        });

        // Determine which body type to use.
        //
        // Passing a FormData object or a hash with a `File` instance as value
        // uses a FormData object and sends the request as `multipart/form-data`.
        // All other non-null values are sent as JSON.
        let bodyToUse: any;
        if (body == null) {
            bodyToUse = undefined;
        } else if (typeof FormData === 'function' && body instanceof FormData) {
            bodyToUse = body;
        } else if (
            typeof File === 'function' &&
            typeof FormData === 'function' &&
            typeof body === 'object' &&
            Object.keys(body).some(key => body[key] && (body[key].constructor === File || body[key] instanceof File))
        ) {
            // An object with at least one `File` instance was passed -> use FormData as request body
            bodyToUse = new FormData();
            for (const key of Object.keys(body)) {
                if (body[key] && (body[key].constructor === File || body[key] instanceof File)) {
                    bodyToUse.append(key, body[key], body[key].name);
                } else {
                    bodyToUse.append(key, body[key]);
                }
            }
        } else {
            bodyToUse = body;
            headers.append('Content-Type', 'application/json');
        }

        const request = new HttpRequest(method, this.formatUrl(url, params), bodyToUse, {
            headers,
            withCredentials: false
        });

        // Perform the actual request using the Http service provided by Angular
        const result = this.http.request(request).pipe(
            catchError((errorOrResponse: Error) => {
                // When an unexpected error is thrown by angular, wrap it in an ApiError
                if (errorOrResponse instanceof Response) {
                    // Non-OK statuses will be thrown by angular, but that could be expected.
                    // The function `toResponseObservable` will wrap it accordingly.
                    return observableOf(errorOrResponse);
                } else if (errorOrResponse instanceof AlreadyHandledError) {
                    return observableThrowError(errorOrResponse);
                } else {
                    return observableThrowError(new ApiError({ url, request, originalError: errorOrResponse }));
                }
            }),
            last(),
            map((response: HttpResponse<any>) => {
                // If response.json() fails, throw an ApiError instead of a generic error.
                return response;
            })
        );

        return this.toResponseObservable(result, url, request);
    }

    /**
     * Format a url as the raw url which gets passed to Http Requests
     * @param {string} url An URL, optionally with placeholders (e.g. `"/user/{id}"`)
     * @param {object} params A hash with url and query parameters to fill in, e.g. `{ id: 5 }`
     * @returns {string} An url with url and query parameters added.
     *
     * @example
     *     formatUrl('/project/{project}/tags', { project: 'MyProject', perPage: 50 })
     *     // => '/api/v1/project/MyProject/tags?perPage=50
     */
    formatUrl(url: string, params: Partial<UrlParams & QueryParams> = {}): string {
        const separator = url[0] === '/' ? '' : '/';
        const urlParams: string[] = [];
        let filledUrl = url.replace(/\{([^}]+)\}/g, (substring, paramName) => {
            if (!(paramName in params)) {
                throw new Error(`ApiBase: No url param "${paramName}" passed for url "${url}"`);
            }
            urlParams.push(paramName);
            return encodeURIComponent(String(params[paramName]));
        });

        // Append search parameters (supports multiple with the same name, e.g. ?type=a&type=b)
        const queryParamNames = Object.keys(params).filter(param => urlParams.indexOf(param) < 0);
        if (queryParamNames.length) {
            const queryParams = new URLSearchParams();
            for (const key of queryParamNames) {
                const value = params[key];
                if (value === null) {
                    continue;
                }
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, String(v)));
                } else if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            }
            filledUrl += '?' + queryParams.toString();
        }

        return this.baseUrl + separator + filledUrl;
    }

    /** Adds the mapResponses method to observables returned by ApiBase methods. */
    protected toResponseObservable<T>(
        inputObservable: Observable<HttpResponse<any>>,
        url: string,
        request: HttpRequest<any>
    ): HttpResponseObservable<T> {
        // The returned observable throws on HTTP errors, mapResponses does not.
        const resultObservable = (inputObservable
            .pipe(
                map(response => {
                    if (response.ok) {
                        return response.body;
                    } else {
                        throw new ApiError({ url, request, response });
                    }
                })
            )
            .pipe(this.I18nNotification.rxError) as any) as HttpResponseObservable<T>;

        resultObservable.rawResponse = inputObservable;

        resultObservable.mapResponses = <TResult>(mapping: ResponseMap<T, TResult>): Observable<TResult> => {
            return inputObservable
                .pipe(
                    materialize(),
                    map(notification => {
                        let status: number;
                        let body: any;
                        if (
                            notification.error instanceof ApiError &&
                            notification.error.originalError instanceof HttpErrorResponse
                        ) {
                            const originalError = notification.error.originalError;
                            status = originalError.status;
                            body = originalError.error;
                        } else if (notification.error instanceof AlreadyHandledError) {
                            throw notification.error;
                        } else if (notification.hasValue && notification.value) {
                            status = notification.value.status;
                            body = notification.value.body;
                        } else if (notification.kind === 'C') {
                            return;
                        } else {
                            throw new ApiError({ url, request, response: notification.value || notification.error });
                        }
                        const ok = status >= 200 && status < 300;
                        if (status in mapping || (ok && (mapping as any).success)) {
                            const mappedTo: any =
                                status in mapping ? (mapping as any)[status] : (mapping as any).success;
                            if (typeof mappedTo === 'function') {
                                return mappedTo.call(this, body);
                            } else {
                                return mappedTo;
                            }
                        } else {
                            if (notification.value) {
                                throw new ApiError({ url, request, response: notification.value });
                            } else {
                                throw new ApiError({ url, request, originalError: notification.error.originalError });
                            }
                        }
                    })
                )
                .pipe(this.I18nNotification.rxError);
        };

        return resultObservable;
    }
}
