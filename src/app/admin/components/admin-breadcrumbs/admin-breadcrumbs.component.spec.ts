import { Component } from '@angular/core';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { configureComponentTest } from '../../../../testing/configure-component-test';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { AppState } from '../../../state/models/app-state.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';

import { AdminBreadcrumbsComponent } from './admin-breadcrumbs.component';

describe('AdminBreadcrumbsComponent', () => {
    let testingRouter: Router;
    let fixture: ComponentFixture<TestComponent>;
    let instance: AdminBreadcrumbsComponent;
    let appState: TestApplicationState;

    beforeEach(() => {
        configureComponentTest({
            imports: [
                TestStateModule,
                RouterTestingModule.withRoutes([
                    { path: 'foo1', component: MockRouteComponent },
                    {
                        path: 'foo2',
                        component: MockRouteComponent,
                        data: { breadcrumb: 'Foo2' },
                        children: [
                            { path: 'bar1', component: MockRouteComponent },
                            {
                                path: 'bar2',
                                component: MockRouteComponent,
                                data: { breadcrumb: 'Bar2' },
                                children: [
                                    { path: 'baz1', component: MockRouteComponent, data: { breadcrumb: 'Baz1' } }
                                ]
                            }
                        ]
                    },
                    {
                        path: 'foo3',
                        component: MockRouteComponent,
                        data: {
                            breadcrumb: () => 'Foo3'
                        }
                    },
                    {
                        path: 'foo4/:param',
                        component: MockRouteComponent,
                        data: {
                            breadcrumb: (route: ActivatedRouteSnapshot) => {
                                return `Foo4 ${route.params.param}`;
                            }
                        }
                    },
                    {
                        path: 'foo5/:param',
                        component: MockRouteComponent,
                        data: {
                            someData: 'quux',
                            breadcrumb: (route: ActivatedRouteSnapshot) => {
                                return `Foo5 ${route.params.param} ${route.data.someData}`;
                            }
                        }
                    },
                    {
                        path: 'foo6',
                        component: MockRouteComponent,
                        data: {
                            breadcrumb: (route: ActivatedRouteSnapshot, state: AppState) => {
                                return state.adminSchemas.microschemaDetail;
                            }
                        }
                    }
                ]),
                GenticsUICoreModule
            ],
            declarations: [TestComponent, AdminBreadcrumbsComponent, MockRouteComponent, MockContentPortalComponent],
            providers: [{ provide: I18nService, useClass: MockI18nService }]
        });

        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            adminSchemas: {
                microschemaDetail: 'testuuid'
            }
        });

        testingRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(TestComponent);
        instance = fixture.debugElement.query(By.directive(AdminBreadcrumbsComponent)).componentInstance;
        fixture.detectChanges();
    });

    it(
        'ignores route with no breadcrumb defined',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe();
            tick();
            expect(sub.closed).toBe(false, 'Subscription must still be open');
            sub.unsubscribe();
        })
    );

    it(
        'creates links for top level breadcrumb',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([{ text: 'Foo2', route: ['/foo2'] }]);
            });
            testingRouter.navigate(['/foo2']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );

    it(
        'creates links for second level breadcrumb',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([{ text: 'Foo2', route: ['/foo2'] }, { text: 'Bar2', route: ['/foo2', 'bar2'] }]);
            });
            testingRouter.navigate(['/foo2', 'bar2']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );

    it(
        'creates links for third level breadcrumb',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([
                    { text: 'Foo2', route: ['/foo2'] },
                    { text: 'Bar2', route: ['/foo2', 'bar2'] },
                    { text: 'Baz1', route: ['/foo2', 'bar2', 'baz1'] }
                ]);
            });
            testingRouter.navigate(['/foo2', 'bar2', 'baz1']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );

    it(
        'creates link for function breadcrumb',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([{ text: 'Foo3', route: ['/foo3'] }]);
            });
            testingRouter.navigate(['/foo3']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );

    it(
        'creates link for function breadcrumb with params',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([{ text: 'Foo4 hello', route: ['/foo4', 'hello'] }]);
            });
            testingRouter.navigate(['/foo4/hello']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );

    it(
        'creates link for function breadcrumb with params and data args',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([{ text: 'Foo5 hello quux', route: ['/foo5', 'hello'] }]);
            });
            testingRouter.navigate(['/foo5/hello']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );

    it(
        'uses app storage',
        fakeAsync(() => {
            const sub = instance.breadcrumbs$.take(1).subscribe(it => {
                expect(it).toEqual([{ text: 'testuuid', route: ['/foo6'] }]);
            });
            testingRouter.navigate(['/foo6']);
            tick();
            expect(sub.closed).toBe(true, 'Subscription must be closed');
        })
    );
});

@Component({
    selector: 'mesh-test-component',
    template: `<mesh-admin-breadcrumbs></mesh-admin-breadcrumbs>
    <router-outlet></router-outlet>`
})
class TestComponent {}

@Component({
    selector: 'mesh-mock-route-component',
    template: `<router-outlet></router-outlet>`
})
class MockRouteComponent {}

@Component({
    selector: 'mesh-content-portal',
    template: ``
})
class MockContentPortalComponent {}
