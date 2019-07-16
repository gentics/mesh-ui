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
import { timer } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounce, filter, switchMap } from 'rxjs/operators';

import { ApiService } from '../core/providers/api/api.service';

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

    constructor(private router: Router, private cookies: CookieService, private api: ApiService) {
        this.expiresIn
            .pipe(
                // Don't refresh the token when it expires too fast
                filter(validDuration => validDuration < MIN_TOKEN_VALID_DURATION),
                // Refresh 10 seconds before expiration
                debounce(timeout => timer((timeout - 10) * 1000)),
                switchMap(() => api.auth.refreshToken())
            )
            .subscribe();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone({
            headers: req.headers.set('Anonymous-Authentication', 'disable'),
            withCredentials: true
        });
        return next.handle(newReq).do(
            response => {
                this.resetRefreshTimer(response);
            },
            err => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    this.router.navigate(['login']);
                }
            }
        );
    }

    resetRefreshTimer(response: HttpEvent<any>) {
        if (!(response instanceof HttpResponse)) {
            return;
        }
        const jwt = this.cookies.get('mesh.token');
        const token: MeshToken = jwtDecode(jwt);
        const validDuration = token.exp - token.iat;

        this.expiresIn.next(validDuration);
    }
}
