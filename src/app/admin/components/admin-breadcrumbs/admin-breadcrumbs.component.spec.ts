import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, tick, async } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { AdminBreadcrumbsComponent } from './admin-breadcrumbs.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { By } from '@angular/platform-browser';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

fdescribe('AdminBreadcrumbsComponent', () => {

    let testingRouter: Router;
    let fixture: ComponentFixture<TestComponent>;
    let instance: AdminBreadcrumbsComponent;

    beforeEach(() => {
        configureComponentTest({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'foo1',  component: MockRouteComponent },
                    { path: 'foo2',  component: MockRouteComponent, data: { breadcrumb: 'Foo2' }, children: [
                        { path: 'bar1', component: MockRouteComponent },
                        { path: 'bar2', component: MockRouteComponent, data: { breadcrumb: 'Bar2' }, children: [
                            { path: 'baz1', component: MockRouteComponent, data: { breadcrumb: 'Baz1' } }
                        ] }
                    ] },
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
                            breadcrumb: (route) => {
                                return `Foo4 ${route.params.param}`;
                            }
                        }
                    },
                    {
                        path: 'foo5/:param',
                        component: MockRouteComponent,
                        data: {
                            someData: 'quux',
                            breadcrumb: (route) => {
                                return `Foo5 ${route.params.param} ${route.data.someData}`;
                            }
                        }
                    }
                ]),
                GenticsUICoreModule
            ],
            declarations: [
                AdminBreadcrumbsComponent,
                MockRouteComponent,
                TestComponent,
            ],
            providers: [
                ApplicationStateService
            ]
        });

        testingRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(TestComponent);
        instance = fixture.debugElement.query(By.directive(AdminBreadcrumbsComponent)).componentInstance;
        fixture.detectChanges();
    });

    it('ignores route with no breadcrumb defined', fakeAsync(() => {
        const sub = instance.breadcrumbs$.take(1).subscribe();
        tick();
        expect(sub.closed).toBe(false, 'Subscription must still be open');
        sub.unsubscribe();
    }));

    it('creates links for top level breadcrumb', fakeAsync(() => {
        const sub = instance.breadcrumbs$.take(1).subscribe(it => {
            expect(it).toEqual([
                { text: 'Foo2', route: ['/foo2'] }
            ]);
        });
        testingRouter.navigate(['/foo2']);
        tick();
        expect(sub.closed).toBe(true, 'Subscription must be closed');
    }));

    it('creates links for second level breadcrumb', fakeAsync(() => {
        const sub = instance.breadcrumbs$.take(1).subscribe(it => {
            expect(it).toEqual([
                { text: 'Foo2', route: ['/foo2'] },
                { text: 'Bar2', route: ['/foo2', 'bar2'] }
            ]);
        });
        testingRouter.navigate(['/foo2', 'bar2']);
        tick();
        expect(sub.closed).toBe(true, 'Subscription must be closed');
    }));

    it('creates links for third level breadcrumb', fakeAsync(() => {
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
    }));

    it('creates link for function breadcrumb', fakeAsync(() => {
        const sub = instance.breadcrumbs$.take(1).subscribe(it => {
            expect(it).toEqual([
                { text: 'Foo3', route: ['/foo3'] }
            ]);
        });
        testingRouter.navigate(['/foo3']);
        tick();
        expect(sub.closed).toBe(true, 'Subscription must be closed');
    }));

    it('creates link for function breadcrumb with params', fakeAsync(() => {
        const sub = instance.breadcrumbs$.take(1).subscribe(it => {
            expect(it).toEqual([
                { text: 'Foo4 hello', route: ['/foo4', 'hello'] }
            ]);
        });
        testingRouter.navigate(['/foo4/hello']);
        tick();
        expect(sub.closed).toBe(true, 'Subscription must be closed');
    }));

    it('creates link for function breadcrumb with params and data args', fakeAsync(() => {
        const sub = instance.breadcrumbs$.take(1).subscribe(it => {
            expect(it).toEqual([
                { text: 'Foo5 hello quux', route: ['/foo5', 'hello'] }
            ]);
        });
        testingRouter.navigate(['/foo5/hello']);
        tick();
        expect(sub.closed).toBe(true, 'Subscription must be closed');
    }));

});

@Component({
    selector: 'test-component',
    template: `<admin-breadcrumbs></admin-breadcrumbs>
    <router-outlet></router-outlet>`
})
class TestComponent {

}

@Component({
    selector: 'mock-route-component',
    template: `<router-outlet></router-outlet>`
})
class MockRouteComponent {

}
