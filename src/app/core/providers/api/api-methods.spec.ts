import { apiDelete, apiGet, apiPatch, apiPost, apiPostWithoutBody, apiPut } from './api-methods';
import { MockApiBase } from './api-base.mock';

describe('api-methods helper functions', () => {

    let apiBase: MockApiBase = undefined as any;
    let testApi: TestApi = undefined as any;
    beforeEach(() => {
        apiBase = new MockApiBase();
        testApi = new TestApi(apiBase);
    });

    describe('apiGet()', () => {
        it('forwards the passed parameters to apiBase.get()', () => {
            testApi.getSomething({ a: 1, b: 'two', c: true });
            expect(apiBase.allRequests.length).toBe(1);
            expect(apiBase.lastRequest.method).toBe('GET');
            expect(apiBase.lastRequest.url).toBe('/some-api-endpoint');
            expect(apiBase.lastRequest.params).toEqual({ a: 1, b: 'two', c: true });
            expect(apiBase.lastRequest.body).toBeUndefined();
        });

        it('returns the return value of apiBase.get()', () => {
            const emitted: any[] = [];
            testApi.getSomething({ a: 1, b: 'two', c: true })
                .subscribe(v => { emitted.push(v); });

            expect(emitted).toEqual([]);
            expect(apiBase.allRequests.length).toBe(1);
            apiBase.lastRequest.respond(200, { pi: 3.14 });
            expect(emitted).toEqual([{ pi: 3.14 }]);
        });
    });

    describe('apiPost()', () => {
        it('forwards the passed parameters to apiBase.post()', () => {
            testApi.postSomethingWithBody({ a: 1, b: 'two', c: true }, { body: 'as expected' });
            expect(apiBase.allRequests.length).toBe(1);
            expect(apiBase.lastRequest.method).toBe('POST');
            expect(apiBase.lastRequest.url).toBe('/some-api-endpoint');
            expect(apiBase.lastRequest.params).toEqual({ a: 1, b: 'two', c: true });
            expect(apiBase.lastRequest.body).toEqual({ body: 'as expected' });
        });

        it('returns the return value of apiBase.post()', () => {
            const emitted: any[] = [];
            testApi.postSomethingWithBody({ a: 1, b: 'two', c: true }, { body: 'as expected' })
                .subscribe(v => { emitted.push(v); });

            expect(emitted).toEqual([]);
            expect(apiBase.allRequests.length).toBe(1);
            apiBase.lastRequest.respond(200, { pi: 3.14 });
            expect(emitted).toEqual([{ pi: 3.14 }]);
        });
    });

    describe('apiPostWithoutBody()', () => {
        it('forwards the passed parameters to apiBase.post()', () => {
            testApi.postSomethingWithoutBody({ a: 1, b: 'two', c: true });
            expect(apiBase.allRequests.length).toBe(1);
            expect(apiBase.lastRequest.method).toBe('POST');
            expect(apiBase.lastRequest.url).toBe('/some-api-endpoint');
            expect(apiBase.lastRequest.params).toEqual({ a: 1, b: 'two', c: true });
            expect(apiBase.lastRequest.body).toBeUndefined();
        });

        it('returns the return value of apiBase.post()', () => {
            const emitted: any[] = [];
            testApi.postSomethingWithoutBody({ a: 1, b: 'two', c: true })
                .subscribe(v => { emitted.push(v); });

            expect(emitted).toEqual([]);
            expect(apiBase.allRequests.length).toBe(1);
            apiBase.lastRequest.respond(200, { pi: 3.14 });
            expect(emitted).toEqual([{ pi: 3.14 }]);
        });
    });

    describe('apiDelete()', () => {
        it('forwards the passed parameters to apiBase.delete()', () => {
            testApi.deleteSomething({ id: 47 });
            expect(apiBase.allRequests.length).toBe(1);
            expect(apiBase.lastRequest.method).toBe('DELETE');
            expect(apiBase.lastRequest.url).toBe('/some-api-endpoint');
            expect(apiBase.lastRequest.params).toEqual({ id: 47 });
            expect(apiBase.lastRequest.body).toBeUndefined();
        });

        it('returns the return value of apiBase.delete()', () => {
            const emitted: any[] = [];
            testApi.deleteSomething({ a: 1, b: 'two', c: true })
                .subscribe(v => { emitted.push(v); });

            expect(emitted).toEqual([]);
            expect(apiBase.allRequests.length).toBe(1);
            apiBase.lastRequest.respond(200, { pi: 3.14 });
            expect(emitted).toEqual([{ pi: 3.14 }]);
        });
    });

    describe('apiPatch()', () => {
        it('forwards the passed parameters to apiBase.patch()', () => {
            testApi.patchSomething({ id: 314 }, { someData: 'to update somewhere' });
            expect(apiBase.allRequests.length).toBe(1);
            expect(apiBase.lastRequest.method).toBe('PATCH');
            expect(apiBase.lastRequest.url).toBe('/some-api-endpoint');
            expect(apiBase.lastRequest.params).toEqual({ id: 314 });
            expect(apiBase.lastRequest.body).toEqual({ someData: 'to update somewhere' });
        });

        it('returns the return value of apiBase.patch()', () => {
            const emitted: any[] = [];
            testApi.patchSomething({ id: 314 }, { someData: 'to update somewhere' })
                .subscribe(v => { emitted.push(v); });

            expect(emitted).toEqual([]);
            expect(apiBase.allRequests.length).toBe(1);
            apiBase.lastRequest.respond(200, { pi: 3.14 });
            expect(emitted).toEqual([{ pi: 3.14 }]);
        });
    });

    describe('apiPut()', () => {
        it('forwards the passed parameters to apiBase.put()', () => {
            testApi.putSomething({ id: 314 }, { someData: 'to be put somewhere' });
            expect(apiBase.allRequests.length).toBe(1);
            expect(apiBase.lastRequest.method).toBe('PUT');
            expect(apiBase.lastRequest.url).toBe('/some-api-endpoint');
            expect(apiBase.lastRequest.params).toEqual({ id: 314 });
            expect(apiBase.lastRequest.body).toEqual({ someData: 'to be put somewhere' });
        });

        it('returns the return value of apiBase.put()', () => {
            const emitted: any[] = [];
            testApi.putSomething({ id: 314 }, { someData: 'to be put somewhere' })
                .subscribe(v => { emitted.push(v); });

            expect(emitted).toEqual([]);
            expect(apiBase.allRequests.length).toBe(1);
            apiBase.lastRequest.respond(200, { pi: 3.14 });
            expect(emitted).toEqual([{ pi: 3.14 }]);
        });
    });

});

class TestApi {
    constructor(private apiBase: MockApiBase) { }

    getSomething = apiGet('/some-api-endpoint' as any);
    postSomethingWithoutBody = apiPostWithoutBody('/some-api-endpoint' as any);
    postSomethingWithBody = apiPost('/some-api-endpoint' as any);
    deleteSomething = apiDelete('/some-api-endpoint' as any);

    // `never` means there are no PATCH endpoints yet
    patchSomething = apiPatch('/some-api-endpoint' as any as never);

    // `never` means there are no PUT endpoints yet
    putSomething = apiPut('/some-api-endpoint' as any as never);
}
