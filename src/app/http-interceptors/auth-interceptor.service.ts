import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { empty, throwError, timer, Observable, Subject } from 'rxjs';
import { catchError, debounce, filter, switchMap, tap } from 'rxjs/operators';

import { ApiService } from '../core/providers/api/api.service';
import { AlreadyHandledError, I18nNotification } from '../core/providers/i18n-notification/i18n-notification.service';

interface MeshToken {
    userUuid: string;
    /** Epoch seconds of when the token was issued */
    iat: number;
    /** Epoch seconds of when the token will expire */
    exp: number;
}

const MIN_TOKEN_VALID_DURATION = 60;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private expiresIn = new Subject<number>();

    constructor(
        private router: Router,
        private cookies: CookieService,
        private api: ApiService,
        private notification: I18nNotification
    ) {
        this.expiresIn
            .pipe(
                // Don't refresh the token when it expires too fast
                filter(validDuration => validDuration < MIN_TOKEN_VALID_DURATION),
                // Refresh 10 seconds before expiration
                debounce(timeout => timer((timeout - 10) * 1000)),
                switchMap(() => api.auth.refreshToken()),
                catchError(() => empty())
            )
            .subscribe();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone({
            headers: req.headers.set('Anonymous-Authentication', 'disable'),
            withCredentials: true
        });
        return next.handle(newReq).pipe(
            tap(response => this.resetRefreshTimer(response)),
            catchError(err => {
                // 401 happens when the user session is timed out. This can happen anywhere and should display a special error message.
                // One exception is the login endpoint where a 401 means that the user provided wrong credentials. In that case,
                // error handling should continue normally.
                if (
                    err instanceof HttpErrorResponse &&
                    err.status === 401 &&
                    (err.url && !err.url.endsWith('/auth/login'))
                ) {
                    const url = this.router.routerState.snapshot.url;
                    if (url && url !== '/login') {
                        this.router.navigate(['login']);
                        this.notification.show({
                            type: 'error',
                            message: 'auth.session_expired'
                        });
                    }
                    return throwError(new AlreadyHandledError());
                } else {
                    return throwError(err);
                }
            })
        );
    }

    resetRefreshTimer(response: HttpEvent<any>) {
        if (!(response instanceof HttpResponse)) {
            return;
        }
        const jwt = this.cookies.get('mesh.token');
        // There are some requests that do not respond with a token (logout)
        if (jwt) {
            const token: MeshToken = jwtDecode(jwt);
            const validDuration = token.exp - token.iat;

            this.expiresIn.next(validDuration);
        }
    }
}
