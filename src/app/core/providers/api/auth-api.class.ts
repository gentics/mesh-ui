import { Observable } from 'rxjs/Observable';

import { ApiBase } from './api-base.service';
import { UserResponse } from '../../../common/models/server-models';


export class AuthApi {

    constructor(private apiBase: ApiBase) { }

    /** Query information about the current user. */
    getCurrentUser(): Observable<UserResponse> {
        return this.apiBase.get('/auth/me', {});
    }

    /** Check if the user has an active valid JWT session. */
    isLoggedIn(): Observable<boolean> {
        return this.apiBase.get('/auth/me', {})
            .mapResponses({
                success: true,
                401: false
            });
    }

    /** Login as a known user. */
    login({ username, password }: { username: string, password: string }): Observable<boolean> {
        return this.apiBase.post('/auth/login', undefined, { username, password })
            .mapResponses({
                success: true,
                401: false
            });
    }

    /** Log out and destroy the current session. */
    logout(): Observable<boolean> {
        return this.apiBase.get('/auth/logout', {})
            .mapResponses({
                success: true,
                401: false
            });
    }
}
