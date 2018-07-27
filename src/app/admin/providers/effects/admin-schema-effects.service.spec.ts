import { TestBed } from '@angular/core/testing';
import { Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/providers/api/api.service';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ProjectAssignments } from '../../../state/models/admin-schemas-state.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';

import { AdminSchemaEffectsService } from './admin-schema-effects.service';

describe('AdminSchemaEffects', () => {
    let adminSchemaEffects: AdminSchemaEffectsService;
    let state: TestApplicationState;
    let apiServiceSpy: any;
    let i18nNotificationSpy;

    beforeEach(() => {
        apiServiceSpy = {
            project: {
                getProjects: jasmine.createSpy('getProject'),
                getProjectSchemas: jasmine.createSpy('getProjectSchemas')
            }
        };
        i18nNotificationSpy = jasmine.createSpyObj('i18n notifications', ['show']);

        TestBed.configureTestingModule({
            providers: [
                AdminSchemaEffectsService,
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: I18nNotification, useValue: i18nNotificationSpy },
                { provide: Notification, useValue: {} }
            ]
        });

        state = TestBed.get(ApplicationStateService);
        adminSchemaEffects = TestBed.get(AdminSchemaEffectsService);

        state.trackAllActionCalls();
    });

    describe('loadEntityAssignments', () => {
        const projects = {
            data: [{ uuid: 'uuid1', name: 'project1' }, { uuid: 'uuid2', name: 'project2' }]
        };

        it('sends empty object on no projects', async () => {
            apiServiceSpy.project.getProjects.and.returnValue(Observable.of({ data: [] }));
            await adminSchemaEffects.loadEntityAssignments('schema', 'test');
            expect(state.actions.adminSchemas.fetchEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(state.actions.adminSchemas.fetchEntityAssignmentsSuccess).toHaveBeenCalledWith({});
        });

        it('returns correct assignments 1', async () => {
            const expected: ProjectAssignments = {
                uuid1: true,
                uuid2: true
            };

            apiServiceSpy.project.getProjects.and.returnValue(Observable.of(projects));
            apiServiceSpy.project.getProjectSchemas.and.returnValue(Observable.of(schemasResponse(['test'])));
            await adminSchemaEffects.loadEntityAssignments('schema', 'test');
            expect(state.actions.adminSchemas.fetchEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(state.actions.adminSchemas.fetchEntityAssignmentsSuccess).toHaveBeenCalledWith(expected);
        });

        it('returns correct assignments 2', async () => {
            const expected: ProjectAssignments = {
                uuid1: false,
                uuid2: true
            };

            apiServiceSpy.project.getProjects.and.returnValue(Observable.of(projects));
            apiServiceSpy.project.getProjectSchemas.and.returnValues(
                Observable.of(schemasResponse([])),
                Observable.of(schemasResponse(['test']))
            );
            await adminSchemaEffects.loadEntityAssignments('schema', 'test');
            expect(state.actions.adminSchemas.fetchEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(state.actions.adminSchemas.fetchEntityAssignmentsSuccess).toHaveBeenCalledWith(expected);
        });

        it('returns correct assignments 3', async () => {
            const expected: ProjectAssignments = {
                uuid1: false,
                uuid2: false
            };

            apiServiceSpy.project.getProjects.and.returnValue(Observable.of(projects));
            apiServiceSpy.project.getProjectSchemas.and.returnValue(Observable.of(schemasResponse([])));
            await adminSchemaEffects.loadEntityAssignments('schema', 'test');
            expect(state.actions.adminSchemas.fetchEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(state.actions.adminSchemas.fetchEntityAssignmentsSuccess).toHaveBeenCalledWith(expected);
        });

        function schemasResponse(projectUuids: string[]) {
            return {
                data: projectUuids.map(uuid => ({ uuid }))
            };
        }
    });
});
