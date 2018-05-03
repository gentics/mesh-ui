import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShellComponent } from './admin-shell.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestStateModule } from '../../../state/testing/test-state.module';

describe('AdminShellComponent', () => {

    let comp: AdminShellComponent;
    let fixture: ComponentFixture<AdminShellComponent>;

    beforeEach(() => {
        configureComponentTest({
            imports: [SharedModule, RouterTestingModule, TestStateModule],
            declarations: [AdminShellComponent, MockAdminBreadcrumbsComponent],
            providers: [ApplicationStateService]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminShellComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});

@Component({
    selector: 'mesh-admin-breadcrumbs',
    template: ''
})
class MockAdminBreadcrumbsComponent {}
