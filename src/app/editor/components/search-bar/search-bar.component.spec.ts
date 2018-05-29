import { Component, DebugElement } from '@angular/core';
import { tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GenticsUICoreModule, InputField, OverlayHostService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { mockMeshNode, mockSchema, mockTag, mockTagFamily } from '../../../../testing/mock-models';
import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { MockTagSelectorComponent } from '../../../shared/components/tag-selector/tag-selector.component.mock';
import { TagComponent } from '../../../shared/components/tag/tag.component';
import { BackgroundFromDirective } from '../../../shared/directives/background-from.directive';
import { HighlightPipe } from '../../../shared/pipes/highlight/highlight.pipe';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { EditorEffectsService } from '../../providers/editor-effects.service';

import { SearchBarComponent } from './search-bar.component';
import { MockEditorEffectsService } from '../../providers/editor-effects.service.mock';
import { MockListEffectsService } from '../../../core/providers/effects/list-effects.service.mock';

describe('Search-bar component:', () => {
    let appState: TestApplicationState;
    let listService: MockListEffectsService;
    const MockRouter = jasmine.createSpyObj('Router', ['navigate']);

    const tagFamily: TagFamily = mockTagFamily({ uuid: 'tagFamilyUuid', name: 'mockFamily' });
    const tag: Tag = mockTag({ uuid: 'tagUuid', name: 'firstTag', tagFamily });
    const tag2: Tag = mockTag({ uuid: 'tagUuid2', name: 'secondTag', tagFamily });
    const tag3: Tag = mockTag({ uuid: 'tagUuid3', name: 'mockTag', tagFamily });
    const node = mockMeshNode({
        uuid: 'uuid_parentNode',
        tags: [{ uuid: tag.uuid }],
        version: '1',
        project: {
            name: 'demo',
            uuid: 'demo_uuid'
        }
    });

    const activeRoute = {
        paramMap: Observable.of(
            convertToParamMap({
                containerUuid: 'container_uuid',
                projectName: 'demo_project',
                language: 'en',
                q: 'auto',
                t: 'tagUuid,tagUuid2'
            })
        ),
        queryParamMap: Observable.of(
            convertToParamMap({
                containerUuid: 'container_uuid',
                projectName: 'demo_project',
                language: 'en',
                q: 'auto',
                t: 'tagUuid,tagUuid2'
            })
        )
    };

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                SearchBarComponent,
                BackgroundFromDirective,
                HighlightPipe,
                ChipComponent,
                TagComponent,
                MockTagSelectorComponent
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
                { provide: ActivatedRoute, useValue: activeRoute },
                { provide: ConfigService, useClass: MockConfigService }
            ],
            imports: [GenticsUICoreModule, FormsModule, RouterTestingModule.withRoutes([])]
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
                    parentNodeUuid: 'uuid_parentNode'
                }
            },
            entities: {
                schema: {
                    uuid1: mockSchema({ uuid: 'uuid1', version: '1' })
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
                    [tag3.uuid]: tag3
                }
            },

            tags: {
                tags: [tag.uuid, tag2.uuid, tag3.uuid],
                tagFamilies: [tagFamily.uuid]
            }
        });
    });

    describe('Reads the URL parameters to display', () => {
        it(
            'search keyword',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();
                    const searchBar: SearchBarComponent = fixture.debugElement.query(By.directive(SearchBarComponent))
                        .componentInstance;
                    activeRoute.queryParamMap.take(1).subscribe(urlParams => {
                        expect(searchBar.searchQuery).toEqual(urlParams.get('q')!);
                    });
                }
            )
        );

        it(
            'searched tags',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();
                    const tagChips: DebugElement[] = fixture.debugElement.queryAll(By.css('mesh-tag'));
                    expect(tagChips.length).toEqual(2); // that's how much we set in the activatedQuery mock config
                }
            )
        );
    });

    describe('Start typing', () => {
        it(
            'updates the state filter term',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();
                    typeSearchTerm(fixture, 'ford');
                    expect(listService.setFilterTerm).toHaveBeenCalledWith('ford');
                }
            )
        );

        it(
            'displays tags drop box if a first character is "#" followed by the name of tag',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();
                    typeSearchTerm(fixture, '#mock');
                    fixture.detectChanges();
                    tick();
                    const searchBar: SearchBarComponent = fixture.debugElement.query(By.directive(SearchBarComponent))
                        .componentInstance;
                    expect(searchBar.displayTagSelection).toBe(true);
                }
            )
        );
    });

    describe('Submitting the search', () => {
        it(
            'sets the search keyword if "search" is clicked',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();
                    typeSearchTerm(fixture, 'some search');
                    fixture.debugElement.query(By.css('gtx-search-bar')).triggerEventHandler('search', null);
                    tick();
                    expect(MockRouter.navigate).toHaveBeenCalledWith([], {
                        relativeTo: activeRoute,
                        queryParams: { q: 'some search', t: 'tagUuid,tagUuid2' }
                    });
                }
            )
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
class TestComponent {}
