import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Button, InputField } from 'gentics-ui-core';

import { UserDetailComponent } from './user-detail.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';

describe('UserDetailComponent', () => {
    let component: UserDetailComponent;
    let fixture: ComponentFixture<UserDetailComponent>;

    beforeEach(async(() => {
        configureComponentTest({
            declarations: [
                UserDetailComponent,
                InputField,
                Button
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
                ReactiveFormsModule
            ],
            providers: [
                { provide: AdminUserEffectsService, useClass: MockAdminUserEffectsService }
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

class MockAdminUserEffectsService {}
