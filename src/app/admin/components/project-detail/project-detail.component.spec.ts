import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectDetailComponent } from './project-detail.component';
import { MockFormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component.mock';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ModalService, GenticsUICoreModule } from 'gentics-ui-core';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';
import { MockAdminListComponent } from '../admin-list/admin-list.component.mock';
import { MockTagComponent } from '../../../shared/components/tag/tag.component.mock';
import { MockProjectContentDirective } from '../../../shared/directives/project-content.directive.mock';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { mockProject } from '../../../../testing/mock-models';
import { MockActivatedRoute } from '../../../../testing/router-testing-mocks';
import { ActivatedRoute } from '@angular/router';


fdescribe('ProjectDetailComponent', () => {
    let component: ProjectDetailComponent;
    let fixture: ComponentFixture<ProjectDetailComponent>;

    let state: TestApplicationState;
    let activatedRoute: MockActivatedRoute;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                GenticsUICoreModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                ReactiveFormsModule
            ],
            declarations: [
                ProjectDetailComponent,
                MockFormGeneratorComponent,
                MockI18nPipe,
                MockAdminListComponent,
                MockTagComponent,
                MockProjectContentDirective,
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
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        state = TestBed.get(ApplicationStateService);
        activatedRoute = TestBed.get(ActivatedRoute);
        activatedRoute.setData('project', mockProject({}));

        fixture = TestBed.createComponent(ProjectDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


class MockTagEffectsService {
    loadTagFamiliesAndTheirTags = jasmine.createSpy('loadTagFamiliesAndTheirTags');
}

class MockAdminProjectEffectsService {

}
class MockEntitiesService {
    getAllTags = jasmine.createSpy('getAllTags');
}
