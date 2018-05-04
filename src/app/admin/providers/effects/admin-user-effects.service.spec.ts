import { async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { User } from '../../../common/models/user.model';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';

import { AdminUserEffectsService } from './admin-user-effects.service';

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

    describe('openUser()', () => {
        let mockUser: Partial<User> & { uuid: string };
        let mockUserNode: Partial<MeshNode> & { uuid: string };
        let mockUserNodeSchema: Partial<Schema> & { uuid: string };

        function setUpSpies() {
            api.user.getUser = jasmine.createSpy('user.getUser').and.returnValue(Observable.of(mockUser));
            api.project.getNode = jasmine.createSpy('project.getNode').and.returnValue(Observable.of(mockUserNode));
            api.admin.getSchema = jasmine
                .createSpy('admin.getSchema')
                .and.returnValue(Observable.of(mockUserNodeSchema));
        }

        beforeEach(() => {
            mockUser = { uuid: 'mock_user_uuid' };
            mockUserNode = { uuid: 'mock_user_node_uuid' };
            mockUserNodeSchema = { uuid: 'mock_user_node_schema_uuid' };
        });

        it('calls api.user.getUser with correct arg', () => {
            setUpSpies();

            adminUserEffects.openUser(mockUser.uuid);
            expect(api.user.getUser).toHaveBeenCalledWith({ userUuid: mockUser.uuid });
        });

        it('does not make further API calls if user has no nodeReference', () => {
            setUpSpies();

            adminUserEffects.openUser(mockUser.uuid);
            expect(api.project.getNode).not.toHaveBeenCalled();
            expect(api.admin.getSchema).not.toHaveBeenCalled();
        });

        it('fetches the Node and Schema if user has a nodeReference', () => {
            mockUser.nodeReference = {
                uuid: mockUserNode.uuid,
                projectName: 'test_project',
                schema: {
                    uuid: mockUserNodeSchema.uuid
                }
            } as any;
            setUpSpies();

            adminUserEffects.openUser(mockUser.uuid);
            expect(api.project.getNode).toHaveBeenCalledWith({ nodeUuid: mockUserNode.uuid, project: 'test_project' });
            expect(api.admin.getSchema).toHaveBeenCalledWith({ schemaUuid: mockUserNodeSchema.uuid });
        });

        it(
            'calls openUserSuccess() action with user, node and schema',
            fakeAsync(() => {
                mockUser.nodeReference = {
                    uuid: mockUserNode.uuid,
                    projectName: 'test_project',
                    schema: {
                        uuid: mockUserNodeSchema.uuid
                    }
                } as any;
                setUpSpies();
                adminUserEffects.openUser(mockUser.uuid);
                tick();

                expect(state.actions.adminUsers.openUserSuccess).toHaveBeenCalledWith(
                    mockUser,
                    mockUserNode,
                    mockUserNodeSchema,
                    undefined
                );
            })
        );

        it('returns a promise which resolves with the User object', async(() => {
            setUpSpies();
            adminUserEffects.openUser(mockUser.uuid).then(result => {
                expect(result).toBe(mockUser as any);
            });
        }));

        describe('nodeReference with micronode fields', () => {
            beforeEach(() => {
                mockUser.nodeReference = {
                    uuid: mockUserNode.uuid,
                    projectName: 'test_project',
                    schema: {
                        uuid: mockUserNodeSchema.uuid
                    }
                } as any;
                mockUserNode = {
                    uuid: 'mock_user_node_uuid',
                    fields: {
                        field1: {
                            microschema: {
                                uuid: 'microschema1_uuid',
                                version: '1.0'
                            }
                        },
                        field2: [
                            {
                                microschema: {
                                    uuid: 'microschema2_uuid',
                                    version: '1.0'
                                }
                            },
                            {
                                microschema: {
                                    uuid: 'microschema1_uuid',
                                    version: '1.0'
                                }
                            },
                            {
                                microschema: {
                                    uuid: 'microschema1_uuid',
                                    version: '2.0'
                                }
                            }
                        ]
                    }
                } as any;
                setUpSpies();
                api.admin.getMicroschema = jasmine
                    .createSpy('admin.getMicroschema')
                    .and.callFake(({ microschemaUuid, version }: { microschemaUuid: string; version: string }) => {
                        return Observable.of({ uuid: microschemaUuid, version });
                    });
            });

            it('fetches unique microschemas (uuid & version)', () => {
                adminUserEffects.openUser(mockUser.uuid);
                expect(api.admin.getMicroschema).toHaveBeenCalledTimes(3);
                expect(api.admin.getMicroschema).toHaveBeenCalledWith({
                    microschemaUuid: 'microschema1_uuid',
                    version: '1.0'
                });
                expect(api.admin.getMicroschema).toHaveBeenCalledWith({
                    microschemaUuid: 'microschema1_uuid',
                    version: '2.0'
                });
                expect(api.admin.getMicroschema).toHaveBeenCalledWith({
                    microschemaUuid: 'microschema2_uuid',
                    version: '1.0'
                });
            });

            it(
                'calls openUserSuccess() action with user, node, schema and microschemas',
                fakeAsync(() => {
                    const mockMicroschemas = [
                        { uuid: 'microschema1_uuid', version: '1.0' },
                        { uuid: 'microschema2_uuid', version: '1.0' },
                        { uuid: 'microschema1_uuid', version: '2.0' }
                    ];
                    adminUserEffects.openUser(mockUser.uuid);
                    tick();

                    expect(state.actions.adminUsers.openUserSuccess).toHaveBeenCalledWith(
                        mockUser,
                        mockUserNode,
                        mockUserNodeSchema,
                        mockMicroschemas
                    );
                })
            );
        });
    });

    it('addUserToGroup() adds the new group to the user groups array', () => {
        const mockUser: any = {
            uuid: 'mock_user_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                }
            ]
        };
        api.admin.addUserToGroup = jasmine.createSpy('addUserToGroup').and.returnValue(
            Observable.of({
                name: 'group2',
                uuid: 'group2_uuid'
            })
        );

        adminUserEffects.addUserToGroup(mockUser, 'group2_uuid');

        expect(state.actions.adminUsers.addUserToGroupSuccess).toHaveBeenCalledWith({
            uuid: 'mock_user_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                },
                {
                    name: 'group2',
                    uuid: 'group2_uuid'
                }
            ]
        });
    });

    it('addUsersToGroup() only adds users to groups where they are not already assigned to that group', () => {
        const mockGroup1: any = {
            name: 'group1',
            uuid: 'group1_uuid'
        };
        const mockUser1: any = {
            uuid: 'mock_user1_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                }
            ]
        };
        const mockUser2: any = {
            uuid: 'mock_user2_uuid',
            groups: []
        };

        api.admin.addUserToGroup = jasmine.createSpy('addUserToGroup').and.returnValue(Observable.of(mockGroup1));

        adminUserEffects.addUsersToGroup([mockUser1, mockUser2], mockGroup1.uuid);

        expect(api.admin.addUserToGroup).toHaveBeenCalledWith({ userUuid: mockUser2.uuid, groupUuid: mockGroup1.uuid });
        expect(api.admin.addUserToGroup).toHaveBeenCalledTimes(1);
    });

    it('removeUserFromGroup() removes the group from the user groups array', () => {
        const mockUser: any = {
            uuid: 'mock_user_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                }
            ]
        };
        api.admin.removeUserFromGroup = jasmine.createSpy('removeUserFromGroup').and.returnValue(Observable.of({}));

        adminUserEffects.removeUserFromGroup(mockUser, 'group1_uuid');

        expect(state.actions.adminUsers.removeUserFromGroupSuccess).toHaveBeenCalledWith({
            uuid: 'mock_user_uuid',
            groups: []
        });
    });

    it('removeUserFromGroup() leaves the user intact if the user is not actually assigned to the group', () => {
        const mockUser: any = {
            uuid: 'mock_user_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                }
            ]
        };
        api.admin.removeUserFromGroup = jasmine.createSpy('removeUserFromGroup').and.returnValue(Observable.of({}));

        adminUserEffects.removeUserFromGroup(mockUser, 'group3_uuid');

        expect(state.actions.adminUsers.removeUserFromGroupSuccess).toHaveBeenCalledWith({
            uuid: 'mock_user_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                }
            ]
        });
    });

    it('removeUserFromGroup() only removes users from groups where they are already assigned to that group', () => {
        const mockGroup1: any = {
            name: 'group1',
            uuid: 'group1_uuid'
        };
        const mockUser1: any = {
            uuid: 'mock_user1_uuid',
            groups: [
                {
                    name: 'group1',
                    uuid: 'group1_uuid'
                }
            ]
        };
        const mockUser2: any = {
            uuid: 'mock_user2_uuid',
            groups: []
        };

        api.admin.removeUserFromGroup = jasmine.createSpy('removeUserFromGroup').and.returnValue(Observable.of({}));

        adminUserEffects.removeUsersFromGroup([mockUser1, mockUser2], mockGroup1.uuid);

        expect(api.admin.removeUserFromGroup).toHaveBeenCalledWith({
            userUuid: mockUser1.uuid,
            groupUuid: mockGroup1.uuid
        });
        expect(api.admin.removeUserFromGroup).toHaveBeenCalledTimes(1);
    });
});
