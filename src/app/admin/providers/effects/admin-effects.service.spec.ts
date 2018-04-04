import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../core/providers/api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { Notification, GenticsUICoreModule } from 'gentics-ui-core';
import { AdminEffectsService } from './admin-effects.service';
import { Observable } from 'rxjs/Observable';
import { ProjectAssignments } from '../../../state/models/admin-state.model';

describe('Admin Effects', () => {
    let adminEffects: AdminEffectsService;
    let adminActionsSpy;
    let apiServiceSpy;
    let i18nNotificationSpy;

    beforeEach(() => {
        apiServiceSpy = {
            project : {
                getProjects: jasmine.createSpy('getProject'),
                getProjectSchemas: jasmine.createSpy('getProjectSchemas')
            }
        };
        adminActionsSpy = jasmine.createSpyObj('adminActions', [
            'loadEntityAssignmentsStart',
            'loadEntityAssignmentProjectsSuccess',
            'loadEntityAssignmentsSuccess',
            'loadEntityAssignmentsError'
        ]);
        i18nNotificationSpy = jasmine.createSpyObj('i18n notifications', ['show']);


        TestBed.configureTestingModule({
            providers: [
                { provide: ApiService, useValue: apiServiceSpy},
                { provide: ApplicationStateService, useValue: {actions: {admin: adminActionsSpy}}},
                { provide: I18nNotification, useValue: i18nNotificationSpy},
                { provide: Notification, useValue: {}},
                AdminEffectsService
            ]
        });

        adminEffects = TestBed.get(AdminEffectsService);
    });

    describe('loadEntityAssignments', () => {
        const projects = {
            data: [
                {uuid: 'uuid1', name: 'project1'},
                {uuid: 'uuid2', name: 'project2'}
            ]
        };

        it('sends empty object on no projects', () => {
            apiServiceSpy.project.getProjects.and.returnValue(Observable.of({data: []}));
            adminEffects.loadEntityAssignments('schema', 'test');
            expect(adminActionsSpy.loadEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(adminActionsSpy.loadEntityAssignmentsSuccess).toHaveBeenCalledWith({});
        });

        it('returns correct assignments 1', () => {
            const expected: ProjectAssignments = {
                uuid1: true,
                uuid2: true
            };

            apiServiceSpy.project.getProjects.and.returnValue(Observable.of(projects));
            apiServiceSpy.project.getProjectSchemas.and.returnValue(Observable.of(schemasResponse(['test'])));
            adminEffects.loadEntityAssignments('schema', 'test');
            expect(adminActionsSpy.loadEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(adminActionsSpy.loadEntityAssignmentsSuccess).toHaveBeenCalledWith(expected);
        });

        it('returns correct assignments 2', () => {
            const expected: ProjectAssignments = {
                uuid1: false,
                uuid2: true
            };

            apiServiceSpy.project.getProjects.and.returnValue(Observable.of(projects));
            apiServiceSpy.project.getProjectSchemas.and.returnValues(
                Observable.of(schemasResponse([])),
                Observable.of(schemasResponse(['test']))
            );
            adminEffects.loadEntityAssignments('schema', 'test');
            expect(adminActionsSpy.loadEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(adminActionsSpy.loadEntityAssignmentsSuccess).toHaveBeenCalledWith(expected);
        });

        it('returns correct assignments 3', () => {
            const expected: ProjectAssignments = {
                uuid1: false,
                uuid2: false
            };

            apiServiceSpy.project.getProjects.and.returnValue(Observable.of(projects));
            apiServiceSpy.project.getProjectSchemas.and.returnValue(Observable.of(schemasResponse([])));
            adminEffects.loadEntityAssignments('schema', 'test');
            expect(adminActionsSpy.loadEntityAssignmentProjectsSuccess).toHaveBeenCalled();
            expect(adminActionsSpy.loadEntityAssignmentsSuccess).toHaveBeenCalledWith(expected);
        });

        function schemasResponse(projectUuids: string[]) {
            return {
                data: projectUuids.map(uuid => ({uuid}))
            };
        }
    });
});
