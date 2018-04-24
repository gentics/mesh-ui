import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Notification } from 'gentics-ui-core';

import { AdminUserEffectsService } from './admin-user-effects.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApiService } from '../../../core/providers/api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';

describe('AdminUserEffects', () => {
    let adminUserEffects: AdminUserEffectsService;
    let state: TestApplicationState;
    let i18nNotificationSpy;
    let api: MockApiService;

    beforeEach(() => {
        i18nNotificationSpy = jasmine.createSpyObj('i18n notifications', ['show']);


        TestBed.configureTestingModule({
            providers: [
                AdminUserEffectsService,
                { provide: ApiService, useClass: MockApiService },
                { provide: I18nNotification, useValue: i18nNotificationSpy },
                { provide: Notification, useValue: {} }
            ],
            imports: [TestStateModule]
        });

        state = TestBed.get(ApplicationStateService);
        api = TestBed.get(ApiService);
        adminUserEffects = TestBed.get(AdminUserEffectsService);

        state.trackAllActionCalls();
    });

    it('addUserToGroup() adds the new group to the user groups array', () => {
        const mockUser: any = {
            uuid: 'mock_user_uuid',
            groups: [{
                name: 'group1',
                uuid: 'group1_uuid'
            }]
        };
        api.admin.addUserToGroup = jasmine.createSpy('addUserToGroup')
            .and.returnValue(Observable.of({
                name: 'group2',
                uuid: 'group2_uuid'
            }));

        adminUserEffects.addUserToGroup(mockUser, 'group2_uuid');

        expect(state.actions.adminUsers.addUserToGroupSuccess).toHaveBeenCalledWith({
            uuid: 'mock_user_uuid',
            groups: [{
                name: 'group1',
                uuid: 'group1_uuid'
            }, {
                name: 'group2',
                uuid: 'group2_uuid'
            }]
        });
    });

    it('removeUserFromGroup() removes the group from the user groups array', () => {
        const mockUser: any = {
            uuid: 'mock_user_uuid',
            groups: [{
                name: 'group1',
                uuid: 'group1_uuid'
            }]
        };
        api.admin.removeUserFromGroup = jasmine.createSpy('removeUserFromGroup')
            .and.returnValue(Observable.of({}));

        adminUserEffects.removeUserFromGroup(mockUser, 'group1_uuid');

        expect(state.actions.adminUsers.removeUserFromGroupSuccess).toHaveBeenCalledWith({
            uuid: 'mock_user_uuid',
            groups: []
        });
    });
});

