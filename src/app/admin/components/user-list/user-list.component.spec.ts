import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Icon, OverlayHostService, Select } from 'gentics-ui-core';

import { UserListComponent } from './user-list.component';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async(() => {
        configureComponentTest({
            imports: [
                RouterTestingModule.withRoutes([]),
                TestStateModule,
                ReactiveFormsModule,
                Input,
                Icon,
                Select
            ],
            declarations: [
                UserListComponent,
                MockAdminListComponent,
                ChipComponent
            ],
            providers: [
                OverlayHostService,
                { provide: AdminUserEffectsService, useClass: MockAdminUserEffectsService }
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('should create', () => {
        expect(component).toBeTruthy();
    });*/
});

@Component({
    selector: 'mesh-admin-list',
    template: ``
})
class MockAdminListComponent {
    @Input() items: any;
    @Input() itemsPerPage: any;
    @Input() totalItems: any;
    @Input() currentPage: any;
    @Output() pageChange = new EventEmitter<any>();
}

class MockAdminUserEffectsService {
    loadUsers = jasmine.createSpy('loadUsers');
}
