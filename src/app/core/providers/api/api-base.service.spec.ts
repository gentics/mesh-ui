import { HttpClientModule, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject, Subscription } from 'rxjs';

import { I18nNotification } from '../i18n-notification/i18n-notification.service';
import { MockI18nNotification } from '../i18n-notification/i18n-notification.service.mock';

import { ApiBase, HttpResponseObservable } from './api-base.service';
import { ApiError } from './api-error';

const ANY = () => true;

describe('ApiBase', () => {
    let apiBase: ApiBase;
    let backend: HttpTestingController;
    let subscription: Subscription | undefined;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiBase, { provide: I18nNotification, useClass: MockI18nNotification }]
        });

        apiBase = TestBed.get(ApiBase);
        backend = TestBed.get(HttpTestingController);
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
            const req = backend.expectOne('/some-api-endpoint');
            expect(req.request.method).toEqual('GET');
        });

        it('sets the passed properties on the request', () => {
            apiBase.setLanguageForServerMessages('en');
            apiBase
                .get('/groups/{groupUuid}', {
                    groupUuid: 'some-uuid',
                    role: 'some-role'
                })
                .subscribe();

            const request = backend.expectOne('/api/v1/groups/some-uuid?role=some-role').request;

            expect(request.method).toBe('GET');
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

            const request = backend.expectOne('/math/pi');
            request.flush({
                pi: 3.14
            });

            expect(receivedResponse).toBe(true);
        });

        it('emits an error on HTTP error statuses', () => {
            let didThrow = false;
            apiBase.get('/math/raspberrypi' as any, {}).subscribe(undefined, (error: ApiError) => {
                expect(error.name).toBe('ApiError');
                expect(error.response!.status).toBe(404);
                expect(error.response!.statusText).toBe('Not Found');
                expect(error.response!.headers!.get('Content-Type')).toBe('text/plain');
                expect(error.response!.body).toBe('Endpoint not found');
                didThrow = true;
            });

            const req = backend.expectOne('/math/raspberrypi');
            req.flush('Endpoint not found', {
                status: 404,
                statusText: 'Not Found'
            });

            expect(didThrow).toBe(true);
        });

        it('emits an error when the request fails with a critical error', () => {
            let thrownError: ApiError = undefined as any;
            apiBase.get('/some/endpoint' as any, {}).subscribe(undefined, error => {
                thrownError = error;
            });

            backend.expectOne('/some/endpoint').error(new ErrorEvent('some unexpected error'));

            expect(thrownError).toBeDefined('no thrownError');
            expect(thrownError.name).toBe('ApiError');
            expect(thrownError.request.method).toBe('GET', 'method is not GET');
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
                expect(request.method).toBe('GET');
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
            expect(backend.expectOne(ANY).request.method).toBe('POST');
        });

        it('sets the passed properties on the request', () => {
            apiBase.setLanguageForServerMessages('en');
            apiBase
                .post(
                    '/some-api-endpoint/{uuid}' as any,
                    { uuid: 'some-uuid', pi: 3.14 },
                    {
                        unitTestPostBody: true
                    }
                )
                .subscribe();

            const request = backend.expectOne(ANY).request;
            expect(request.method).toBe('POST');
            expect(request.url).toBe('/api/v1/some-api-endpoint/some-uuid?pi=3.14');
            expect(request.headers.getAll('Accept')).toEqual(['application/json']);
            expect(request.headers.getAll('Accept-Language')).toEqual(['en']);
            expect(request.headers.getAll('Content-Type')).toEqual(['application/json']);
            expect(request.body).toEqual({ unitTestPostBody: true });
        });

        it('emits the response body on successful status codes', () => {
            let receivedResponse = false;
            apiBase.post('/math/pi' as any, {}, undefined).subscribe(responseBody => {
                expect(responseBody).toEqual({ pi: 3.14 });
                receivedResponse = true;
            });

            backend.expectOne(ANY).flush({
                pi: 3.14
            });

            expect(receivedResponse).toBe(true);
        });

        it('emits an error on error status codes', () => {
            let thrownError: ApiError = undefined as any;
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe(undefined, error => {
                thrownError = error;
            });

            backend.expectOne(ANY).flush('Endpoint not found', {
                status: 404,
                statusText: 'Not Found',
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            expect(thrownError).toBeDefined();
            expect(thrownError.response!.status).toBe(404);
            expect(thrownError.response!.statusText).toBe('Not Found');
            expect(thrownError.response!.headers!.get('Content-Type')).toBe('text/plain');
            expect(thrownError.response!.body).toBe('Endpoint not found');
        });

        it('emits an error when the request fails with a critical error', () => {
            let thrownError: ApiError = undefined as any;
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe(undefined, error => {
                thrownError = error;
            });

            backend.expectOne(ANY).error(new ErrorEvent('some unexpected error'));

            expect(thrownError).toBeDefined('no thrownError');
            expect(thrownError.name).toBe('ApiError');
            expect(thrownError.request.method).toBe('POST', 'method is not POST');
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
                expect(request.method).toBe('POST');
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
                const file = new File([], 'test-file.txt', { type: 'text/plain' });
                formData = new FormData();
                formData.append('testfile', file);
            } catch (ex) {
                return pending('can not be tested in this environment.');
            }

            apiBase.post('/some-api-endpoint' as any, {}, formData).subscribe();

            const requestBody: FormData = backend.expectOne(ANY).request.body;
            expect(requestBody instanceof FormData).toBe(true, 'not a FormData instance');
            expect(requestBody.get('testfile') instanceof File).toBe(true, 'not a File instance');
        });

        it('requests with "multipart/form-data" when passed an object with "File" objects', () => {
            let body: any;
            try {
                const file = new File([], 'test-file.txt', { type: 'text/plain' });
                body = {
                    destination: 'xyz',
                    testfile: file
                };
            } catch (ex) {
                return pending('can not be tested in this environment.');
            }

            apiBase.post('/some-api-endpoint' as any, {}, body).subscribe();

            const requestBody: FormData = backend.expectOne(ANY).request.body;
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

            expect(backend.match(ANY).map(conn => conn.request.headers.get('Accept-Language'))).toEqual(['de', 'en']);
        });

        it('changes the AcceptLanguage header of POST request', () => {
            apiBase.setLanguageForServerMessages('de');
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe();

            apiBase.setLanguageForServerMessages('en');
            apiBase.post('/some-api-endpoint' as any, {}, undefined).subscribe();

            expect(backend.match(ANY).map(conn => conn.request.headers.get('Accept-Language'))).toEqual(['de', 'en']);
        });
    });

    describe('formatUrl', () => {
        it('adds the API base URL to the input', () => {
            const result = apiBase.formatUrl('/some/api-endpoint', undefined);
            expect(result).toBe('/api/v1/some/api-endpoint');
        });

        it('correctly inserts one parameter', () => {
            const result = apiBase.formatUrl('/users/{username}/info', {
                username: 'mkkittrick'
            });
            expect(result).toBe('/api/v1/users/mkkittrick/info');
        });

        it('url-encodes inserted parameters', () => {
            const result = apiBase.formatUrl('/users/{username}/info', {
                username: `'; DROP TABLE users; --`
            });
            expect(result).toBe(`/api/v1/users/'%3B%20DROP%20TABLE%20users%3B%20--/info`);
        });

        it('correctly inserts multiple parameters', () => {
            const result = apiBase.formatUrl('/users/{username}/{prop}', {
                username: 'mkkittrick',
                prop: 'info'
            });
            expect(result).toBe('/api/v1/users/mkkittrick/info');
        });

        it('adds un-parameterized values as query params', () => {
            const result = apiBase.formatUrl('/users', {
                version: '1.1',
                lang: 'en'
            });
            expect(result).toBe('/api/v1/users?version=1.1&lang=en');
        });

        it('omits undefined query params', () => {
            const result = apiBase.formatUrl('/users', {
                version: '1.1',
                lang: undefined as any
            });
            expect(result).toBe('/api/v1/users?version=1.1');
        });

        it('throws when not all url parameters are passed', () => {
            let errorWasThrown = false;
            try {
                const result = apiBase.formatUrl('/search/{query}', {
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
            let observable: HttpResponseObservable<any> = undefined as any;
            beforeEach(() => {
                subject = new Subject();
                const request = new HttpRequest('GET', '/api/v1/some/url');
                observable = apiBase['toResponseObservable'](subject, '/some/url', request);
            });

            it('is added to returned observables', () => {
                expect(typeof observable.mapResponses).toBe('function');
            });

            it('does not subscribe automatically', () => {
                let subscribed = false;
                const inputObservable = new Observable<any>(() => {
                    subscribed = true;
                });
                observable = apiBase['toResponseObservable'](inputObservable, '/some/url', ({} as any) as HttpRequest<
                    any
                >);

                expect(subscribed).toBe(false);
                observable.subscribe();
                expect(subscribed).toBe(true);
            });

            it('can map a response code to a result', () => {
                const emittedValues: any[] = [];
                observable
                    .mapResponses({
                        200: (responseText: string) => 'twohundred: ' + responseText,
                        201: (responseText: string) => 'twohundredone: ' + responseText,
                        404: (responseText: string) => 'fourofour: ' + responseText
                    })
                    .subscribe(v => {
                        emittedValues.push(v);
                    });

                expect(emittedValues).toEqual([]);

                subject.next(
                    new HttpResponse({
                        status: 200,
                        statusText: 'OK',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Everything OK'
                    })
                );

                expect(emittedValues).toEqual(['twohundred: Everything OK']);

                subject.next(
                    new HttpResponse({
                        status: 201,
                        statusText: 'Created',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Something was created'
                    })
                );

                expect(emittedValues).toEqual(['twohundred: Everything OK', 'twohundredone: Something was created']);

                subject.next(
                    new HttpResponse({
                        status: 404,
                        statusText: 'Not found',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Something is missing'
                    })
                );

                expect(emittedValues).toEqual([
                    'twohundred: Everything OK',
                    'twohundredone: Something was created',
                    'fourofour: Something is missing'
                ]);
            });

            it('can map a response code to a fixed value', () => {
                const emittedValues: any[] = [];
                observable
                    .mapResponses({
                        200: 'ok200',
                        404: 'notfound404'
                    })
                    .subscribe(v => {
                        emittedValues.push(v);
                    });

                expect(emittedValues).toEqual([]);

                subject.next(
                    new HttpResponse({
                        status: 200,
                        statusText: 'OK',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Everything OK'
                    })
                );

                expect(emittedValues).toEqual(['ok200']);

                subject.next(
                    new HttpResponse({
                        status: 404,
                        statusText: 'Not found',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Something is missing'
                    })
                );

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
                        next(value) {
                            emittedValues.push(value);
                        },
                        error(error) {
                            emittedErrors.push(error);
                        }
                    });

                expect(emittedValues).toEqual([]);

                subject.next(
                    new HttpResponse({
                        status: 200,
                        statusText: 'OK',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Everything OK'
                    })
                );

                expect(emittedValues).toEqual(['successful: Everything OK']);

                subject.next(
                    new HttpResponse({
                        status: 404,
                        statusText: 'Not found',
                        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
                        body: 'Something is missing'
                    })
                );

                expect(emittedValues).toEqual(['successful: Everything OK']);
                expect(emittedErrors.length).toBe(1);
            });
        });
    });
});
