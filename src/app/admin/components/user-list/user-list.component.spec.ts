import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Icon } from 'gentics-ui-core';

import { UserListComponent } from './user-list.component';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { TestStateModule } from '../../../state/testing/test-state.module';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                TestStateModule
            ],
            declarations: [
                UserListComponent,
                MockAdminListComponent,
                ChipComponent,
                Icon
            ],
            providers: [
                { provide: AdminUserEffectsService, useClass: MockAdminUserEffectsService }
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
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
