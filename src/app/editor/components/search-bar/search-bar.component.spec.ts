import { Component, Injectable, DebugElement } from '@angular/core';
import { TestBed, tick, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

import { GenticsUICoreModule, OverlayHostService, SearchBar, InputField } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { SharedModule } from '../../../shared/shared.module';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { mockProject, mockTagFamily, mockTag, mockMeshNode, mockSchema } from '../../../../testing/mock-models';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { EntitiesService } from '../../../state/providers/entities.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';

import { BackgroundFromDirective } from '../../../shared/directives/background-from.directive';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ApiService } from '../../../core/providers/api/api.service';

import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';

import { SearchBarComponent } from './search-bar.component';


describe('Search-bar component:', () => {

    let appState: TestApplicationState;
    let listService: MockListEffectsService;
    const MockRouter = jasmine.createSpyObj('Router', ['navigate']);

    const tagFamily: TagFamily = mockTagFamily({uuid: 'tagFamilyUuid', name: 'mockFamily' });
    const tag: Tag = mockTag({uuid: 'tagUuid', name: 'firstTag', tagFamily});
    const tag2: Tag = mockTag({uuid: 'tagUuid2', name: 'secondTag', tagFamily});
    const tag3: Tag = mockTag({uuid: 'tagUuid3', name: 'mockTag', tagFamily});
    const node = mockMeshNode({
        uuid: 'uuid_parentNode',
        tags: [ { uuid: tag.uuid } ],
        version: '1',
        project: {
            name: 'demo',
            uuid: 'demo_uuid'
        }
    });

    const activeRoute = {
        paramMap: Observable.of(convertToParamMap({
            containerUuid: 'container_uuid',
            projectName: 'demo_project',
            language: 'en',
            q: 'auto',
            t: 'tagUuid,tagUuid2',
        })),
        queryParamMap: Observable.of(convertToParamMap({
            containerUuid: 'container_uuid',
            projectName: 'demo_project',
            language: 'en',
            q: 'auto',
            t: 'tagUuid,tagUuid2',
        }))
    };

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                SearchBarComponent,
                BackgroundFromDirective,

            ],
            providers: [
                OverlayHostService,
                EntitiesService,
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: ApiService, useClass: MockApiService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: Router, useValue: MockRouter },
                { provide: ActivatedRoute, useValue: activeRoute},
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
            ],
            imports: [
                GenticsUICoreModule,
                FormsModule,
                RouterTestingModule.withRoutes([])
            ]
        });

    });

    beforeEach(() => {
        listService = TestBed.get(ListEffectsService);
        appState = TestBed.get(ApplicationStateService);
        appState.mockState({
            editor: {
                openNode: {
                    schemaUuid: 'uuid1',
                    uuid: 'nodeUuid',
                    projectName: '',
                    language: 'en',
                    parentNodeUuid: 'uuid_parentNode',
                }
            },
            entities: {
                schema: {
                    uuid1: mockSchema({ uuid: 'uuid1', version: '1' }),
                },
                node: {
                    uuid_parentNode: node
                },
                tagFamily: {
                    [tagFamily.uuid]: tagFamily
                },
                tag: {
                    [tag.uuid]: tag,
                    [tag2.uuid]: tag2,
                    [tag3.uuid]: tag3,
                }
            },

            tags: {
                tags: [tag.uuid, tag2.uuid, tag3.uuid],
                tagFamilies: [tagFamily.uuid]
            }
        });
    });


    describe('Reads the URL parameters to display', () => {
        it('search keyword',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                const chip: DebugElement = fixture.debugElement.query(By.css('.search-query'));
                activeRoute.queryParamMap.take(1).subscribe(urlParams => {
                    expect(chip.nativeElement.innerHTML).toEqual(urlParams.get('q'));
                });
            })
        );

        it('searched tags',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                const tagChips: DebugElement[] = fixture.debugElement.queryAll(By.css('.chip-tags'));
                expect(tagChips.length).toEqual(2); //thats how much we set in the activatedQuery mock config
            })
        );
    });

    describe('Start typing', () => {
        it('updates the state filter term',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                typeSearchTerm(fixture, 'ford');
                expect(listService.setFilterTerm).toHaveBeenCalledWith('ford')
            })
        );

        it('displays tags drop box if a first character is "#" followed by the name of tag',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                typeSearchTerm(fixture, '#mock');
                fixture.detectChanges();
                tick();
                const filteredTagItem: DebugElement = fixture.debugElement.queryAll(By.css('gtx-dropdown-item'))[0];
                expect(filteredTagItem).toBeDefined();
            })
        );
    });

    describe('Submitting the search', () => {
        it('sets the search keyword if "search" is clicked',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                typeSearchTerm(fixture, 'some search');
                fixture.debugElement.query(By.css('gtx-search-bar')).triggerEventHandler('search', null);
                tick();
                expect(MockRouter.navigate)
                    .toHaveBeenCalledWith(
                            [],
                            {
                                relativeTo: activeRoute,
                                queryParams: { q: 'some search', t: 'tagUuid,tagUuid2' }
                            }
                    );
            })
        );
    });
});

function typeSearchTerm(fixture: ComponentFixture<TestComponent>, term: string): void {
    const input = fixture.debugElement.query(By.css('gtx-input'));
    (input.componentInstance as InputField).writeValue(term);

    input.triggerEventHandler('change', term);
    tick();
}

@Component({
    template: `
        <mesh-search-bar></mesh-search-bar>
        <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent { }

function getSearchBarComponent(fixture: ComponentFixture<TestComponent>): SearchBarComponent {
    const tagBarComponent: SearchBarComponent = fixture.debugElement.query(By.css('mesh-search-bar'))
                                                                            .componentInstance as SearchBarComponent;
    return tagBarComponent;
}


class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
    setFilterTerm = jasmine.createSpy('listEffects');
    loadSchemasForProject = () => {};
    loadMicroschemasForProject = () => {};
    setActiveContainer = (projectName: string , containerUuid: string, language: string) => {};
}

class MockEditorEffectsService {
    saveNewNode = jasmine.createSpy('saveNewNode');
    closeEditor = jasmine.createSpy('closeEditor');
    openNode = jasmine.createSpy('openNode');
    createNode = jasmine.createSpy('createNode');
    saveNode = jasmine.createSpy('saveNode');
}
