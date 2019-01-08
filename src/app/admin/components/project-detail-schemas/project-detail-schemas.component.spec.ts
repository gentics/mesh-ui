import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GenticsUICoreModule, ModalService } from 'gentics-ui-core';
import { PaginatePipe } from 'ngx-pagination';

import { mockProject, mockTag, mockTagFamily } from '../../../../testing/mock-models';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { MockActivatedRoute } from '../../../../testing/router-testing-mocks';
import { SchemaReference } from '../../../common/models/common.model';
import { Schema } from '../../../common/models/schema.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { MockFormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component.mock';
import { MockPaginationControlsComponent } from '../../../shared/components/pagination-controls/pagination-controls.component.mock';
import { MockProjectContentDirective } from '../../../shared/directives/project-content.directive.mock';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { AdminListItemComponent } from '../admin-list-item/admin-list-item.component';
import { MockAdminListItemComponent } from '../admin-list-item/admin-list-item.component.mock';
import { AdminListComponent } from '../admin-list/admin-list.component';
import { MockAdminListComponent } from '../admin-list/admin-list.component.mock';

import { ProjectDetailSchemasComponent } from './project-detail-schemas.component';

let state: TestApplicationState;

describe('ProjectDetailSchemasComponent', () => {
    let component: ProjectDetailSchemasComponent;
    let fixture: ComponentFixture<ProjectDetailSchemasComponent>;

    let mockModalService: MockModalService;
    let activatedRoute: MockActivatedRoute;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                GenticsUICoreModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                ReactiveFormsModule,
                BrowserAnimationsModule
            ],
            declarations: [
                ProjectDetailSchemasComponent,
                MockFormGeneratorComponent,
                MockI18nPipe,
                AdminListComponent,
                AdminListItemComponent,
                MockProjectContentDirective,
                MockPaginationControlsComponent,
                PaginatePipe
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: AdminSchemaEffectsService, useClass: MockSchemaEffectsService },
                { provide: EntitiesService, useClass: MockEntitiesService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        // mock schemas
        const schema_00 = getMockedSchema('schema_00');
        const schema_01 = getMockedSchema('schema_01');
        const schema_02 = getMockedSchema('schema_02');
        const schema_03 = getMockedSchema('schema_03');
        const schema_04 = getMockedSchema('schema_04');
        const schema_05 = getMockedSchema('schema_05');
        const schema_06 = getMockedSchema('schema_06');
        const schema_07 = getMockedSchema('schema_07');
        const schema_08 = getMockedSchema('schema_08');
        const schema_09 = getMockedSchema('schema_09');

        // mock project
        const project = mockProject({
            uuid: '___mock_project_uuid___',
            schemas: [
                getSchemaReference(schema_00),
                getSchemaReference(schema_01),
                getSchemaReference(schema_02),
                getSchemaReference(schema_03),
                getSchemaReference(schema_04)
            ]
        });

        mockModalService = TestBed.get(ModalService);

        state = TestBed.get(ApplicationStateService);
        state.mockState({
            adminProjects: {
                projectDetail: project.uuid,
                filterTagsTerm: ''
            },
            entities: {
                project: {
                    [project.uuid]: project
                },
                schema: {
                    [schema_00.version]: { [schema_00.version]: schema_00 },
                    [schema_01.version]: { [schema_01.version]: schema_01 },
                    [schema_02.version]: { [schema_02.version]: schema_02 },
                    [schema_03.version]: { [schema_03.version]: schema_03 },
                    [schema_04.version]: { [schema_04.version]: schema_04 },
                    [schema_05.version]: { [schema_05.version]: schema_05 },
                    [schema_06.version]: { [schema_06.version]: schema_06 },
                    [schema_07.version]: { [schema_07.version]: schema_07 },
                    [schema_08.version]: { [schema_08.version]: schema_08 },
                    [schema_09.version]: { [schema_09.version]: schema_09 }
                }
            }
        });

        activatedRoute = TestBed.get(ActivatedRoute);
        activatedRoute.setData('project', project);

        fixture = TestBed.createComponent(ProjectDetailSchemasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it(
    //     'should fetch tag families and nodes belonging to the project',
    //     fakeAsync(() => {
    //         tick();
    //         fixture.detectChanges();
    //         expect(component.tagFamilies.length).toBe(2);
    //         expect(component.tagFamilies[0].tags.length).toBe(3);
    //         expect(component.tagFamilies[1].tags.length).toBe(2);
    //     })
    // );
});

class MockSchemaEffectsService {
    loadSchemas = jasmine.createSpy('loadSchemas');

    assignEntityToProject = jasmine.createSpy('assignEntityToProject');

    removeEntityFromProject = jasmine.createSpy('removeEntityFromProject');

    // setListPagination = jasmine.createSpy('setListPagination');
}

class MockEntitiesService {
    selectAllSchemas = jasmine.createSpy('selectAllSchemas').and.callFake(() => {
        return state.now.entities.schema;
    });

    selectProject = jasmine.createSpy('selectProject').and.callFake(() => {
        return state.now.entities.project['___mock_project_uuid___'];
    });
}

class MockListEffectsService {
    setFilterTerm = jasmine.createSpy('setFilterTerm');

    loadSchemasForProject = jasmine.createSpy('loadSchemasForProject').and.callFake(() => {
        return state.now.entities.project['___mock_project_uuid___'].schemas;
    });
}

function getMockedSchema(name: string): Schema {
    return {
        uuid: `__mocked_schema_${name}__`,
        container: false,
        created: '2019-01-08T01:52:35Z',
        creator: { uuid: '__mock_creator__' },
        displayField: '__mock_display_field__',
        edited: '2019-02-08T01:52:35Z',
        editor: { uuid: '__mock_editor__' },
        fields: [{ name: '__mock_field__', label: 'Mock Field', required: true, type: 'string' }],
        name: `__mocked_schema_${name}__`,
        permissions: { create: true, read: true, update: true, delete: true, publish: true, readPublished: true },
        rolePerms: { create: true, read: true, update: true, delete: true, publish: true, readPublished: true },
        version: '1.0'
    };
}

function getSchemaReference(schema: Schema): SchemaReference {
    return {
        name: schema.name,
        uuid: schema.uuid,
        version: schema.version
    };
}
