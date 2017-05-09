import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminShellComponent } from './admin-shell.component';
import { AdminBreadcrumbsComponent } from '../admin-breadcrumbs/admin-breadcrumbs.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { SharedModule } from '../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminShellComponent', () => {

    let comp: AdminShellComponent;
    let fixture: ComponentFixture<AdminShellComponent>;

    beforeEach(() => {
        configureComponentTest({
            imports: [SharedModule, RouterTestingModule],
            declarations: [AdminShellComponent, AdminBreadcrumbsComponent]
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
