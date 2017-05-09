import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { AdminBreadcrumbsComponent } from './admin-breadcrumbs.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { By } from '@angular/platform-browser';

describe('AdminBreadcrumbsComponent', () => {

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
                            breadcrumb: (data, params) => {
                                return `Foo4 ${params.param}`;
                            }
                        }
                    },
                    {
                        path: 'foo5/:param',
                        component: MockRouteComponent,
                        data: {
                            someData: 'quux',
                            breadcrumb: (data, params) => {
                                return `Foo5 ${params.param} ${data.someData}`;
                            }
                        }
                    }
                ]),
                GenticsUICoreModule
            ],
            declarations: [
                AdminBreadcrumbsComponent,
                MockRouteComponent,
                TestComponent
            ]
        });

        testingRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(TestComponent);
        instance = fixture.debugElement.query(By.directive(AdminBreadcrumbsComponent)).componentInstance;
        fixture.detectChanges();
    });

    it('ignores route with no breadcrumb defined', fakeAsync(() => {
        testingRouter.navigate(['/foo1']);
        tick();
        expect(instance.breadcrumbs).toEqual([]);
    }));

    it('creates links for top level breadcrumb', fakeAsync(() => {
        testingRouter.navigate(['/foo2']);
        tick();
        expect(instance.breadcrumbs).toEqual([
            { text: 'Foo2', route: ['foo2'] }
        ]);
    }));

    it('creates links for second level breadcrumb', fakeAsync(() => {
        testingRouter.navigate(['/foo2', 'bar2']);
        tick();
        expect(instance.breadcrumbs).toEqual([
            { text: 'Foo2', route: ['foo2'] },
            { text: 'Bar2', route: ['foo2', 'bar2'] }
        ]);
    }));

    it('creates links for third level breadcrumb', fakeAsync(() => {
        testingRouter.navigate(['/foo2', 'bar2', 'baz1']);
        tick();
        expect(instance.breadcrumbs).toEqual([
            { text: 'Foo2', route: ['foo2'] },
            { text: 'Bar2', route: ['foo2', 'bar2'] },
            { text: 'Baz1', route: ['foo2', 'bar2', 'baz1'] }
        ]);
    }));

    it('creates link for function breadcrumb', fakeAsync(() => {
        testingRouter.navigate(['/foo3']);
        tick();
        expect(instance.breadcrumbs).toEqual([
            { text: 'Foo3', route: ['foo3'] }
        ]);
    }));

    it('creates link for function breadcrumb with params', fakeAsync(() => {
        testingRouter.navigate(['/foo4/hello']);
        tick();
        expect(instance.breadcrumbs).toEqual([
            { text: 'Foo4 hello', route: ['foo4', 'hello'] }
        ]);
    }));

    it('creates link for function breadcrumb with params and data args', fakeAsync(() => {
        testingRouter.navigate(['/foo5/hello']);
        tick();
        expect(instance.breadcrumbs).toEqual([
            { text: 'Foo5 hello quux', route: ['foo5', 'hello'] }
        ]);
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
