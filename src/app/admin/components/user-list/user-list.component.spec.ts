import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            declarations: [
                UserListComponent,
                MockAdminListComponent
            ],
            providers: [
                EntitiesService,
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: AdminUserEffectsService, useClass: MockAdminUserEffectsService },
                { provide: ConfigService, useClass: MockConfigService }
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
