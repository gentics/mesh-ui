import { Observable } from 'rxjs/Observable';

import { ApiEndpoints } from '../../../common/models/server-models';

/**
 * Creates a method that is a typed wrapper to `this.apiBase.get()`.
 *
 * @example
 *     getUsers = apiGetMethod('/users');
 *         // is equivalent to
 *     getUsers(params?: { ...param type of '/users'... }): Observable<{ ...response type of '/users'... }> {
 *         return this.apiBase.get('/users', { params });
 *     }
 */
export function apiGet<U extends keyof ApiEndpoints['GET']>(url: U) {
    return function getMethod(
        params: ApiEndpoints['GET'][U]['request']['urlParams'] & ApiEndpoints['GET'][U]['request']['queryParams']
    ): Observable<ApiEndpoints['GET'][U]['responseType']> {
        return this.apiBase.get(url, params);
    };
}

/** Creates a method that is a typed wrapper to `this.apiBase.post()`. */
export function apiPost<U extends keyof ApiEndpoints['POST']>(url: U) {
    return function postMethod(
        params: ApiEndpoints['POST'][U]['request']['urlParams'] & ApiEndpoints['POST'][U]['request']['queryParams'],
        body: ApiEndpoints['POST'][U]['request']['body']
    ): Observable<ApiEndpoints['POST'][U]['responseType']> {
        return this.apiBase.post(url, params, body);
    };
}

/** Creates a method that is a typed wrapper to `this.apiBase.post()` for endpoints without a request body. */
export function apiPostWithoutBody<U extends keyof ApiEndpoints['POST']>(url: U) {
    return function postMethod(
        params: ApiEndpoints['POST'][U]['request']['urlParams'] & ApiEndpoints['POST'][U]['request']['queryParams']
    ): Observable<ApiEndpoints['POST'][U]['responseType']> {
        return this.apiBase.post(url, params);
    };
}

/** Creates a method that is a typed wrapper to `this.apiBase.delete()`. */
export function apiDelete<U extends keyof ApiEndpoints['DELETE']>(url: U) {
    return function deleteMethod(
        params: ApiEndpoints['DELETE'][U]['request']['urlParams'] & ApiEndpoints['DELETE'][U]['request']['queryParams']
    ): Observable<ApiEndpoints['DELETE'][U]['responseType']> {
        return this.apiBase.delete(url, params);
    };
}

// /** Creates a method that is a typed wrapper to `this.apiBase.put()`. */
// export function apiPut<U extends keyof ApiEndpoints['PUT']>(url: U) {
//     return function putMethod(
//         params: ApiEndpoints['PUT'][U]['request']['urlParams'] & ApiEndpoints['PUT'][U]['request']['queryParams'],
//         body: ApiEndpoints['POST'][U]['request']['body']
//     ): Observable<ApiEndpoints['PUT'][U]['responseType']> {
//         return this.apiBase.put(url, params, body);
//     };
// }

// /** Creates a method that is a typed wrapper to `this.apiBase.pattch()`. */
// export function apiPatch<U extends keyof ApiEndpoints['PATCH']>(url: U) {
//     return function patchMethod(
//         params: ApiEndpoints['PATCH'][U]['request']['urlParams'] & ApiEndpoints['PATCH'][U]['request']['queryParams'],
//         body: ApiEndpoints['PATCH'][U]['request']['body']
//     ): Observable<ApiEndpoints['PATCH'][U]['responseType']> {
//         return this.apiBase.patch(url, params, body);
//     };
// }
