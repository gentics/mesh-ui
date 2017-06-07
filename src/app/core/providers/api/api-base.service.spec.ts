import { TestBed } from '@angular/core/testing';
import { ConnectionBackend, Headers, Http, HttpModule, Request, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable, Subscription } from 'rxjs';

import { ApiBase, ResponseObservable } from './api-base.service';
import { ApiError } from './api-error';
import { Subject } from 'rxjs/Subject';
import { API_BASE_URL } from './api-di-tokens';


describe('ApiBase', () => {

    let apiBase: ApiBase;
    let backend: MockBackend;
    let subscription: Subscription | undefined;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ApiBase,
                Http,
                { provide: ConnectionBackend, useClass: MockBackend },
                { provide: API_BASE_URL, useValue: '/api/v1' }
            ]
        });

        apiBase = TestBed.get(ApiBase);
        backend = TestBed.get(ConnectionBackend);
        expect(backend instanceof MockBackend).toBe(true);
    });

    afterEach(() => {
        if (subscription) {
            subscription.unsubscribe();
            subscription = undefined;
        }
    });

    it('can be created', () => {
        expect(apiBase).toBeDefined();
    });

    describe('get()', () => {

        it('creates a GET request', () => {
            apiBase.get('/some-api-endpoint' as any, {}).subscribe();
            expect(backend.connectionsArray.length).toBe(1);
            expect(backend.connectionsArray[0].request.method).toBe(RequestMethod.Get);
        });

        it('sets the passed properties on the request', () => {
            apiBase.setLanguageForServerMessages('en');
            apiBase.get('/groups/{groupUuid}', {
                groupUuid: 'some-uuid',
                role: 'some-role'
            }).subscribe();

            expect(backend.connectionsArray.length).toBe(1);
            const request = backend.connectionsArray[0].request;

            expect(request.method).toBe(RequestMethod.Get);
            expect(request.url).toBe('/api/v1/groups/some-uuid?role=some-role');
            expect(request.headers.getAll('Accept')).toEqual(['application/json']);
            expect(request.headers.getAll('Accept-Language')).toEqual(['en']);
            expect(request.headers.getAll('Content-Type')).toEqual(null);
        });

        it('emits the response body on successful status codes', () => {
            let receivedResponse = false;
            apiBase.get('/math/pi' as any, {}).subscribe(responseBody => {
                expect(responseBody).toEqual({ pi: 3.14 });
                receivedResponse = true;
            });

            expect(backend.connectionsArray.length).toBe(1);
            backend.connectionsArray[0].mockRespond(new Response(new ResponseOptions({
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    pi: 3.14
                })
            })));

            expect(receivedResponse).toBe(true);
        });

        it('emits an error on HTTP error statuses', () => {
            let didThrow = false;
            apiBase.get('/math/raspberrypi' as any, {}).subscribe(undefined, (error: ApiError) => {
                expect(error.name).toBe('ApiError');
                expect(error.response!.status).toBe(404);
                expect(error.response!.statusText).toBe('Not Found');
                expect(error.response!.headers!.get('Content-Type')).toBe('text/plain');
                expect(error.response!.text()).toBe('Endpoint not found');
                didThrow = true;
            });

            backend.connectionsArray[0].mockRespond(new Response(new ResponseOptions({
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({
                    'Content-Type': 'text/plain'
                }),
                body: 'Endpoint not found'
            })));

            expect(didThrow).toBe(true);
        });

        it('emits an error when the request fails with a critical error', () => {
            let thrownError: ApiError = undefined as any;
            apiBase.get('/some/endpoint' as any, {})
                .subscribe(undefined, error => { thrownError = error; });

            backend.connectionsArray[0].mockError(new Error('some unexpected error'));

            expect(thrownError).toBeDefined('no thrownError');
            expect(thrownError.name).toBe('ApiError');
            expect(thrownError.request.method).toBe(RequestMethod.Get, 'method is not GET');
            expect(thrownError.request.url).toMatch(/\/some\/endpoint/);
            expect(thrownError.response).toBeUndefined('response on error object should not be set');
            expect(thrownError.originalError).toBeDefined('originalError is not set');
            expect(thrownError.originalError!.message).toBe('some unexpected error');
        });

        it('maps the returned observable via "toResponseObservable"', () => {
            let called = false;
            const realExtendObservable = apiBase['toResponseObservable'];
            apiBase['toResponseObservable'] = function fakeExtendObservable(observable, url, request) {
                called = true;
                expect(typeof observable.subscribe).toBe('function', 'not an Observable');
                expect(url).toBe('/some/endpoint');
                expect(request.method).toBe(RequestMethod.Get);
                expect(request.url).toBe('/api/v1/some/endpoint');
                return realExtendObservable.call(this, observable, url, request);
            };

            const observable = apiBase.get('/some/endpoint' as any, {});
            expect(typeof observable.mapResponses).toBe('function', 'mapResponses is not defined');
            expect(called).toBe(true);
        });

    });

    describe('post()', () => {
        it('creates a POST request', () => {
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe();
            expect(backend.connectionsArray.length).toBe(1);
            expect(backend.connectionsArray[0].request.method).toBe(RequestMethod.Post);
        });

        it('sets the passed properties on the request', () => {
            apiBase.setLanguageForServerMessages('en');
            apiBase.post('/some-api-endpoint/{uuid}' as any, { uuid: 'some-uuid', pi: 3.14 }, {
                unitTestPostBody: true
            }).subscribe();

            const request = backend.connectionsArray[0].request;
            expect(request.method).toBe(RequestMethod.Post);
            expect(request.url).toBe('/api/v1/some-api-endpoint/some-uuid?pi=3.14');
            expect(request.headers.getAll('Accept')).toEqual(['application/json']);
            expect(request.headers.getAll('Accept-Language')).toEqual(['en']);
            expect(request.headers.getAll('Content-Type')).toEqual(['application/json']);
            expect(request.json()).toEqual({ unitTestPostBody: true });
        });

        it('emits the response body on successful status codes', () => {
            let receivedResponse = false;
            apiBase.post('/math/pi' as any, {}, undefined).subscribe(responseBody => {
                expect(responseBody).toEqual({ pi: 3.14 });
                receivedResponse = true;
            });

            expect(backend.connectionsArray.length).toBe(1);
            backend.connectionsArray[0].mockRespond(new Response(new ResponseOptions({
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    pi: 3.14
                })
            })));

            expect(receivedResponse).toBe(true);
        });

        it('emits an error on error status codes', () => {
            let thrownError: ApiError = undefined as any;
            apiBase.post('/some-api-endpoint' as any, {}, undefined)
                .subscribe(undefined, error => { thrownError = error; });

            backend.connectionsArray[0].mockRespond(new Response(new ResponseOptions({
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({
                    'Content-Type': 'text/plain'
                }),
                body: 'Endpoint not found'
            })));

            expect(thrownError).toBeDefined();
            expect(thrownError.response!.status).toBe(404);
            expect(thrownError.response!.statusText).toBe('Not Found');
            expect(thrownError.response!.headers!.get('Content-Type')).toBe('text/plain');
            expect(thrownError.response!.text()).toBe('Endpoint not found');
        });

        it('emits an error when the request fails with a critical error', () => {
            let thrownError: ApiError = undefined as any;
            apiBase.post('/some-api-endpoint' as any, {}, undefined)
                .subscribe(undefined, error => { thrownError = error; });

            backend.connectionsArray[0].mockError(new Error('some unexpected error'));

            expect(thrownError).toBeDefined('no thrownError');
            expect(thrownError.name).toBe('ApiError');
            expect(thrownError.request.method).toBe(RequestMethod.Post, 'method is not POST');
            expect(thrownError.request.url).toMatch(/some-api-endpoint/);
            expect(thrownError.response).toBeUndefined('response on error object should not be set');
            expect(thrownError.originalError).toBeDefined('originalError is not set');
            expect(thrownError.originalError!.message).toBe('some unexpected error');
        });

        it('maps the returned observable via "toResponseObservable"', () => {
            let called = false;
            const realExtendObservable = apiBase['toResponseObservable'];
            apiBase['toResponseObservable'] = function fakeExtendObservable(observable, url, request) {
                called = true;
                expect(typeof observable.subscribe).toBe('function', 'not an Observable');
                expect(url).toBe('/some-api-endpoint');
                expect(request.method).toBe(RequestMethod.Post);
                expect(request.url).toBe('/api/v1/some-api-endpoint');
                return realExtendObservable.call(this, observable, url, request);
            };

            const observable = apiBase.post('/some-api-endpoint' as any, {}, undefined);
            expect(typeof observable.mapResponses).toBe('function', 'mapResponses is not defined');
            expect(called).toBe(true);
        });

        it('requests with "multipart/form-data" when passed a FormData object', () => {
            let formData: FormData;
            try {
                let file = new File([], 'test-file.txt', { type: 'text/plain' });
                formData = new FormData();
                formData.append('testfile', file);
            } catch (ex) {
                return pending('can not be tested in this environment.');
            }

            apiBase.post('/some-api-endpoint' as any, {}, formData).subscribe();

            const requestBody: FormData = backend.connectionsArray[0].request.getBody();
            expect(requestBody instanceof FormData).toBe(true, 'not a FormData instance');
            expect(requestBody.get('testfile') instanceof File).toBe(true, 'not a File instance');
        });

        it('requests with "multipart/form-data" when passed an object with "File" objects', () => {
            let body: any;
            try {
                let file = new File([], 'test-file.txt', { type: 'text/plain' });
                body = {
                    destination: 'xyz',
                    testfile: file
                };
            } catch (ex) {
                return pending('can not be tested in this environment.');
            }

            apiBase.post('/some-api-endpoint' as any, {}, body).subscribe();

            const requestBody: FormData = backend.connectionsArray[0].request.getBody();
            expect(requestBody instanceof FormData).toBe(true, 'not a FormData instance');
            expect(requestBody.get('testfile') instanceof File).toBe(true, 'not a File instance');
        });

    });

    describe('setLanguageForServerMessages()', () => {

        it('changes the AcceptLanguage header of GET request', () => {
            apiBase.setLanguageForServerMessages('de');
            apiBase.get('/some-api-endpoint' as any, {}).subscribe();

            apiBase.setLanguageForServerMessages('en');
            apiBase.get('/some-api-endpoint' as any, {}).subscribe();

            expect(backend.connectionsArray.map(conn => conn.request.headers.get('Accept-Language')))
                .toEqual(['de', 'en']);
        });

        it('changes the AcceptLanguage header of POST request', () => {
            apiBase.setLanguageForServerMessages('de');
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe();

            apiBase.setLanguageForServerMessages('en');
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe();

            expect(backend.connectionsArray.map(conn => conn.request.headers.get('Accept-Language')))
                .toEqual(['de', 'en']);
        });

    });

    describe('formatUrl', () => {

        it('adds the API base URL to the input', () => {
            const result = apiBase['formatUrl']('/some/api-endpoint', undefined);
            expect(result).toBe('/api/v1/some/api-endpoint');
        });

        it('correctly inserts one parameter', () => {
            const result = apiBase['formatUrl']('/users/{username}/info', {
                username: 'mkkittrick'
            });
            expect(result).toBe('/api/v1/users/mkkittrick/info');
        });

        it('url-encodes inserted parameters', () => {
            const result = apiBase['formatUrl']('/users/{username}/info', {
                username: `'; DROP TABLE users; --`
            });
            expect(result).toBe(`/api/v1/users/'%3B%20DROP%20TABLE%20users%3B%20--/info`);
        });

        it('correctly inserts multiple parameters', () => {
            const result = apiBase['formatUrl']('/users/{username}/{prop}', {
                username: 'mkkittrick',
                prop: 'info'
            });
            expect(result).toBe('/api/v1/users/mkkittrick/info');
        });

        it('throws when not all url parameters are passed', () => {
            let errorWasThrown = false;
            try {
                const result = apiBase['formatUrl']('/search/{query}', {
                    tableName: 'BEKANT'
                });
            } catch (ex) {
                errorWasThrown = true;
            }
            expect(errorWasThrown).toBe(true);
        });

    });

    describe('extendObservable()', () => {

        describe('mapResponses()', () => {

            let subject: Subject<any> = undefined as any;
            let observable: ResponseObservable<any> = undefined as any;
            beforeEach(() => {
                subject = new Subject();
                const request = new Request({
                    method: RequestMethod.Get,
                    url: '/api/v1/some/url'
                });
                observable = apiBase['toResponseObservable'](subject, '/some/url', request);
            });

            it('is added to returned observables', () => {
                expect(typeof observable.mapResponses).toBe('function');
            });

            it('does not subscribe automatically', () => {
                let subscribed = false;
                const inputObservable = new Observable(() => { subscribed = true; });
                observable = apiBase['toResponseObservable'](inputObservable, '/some/url', {} as any as Request);

                expect(subscribed).toBe(false);
                observable.subscribe();
                expect(subscribed).toBe(true);
            });

            it('can map a response code to a result', () => {
                const emittedValues: any[] = [];
                observable.mapResponses({
                    200: responseText => 'twohundred: ' + responseText,
                    201: responseText => 'twohundredone: ' + responseText,
                    404: responseText => 'fourofour: ' + responseText
                })
                .subscribe(v => {
                    emittedValues.push(v);
                });

                expect(emittedValues).toEqual([]);

                subject.next(new Response(new ResponseOptions({
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Everything OK'
                })));

                expect(emittedValues).toEqual([
                    'twohundred: Everything OK'
                ]);

                subject.next(new Response(new ResponseOptions({
                    status: 201,
                    statusText: 'Created',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Something was created'
                })));

                expect(emittedValues).toEqual([
                    'twohundred: Everything OK',
                    'twohundredone: Something was created'
                ]);

                subject.next(new Response(new ResponseOptions({
                    status: 404,
                    statusText: 'Not found',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Something is missing'
                })));

                expect(emittedValues).toEqual([
                    'twohundred: Everything OK',
                    'twohundredone: Something was created',
                    'fourofour: Something is missing'
                ]);
            });

            it('can map a response code to a fixed value', () => {
                const emittedValues: any[] = [];
                observable.mapResponses({
                    200: 'ok200',
                    404: 'notfound404'
                })
                .subscribe(v => {
                    emittedValues.push(v);
                });

                expect(emittedValues).toEqual([]);

                subject.next(new Response(new ResponseOptions({
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Everything OK'
                })));

                expect(emittedValues).toEqual(['ok200']);

                subject.next(new Response(new ResponseOptions({
                    status: 404,
                    statusText: 'Not found',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Something is missing'
                })));

                expect(emittedValues).toEqual(['ok200', 'notfound404']);
            });

            it('has a "success" catchall that can map to a result', () => {
                const emittedValues: any[] = [];
                const emittedErrors: ApiError[] = [];

                observable
                    .mapResponses({
                        success: (text: string) => 'successful: ' + text
                    })
                    .subscribe({
                        next(value) { emittedValues.push(value); },
                        error(error) { emittedErrors.push(error); }
                    });

                expect(emittedValues).toEqual([]);

                subject.next(new Response(new ResponseOptions({
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Everything OK'
                })));

                expect(emittedValues).toEqual(['successful: Everything OK']);

                subject.next(new Response(new ResponseOptions({
                    status: 404,
                    statusText: 'Not found',
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    body: 'Something is missing'
                })));

                expect(emittedValues).toEqual(['successful: Everything OK']);
                expect(emittedErrors.length).toBe(1);
            });

        });

    });

});
