import { Component } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { mockMeshNode, mockProject, mockSchema } from '../../../../testing/mock-models';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CreateNodeButtonComponent } from '../create-node-button/create-node-button.component';
import { ContainerLanguageSwitcherComponent } from '../container-language-switcher/container-language-switcher.component';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { AvailableLanguagesListComponent } from '../available-languages-list/available-languages-list.component';
import { ProjectSwitcherComponent } from '../project-switcher/project-switcher.component';
import { NodeLanguageLabelComponent } from '../language-label/language-label.component';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';


import { ConfigService } from '../../../core/providers/config/config.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ApiService } from '../../../core/providers/api/api.service';
import { EntitiesService } from '../../../state/providers/entities.service';

import { ContainerContentsComponent } from './container-contents.component';


describe('ContainerContentsComponent', () => {

    let api: MockApiService;
    let state: TestApplicationState;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                ContainerContentsComponent,
                BreadcrumbsComponent,
                SearchBarComponent,
                CreateNodeButtonComponent,
                ContainerLanguageSwitcherComponent,
                AvailableLanguagesListComponent,
                ProjectSwitcherComponent,
                NodeLanguageLabelComponent,
                TestComponent
            ],
            providers: [
                EntitiesService,
                OverlayHostService,
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: ApiService, useClass: MockApiService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
                { provide: ActivatedRoute, useValue: { paramMap: Observable.of(convertToParamMap({
                    containerUuid: 'container_uuid',
                    projectName: 'demo_project',
                    language: 'en',
                }))}}
            ],
            imports: [
                GenticsUICoreModule,
                RouterTestingModule.withRoutes([])
            ]
        });

        api = TestBed.get(ApiService);

        state = TestBed.get(ApplicationStateService);
        state.mockState({
            auth: {
                loggedIn: true
            },
            list: {
                language: 'en',
                items: ['node_uuid'],
                currentProject: 'demo_project',
                currentNode: 'current_node_uuid'
            },
            entities: {
                node: {
                    'node_uuid' : mockMeshNode({
                        uuid: 'node_uuid',
                        language: 'en',
                        version: '0',
                        displayName: 'node_display_field'
                    }),
                    'current_node_uuid': mockMeshNode({
                        uuid: 'current_node_uuid',
                        language: 'en',
                        version: '0',
                        displayName: 'current_node_display_field'
                    })
                },
                project: {
                    'project_uuid': mockProject({ uuid: 'project_uuid', name: 'demo_project'}),
                },
                schema: {
                    'schema_uuid': mockSchema({uuid: 'schema_uuid'})
                }
            }
        });
    });
});

@Component({
    template: `
        <container-contents></container-contents>
        <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent { }

class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
    loadSchemasForProject = () => {};
    loadMicroschemasForProject = () => {};
    setActiveContainer = (projectName: string , containerUuid: string, language: string) => {};
}

class MockNavigationService {
    list = jasmine.createSpy('list').and.returnValue({ commands: () => { } });
    detail = jasmine.createSpy('detail').and.returnValue({ navigate: () => { }, commands: () => { } });
}
