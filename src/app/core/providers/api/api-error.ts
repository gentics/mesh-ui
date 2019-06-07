import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Response } from '@angular/http';

/**
 * A specific error caused by the API, only thrown on unexpected status codes or on critical errors.
 * The original url, request and response can be accessed as properties of the error.
 */
export class ApiError extends Error {
    readonly originalError: Error | undefined;
    readonly request: HttpRequest<any>;
    readonly response: HttpResponse<any> | undefined;
    readonly url: string;

    /** Construct from a successful request and a response (not necessarily HTTP 200) */
    constructor({
        url,
        request,
        response,
        cause
    }: {
        url?: string;
        request: HttpRequest<any>;
        response: HttpResponse<any>;
        cause?: string;
    });
    /** Construct from a failed request and an error */
    constructor({ url, request, originalError }: { url?: string; request: HttpRequest<any>; originalError: Error });

    constructor({
        url,
        request,
        response,
        cause,
        originalError
    }: {
        url?: string;
        request: HttpRequest<any>;
        response?: HttpResponse<any>;
        cause?: string;
        originalError?: Error;
    }) {
        url = url || request.url;

        let message: string;
        if (response) {
            // Attempt to parse error message from mesh
            let responseBody;
            try {
                responseBody = response.body;
            } catch (err) {}
            if (responseBody && responseBody.message) {
                message = responseBody.message;
            } else {
                message = (cause || `HTTP ${response.status} returned`) + ` for "${url}"`;
            }
        } else if (originalError) {
            message = `${originalError.name} requesting "${url}": ${originalError.message}`;
        } else {
            message = `Error requesting "${url}".`;
        }

        super(message);

        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        if (!(this instanceof ApiError)) {
            Object.setPrototypeOf(this, ApiError.prototype);
        }

        this.message = message;
        this.name = 'ApiError';
        this.originalError = originalError;
        this.request = request;
        this.response = response;
        this.url = url;
    }
}
