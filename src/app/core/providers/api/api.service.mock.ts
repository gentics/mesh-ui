import { MockApiBase } from './api-base.mock';
import { ApiService } from './api.service';

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

        for (const key in this) {
            if (typeof this[key] === 'function') {
                // Spy on methods of the ApiService
                spyOn(this, key).and.callThrough();
            } else if (typeof this[key] === 'object') {
                for (const subkey in this[key]) {
                    // Spy on methods of the child properties, e.g. api.project.getNodes()
                    if (typeof this[key][subkey] === 'function') {
                        spyOn(this[key], subkey).and.callThrough();
                    }
                }
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
