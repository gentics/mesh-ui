import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InputField } from 'gentics-ui-core';

import { UserDetailComponent } from './user-detail.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';

describe('UserDetailComponent', () => {
    let component: UserDetailComponent;
    let fixture: ComponentFixture<UserDetailComponent>;

    beforeEach(async(() => {
        configureComponentTest({
            declarations: [
                UserDetailComponent,
                InputField
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
                ReactiveFormsModule
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
