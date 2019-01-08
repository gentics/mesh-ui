import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { TagFamily } from '../../../common/models/tag-family.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { MockFormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component.mock';
import { MockPaginationControlsComponent } from '../../../shared/components/pagination-controls/pagination-controls.component.mock';
import { MockTagComponent } from '../../../shared/components/tag/tag.component.mock';
import { MockProjectContentDirective } from '../../../shared/directives/project-content.directive.mock';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { AdminListItemComponent } from '../admin-list-item/admin-list-item.component';
import { AdminListComponent } from '../admin-list/admin-list.component';

import { ProjectDetailComponent } from './project-detail.component';

let state: TestApplicationState;

describe('ProjectDetailComponent', () => {
    let component: ProjectDetailComponent;
    let fixture: ComponentFixture<ProjectDetailComponent>;

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
                ProjectDetailComponent,
                MockFormGeneratorComponent,
                MockI18nPipe,
                AdminListComponent,
                AdminListItemComponent,
                MockTagComponent,
                MockProjectContentDirective,
                MockPaginationControlsComponent,
                MockProjectDetailSchemasComponent,
                MockProjectDetailMicroschemasComponent,
                PaginatePipe
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: EntitiesService, useClass: MockEntitiesService },
                { provide: AdminProjectEffectsService, useClass: MockAdminProjectEffectsService },
                { provide: TagsEffectsService, useClass: MockTagEffectsService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        const project = mockProject({
            uuid: '___mock_project_uuid___'
        });

        const tagFamily1 = getMockedTagFamily('family1');
        const tagFamily2 = getMockedTagFamily('family2');

        const tag1Fam1 = getMockedTag('tag1_Fam1', tagFamily1);
        const tag2Fam1 = getMockedTag('tag2_Fam1', tagFamily1);
        const tag3Fam1 = getMockedTag('tag3_Fam1', tagFamily1);

        const tag1Fam2 = getMockedTag('tag1_Fam2', tagFamily2);
        const tag2Fam2 = getMockedTag('tag2_Fam2', tagFamily2);
        const tag3Fam2 = getMockedTag('tag3_Fam2', tagFamily2);

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
                tag: {
                    [tag1Fam1.uuid]: tag1Fam1,
                    [tag2Fam1.uuid]: tag2Fam1,
                    [tag3Fam1.uuid]: tag3Fam1,

                    [tag1Fam2.uuid]: tag1Fam2,
                    [tag2Fam2.uuid]: tag2Fam2
                },
                tagFamily: {
                    [tagFamily1.uuid]: tagFamily1,
                    [tagFamily2.uuid]: tagFamily2
                }
            },
            tags: {
                tagFamilies: [tagFamily1.uuid, tagFamily2.uuid],
                tags: [tag1Fam1.uuid, tag2Fam1.uuid, tag3Fam1.uuid, tag1Fam2.uuid, tag2Fam2.uuid]
            }
        });

        activatedRoute = TestBed.get(ActivatedRoute);
        activatedRoute.setData('project', project);

        fixture = TestBed.createComponent(ProjectDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(
        'should fetch tag families and nodes belonging to the project',
        fakeAsync(() => {
            tick();
            fixture.detectChanges();
            expect(component.tagFamilies.length).toBe(2);
            expect(component.tagFamilies[0].tags.length).toBe(3);
            expect(component.tagFamilies[1].tags.length).toBe(2);
        })
    );

    it(
        'should add a tag',
        fakeAsync(() => {
            const tagsLengthBeforeAdding = component.tagFamilies[1].tags.length;
            component.addTagClick(component.tagFamilies[1]);
            tick();
            fixture.detectChanges();

            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal('new_tag');

            tick();
            fixture.detectChanges();

            expect(component.tagFamilies[1].tags.length).toBe(tagsLengthBeforeAdding + 1);
        })
    );

    it(
        'should NOT add a tag with a duplicate name',
        fakeAsync(() => {
            const firstTag = component.tagFamilies[1].tags[0];
            const tagsLengthBeforeAdding = component.tagFamilies[1].tags.length;
            component.addTagClick(component.tagFamilies[1]);
            tick();
            fixture.detectChanges();

            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal(firstTag.data.name);

            tick();
            fixture.detectChanges();

            expect(component.tagFamilies[1].tags.length).toBe(tagsLengthBeforeAdding);
        })
    );

    it(
        'should delete a tag',
        fakeAsync(() => {
            const firstTag = component.tagFamilies[1].tags[0];

            component.deleteTagClick(firstTag, component.tagFamilies[1]);
            tick();
            fixture.detectChanges();
            expect(mockModalService.dialogSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal();

            tick();
            fixture.detectChanges();

            expect(
                component.tagFamilies[1].tags
                    .filter(tag => tag.status !== component.TagStatus.DELETED)
                    .some(tag => tag === firstTag)
            ).toBeFalsy();
        })
    );

    it(
        'should update a tag',
        fakeAsync(() => {
            const firstTag = component.tagFamilies[1].tags[0];

            component.updateTagClick(firstTag, component.tagFamilies[1]);
            tick();
            fixture.detectChanges();
            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal('changed_name');

            tick();
            fixture.detectChanges();

            expect(firstTag.data.name).toEqual('changed_name');
        })
    );

    it(
        'should NOT update a tag to a duplicating name',
        fakeAsync(() => {
            const firstTag = component.tagFamilies[1].tags[0];
            const secondTag = component.tagFamilies[1].tags[1];

            component.updateTagClick(firstTag, component.tagFamilies[1]);
            tick();
            fixture.detectChanges();
            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal(secondTag.data.name);

            tick();
            fixture.detectChanges();

            expect(firstTag.data.name).not.toEqual(secondTag.data.name);
            expect(mockModalService.fromComponentSpy).toHaveBeenCalledTimes(2);
        })
    );

    it(
        'should add a tag family',
        fakeAsync(() => {
            const familiesLengthBeforeAdding = component.tagFamilies.length;
            component.createTagFamilyClick();
            tick();
            fixture.detectChanges();

            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal('new_tag_family');

            tick();
            fixture.detectChanges();

            expect(component.tagFamilies.length).toBe(familiesLengthBeforeAdding + 1);
            expect(component.tagFamilies[2].data.name).toEqual('new_tag_family');
        })
    );

    it(
        'should NOT add a family with a duplicate name',
        fakeAsync(() => {
            const familiesLengthBeforeAdding = component.tagFamilies.length;
            const family = component.tagFamilies[0];
            component.createTagFamilyClick();
            tick();
            fixture.detectChanges();

            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal(family.data.name);

            tick();
            fixture.detectChanges();

            expect(component.tagFamilies.length).toBe(familiesLengthBeforeAdding);
        })
    );

    it(
        'should delete a tag family',
        fakeAsync(() => {
            const firstFamily = component.tagFamilies[0];
            component.deleteTagFamilyClick(component.tagFamilies[0]);
            tick();
            fixture.detectChanges();
            expect(mockModalService.dialogSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal();

            tick();
            fixture.detectChanges();

            expect(
                component.tagFamilies
                    .filter(fam => fam.status !== component.TagStatus.DELETED)
                    .some(fam => fam === firstFamily)
            ).toBeFalsy();
        })
    );

    it(
        'should update a family name',
        fakeAsync(() => {
            const firstFamily = component.tagFamilies[0];

            component.updateTagFamilyClick(firstFamily);
            tick();
            fixture.detectChanges();
            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal('changed_name');

            tick();
            fixture.detectChanges();

            expect(firstFamily.data.name).toEqual('changed_name');
        })
    );

    it(
        'should NOT update a tag family name to a duplicating name',
        fakeAsync(() => {
            const firstFamily = component.tagFamilies[0];
            const secondFamily = component.tagFamilies[1];

            component.updateTagFamilyClick(firstFamily);
            tick();
            fixture.detectChanges();
            expect(mockModalService.fromComponentSpy).toHaveBeenCalled();
            mockModalService.confirmLastModal(secondFamily.data.name);

            tick();
            fixture.detectChanges();

            expect(firstFamily.data.name).not.toEqual(secondFamily.data.name);
            expect(mockModalService.fromComponentSpy).toHaveBeenCalledTimes(2);
        })
    );

    it(
        'filters the tags',
        fakeAsync(() => {
            tick();
            fixture.detectChanges();
            const tagsBeforeFilter = fixture.debugElement.queryAll(By.css('mesh-tag'));

            state.actions.adminProjects.setTagFilterTerm('tag2');

            tick();
            fixture.detectChanges();
            const tagsAfterFilter = fixture.debugElement.queryAll(By.css('mesh-tag'));

            expect(tagsBeforeFilter.length).not.toEqual(tagsAfterFilter.length);
            expect(tagsAfterFilter.length).toEqual(2); // tag2_Fam1, tag2_Fam2

            expect((tagsAfterFilter[0].componentInstance as MockTagComponent).tag.name).toEqual('tag2_Fam1');
            expect((tagsAfterFilter[1].componentInstance as MockTagComponent).tag.name).toEqual('tag2_Fam2');
        })
    );
});

function getMockedTagFamily(name: string) {
    return mockTagFamily({
        uuid: `__mocked_tag_family_${name}__`,
        name
    });
}

function getMockedTag(name: string, tagFamily: TagFamily) {
    return mockTag({
        uuid: `__mocked_tag_${name}__`,
        name,
        tagFamily
    });
}

class MockTagEffectsService {
    loadTagFamiliesAndTheirTags = jasmine.createSpy('loadTagFamiliesAndTheirTags');
}

class MockAdminProjectEffectsService {}
class MockEntitiesService {
    getAllTags = jasmine.createSpy('getAllTags').and.callFake(() => {
        return state.now.tags.tags.map(uuid => state.now.entities.tag[uuid]);
    });

    getTagFamily = jasmine.createSpy('getTagFamily').and.callFake((uuid: string) => {
        return state.now.entities.tagFamily[uuid];
    });
}

@Component({
    selector: 'mesh-project-detail-schemas',
    template: `<p>mesh-project-detail-schemas</p>`
})
class MockProjectDetailSchemasComponent {}

@Component({
    selector: 'mesh-project-detail-microschemas',
    template: `<p>mesh-project-detail-microschemas</p>`
})
class MockProjectDetailMicroschemasComponent {}
