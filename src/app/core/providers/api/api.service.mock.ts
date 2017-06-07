import { ApiService } from './api.service';
import { MockApiBase } from './api-base.mock';

/**
 * An ApiService mock that can be provided in place of `ApiService` and spies on all method calls.
 * Requests which would be sent to the server can be observed via `lastRequest` and `allRequests`,
 * response behavior can be tested with `lastRequest.respond()`.
 *
 * The language of api requests defaults to english.
 */
export class MockApiService extends ApiService {
    public apiBase: MockApiBase;

    constructor() {
        super(new MockApiBase());
        this.apiBase.setLanguageForServerMessages('en');

        for (let key in this) {
            if (typeof this[key] === 'function') {
                spyOn(this, key).and.callThrough();
            }
        }
    }

    /** The last request which would have been sent to the api. Only available in the mock, not in the real service. */
    get lastRequest() {
        return this.apiBase.lastRequest;
    }

    /** Requests which would have been sent to the api. Only available in the mock, not in the real service. */
    get allRequests() {
        return this.apiBase.allRequests;
    }
}
