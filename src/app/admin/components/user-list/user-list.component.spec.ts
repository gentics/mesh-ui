import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GenticsUICoreModule, ModalService } from 'gentics-ui-core';
import { HighlightComponent } from 'src/app/shared/components/highlight/highlight.component';

import { configureComponentTest } from '../../../../testing/configure-component-test';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { ADMIN_GROUP_NAME, ADMIN_USER_NAME } from '../../../common/constants';
import { Group } from '../../../common/models/group.model';
import { User } from '../../../common/models/user.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { MeshDialogsService } from '../../../core/providers/dialogs/mesh-dialogs.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { MockAdminListComponent } from '../admin-list/admin-list.component.mock';

import { UserListComponent } from './user-list.component';

type MockUser = Partial<User> & { uuid: string };
type MockGroup = Partial<Group> & { uuid: string };

describe('UserListComponent', () => {
    let instance: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;
    let adminUserEffects: MockAdminUserEffectsService;
    let state: TestApplicationState;
    let mockModalService: MockModalService;

    let mockAdminUser: MockUser;
    let mockUser1: MockUser;
    let mockUser2: MockUser;
    let mockAdminGroup: MockGroup;
    let mockGroup1: MockGroup;

    beforeEach(async(() => {
        configureComponentTest({
            imports: [
                GenticsUICoreModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                TestStateModule,
                ReactiveFormsModule
            ],
            declarations: [
                UserListComponent,
                ChipComponent,
                MockAdminListComponent,
                MockMeshUserGroupSelectComponent,
                HighlightComponent
            ],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                { provide: AdminUserEffectsService, useClass: MockAdminUserEffectsService },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                MeshDialogsService
            ]
        });

        adminUserEffects = TestBed.get(AdminUserEffectsService);
        state = TestBed.get(ApplicationStateService);
        mockModalService = TestBed.get(ModalService);

        state.trackAllActionCalls();

        mockAdminGroup = {
            name: ADMIN_GROUP_NAME,
            uuid: 'admin_group_uuid'
        };
        mockGroup1 = {
            name: 'group1',
            uuid: 'group1_uuid'
        };
        mockAdminUser = {
            username: ADMIN_USER_NAME,
            uuid: 'admin_user_uuid',
            groups: [mockAdminGroup] as any,
            permissions: { delete: true } as any
        };
        mockUser1 = {
            username: 'user1',
            uuid: 'user1_uuid',
            groups: [mockGroup1] as any,
            permissions: { delete: true } as any
        };
        mockUser2 = {
            username: 'user2',
            uuid: 'user2_uuid',
            groups: [],
            permissions: { delete: true } as any
        };

        fixture = TestBed.createComponent(UserListComponent);
        instance = fixture.componentInstance;
    }));

    it('should create', () => {
        setMockState();
        expect(instance).toBeTruthy();
    });

    describe('deleteUsers() ', () => {
        it('displays a confirmation modal', fakeAsync(() => {
            setMockState();
            fixture.detectChanges();

            instance.deleteUsers([mockUser1 as User, mockUser2 as User]);
            tick();

            expect(mockModalService.dialogSpy).toHaveBeenCalled();
        }));

        it('does not display a confirmation modal if no users are deletable', fakeAsync(() => {
            setMockState();
            fixture.detectChanges();

            instance.deleteUsers([mockAdminUser as User]);
            tick();

            expect(mockModalService.dialogSpy).not.toHaveBeenCalled();
        }));

        it('does not call adminUserEffects.deleteUser() for admin user', fakeAsync(() => {
            setMockState();
            fixture.detectChanges();

            instance.deleteUsers([mockAdminUser as User]);
            tick();
            // no modal will be called as array filtered by permission will be empty and stop method execution
            expect(mockModalService.dialogSpy).not.toHaveBeenCalled();
            expect(adminUserEffects.deleteUser).not.toHaveBeenCalled();
        }));

        it('does not call adminUserEffects.deleteUser() for user for which there is no delete permission', fakeAsync(() => {
            (mockUser1 as any).permissions = { delete: false };
            setMockState();
            fixture.detectChanges();

            instance.deleteUsers([mockUser1 as User]);
            tick();
            // no modal will be called as array filtered by permission will be empty and stop method execution
            expect(mockModalService.dialogSpy).not.toHaveBeenCalled();
            expect(adminUserEffects.deleteUser).not.toHaveBeenCalled();
        }));
    });

    function setMockState(): void {
        state.mockState({
            entities: {
                user: {
                    [mockAdminUser.uuid]: mockAdminUser as any,
                    [mockUser1.uuid]: mockUser1 as any,
                    [mockUser2.uuid]: mockUser2 as any
                },
                group: {
                    [mockAdminGroup.uuid]: mockAdminGroup as any,
                    [mockGroup1.uuid]: mockGroup1 as any
                }
            },
            adminUsers: {
                userList: [mockAdminUser.uuid, mockUser1.uuid, mockUser2.uuid],
                filterGroups: [],
                filterTerm: '',
                pagination: {
                    currentPage: 1,
                    itemsPerPage: 25,
                    totalItems: null
                }
            }
        });
    }
});

@Component({
    selector: 'mesh-user-group-select',
    template: ``
})
class MockMeshUserGroupSelectComponent {
    @Input() groups: any[];
    @Input() omit: Array<any> = [];
    @Input() title: any;
    @Input() icon: any;
    @Output() select = new EventEmitter<any>();
}

class MockAdminUserEffectsService {
    loadUsers = jasmine.createSpy('loadUsers');
    loadAllUsers = jasmine.createSpy('loadAllUsers');
    loadAllGroups = jasmine.createSpy('loadAllGroups');
    setListPagination = jasmine.createSpy('setListPagination');
    setFilterTerm = jasmine.createSpy('setFilterTerm');
    setFilterGroups = jasmine.createSpy('setFilterGroups');
    deleteUser = jasmine.createSpy('deleteUser');
}
