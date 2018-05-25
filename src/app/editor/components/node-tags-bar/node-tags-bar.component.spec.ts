import { Component, Input } from '@angular/core';
import { tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Button, GenticsUICoreModule, InputField, ModalService, OverlayHostService } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { mockMeshNode, mockSchema, mockTag, mockTagFamily } from '../../../../testing/mock-models';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { MeshNode } from '../../../common/models/node.model';
import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { MockTagSelectorComponent } from '../../../shared/components/tag-selector/tag-selector.component.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { MockEditorEffectsService } from '../../providers/editor-effects.service.mock';

import { NodeTagsBarComponent } from './node-tags-bar.component';

describe('NodeTagsBarComponent', () => {
    let state: TestApplicationState;
    let modalService: MockModalService;

    const tagFamily: TagFamily = mockTagFamily({ uuid: 'tagFamilyUuid', name: 'mockFamily' });
    const tag: Tag = mockTag({ uuid: 'tagUuid', name: 'mockTag', tagFamily });
    const tag2: Tag = mockTag({ uuid: 'tagUuid2', name: 'secondTag', tagFamily });
    const node = mockMeshNode({
        uuid: 'uuid_parentNode',
        tags: [{ uuid: tag.uuid }],
        version: '1',
        project: {
            name: 'demo',
            uuid: 'demo_uuid'
        }
    });

    beforeEach(() => {
        configureComponentTest({
            declarations: [NodeTagsBarComponent, TestComponent, MockTagComponent, MockTagSelectorComponent],
            providers: [
                OverlayHostService,
                EntitiesService,
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useClass: MockConfigService }
            ],
            imports: [GenticsUICoreModule, FormsModule]
        });

        modalService = TestBed.get(ModalService);

        state = TestBed.get(ApplicationStateService);
        state.mockState({
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
                    [tag2.uuid]: tag2
                }
            },

            tags: {
                tags: [tag.uuid, tag2.uuid],
                tagFamilies: [tagFamily.uuid]
            }
        });
    });

    describe('clicking the add-tag-button', () => {
        it(
            'sets focus on the input',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();

                    const addTagButton = fixture.debugElement.query(By.directive(Button)).nativeElement;
                    const nativeInput: HTMLInputElement = fixture.debugElement.query(By.css('gtx-input input'))
                        .nativeElement;
                    nativeInput.focus = jasmine.createSpy('focus');
                    addTagButton.click();
                    tick(200);

                    expect(nativeInput.focus).toHaveBeenCalled();
                }
            )
        );
    });

    describe('Start typing', () => {
        it(
            'it filters matching tags',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    typeSearchTerm(fixture, 'mock');
                    const tagBarComponent = getTagsBarComponent(fixture);
                    expect(tagBarComponent.filteredTags[0]).toEqual(tag);
                }
            )
        );

        it(
            'it requires saving if things change',
            componentTest(
                () => TestComponent,
                fixture => {
                    const tagBarComponent = getTagsBarComponent(fixture);
                    tagBarComponent.node = node['en']['1'];
                    fixture.detectChanges();
                    tick();

                    const tagSelector = getTagSelector(fixture);
                    tagSelector.selectTag.emit({
                        uuid: 'new_tag_uuid',
                        name: 'new tag',
                        tagFamily: { name: 'tag family', uuid: 'tag_family_uuid' }
                    } as Tag);
                    tick();
                    expect(tagBarComponent.isDirty).toEqual(true);
                }
            )
        );

        it(
            'it opens a dialog to create a new tag',
            componentTest(
                () => TestComponent,
                fixture => {
                    typeSearchTerm(fixture, 'new-tag');

                    fixture.detectChanges();
                    tick();
                    const tagSelector = getTagSelector(fixture);
                    tagSelector.createNewTag.emit('new tag name');
                    tick();
                    expect(modalService.fromComponentSpy).toHaveBeenCalled();
                }
            )
        );
    });
});

function getTagsBarComponent(fixture: ComponentFixture<TestComponent>): NodeTagsBarComponent {
    return fixture.debugElement.query(By.directive(NodeTagsBarComponent)).componentInstance;
}

function getTagSelector(fixture: ComponentFixture<TestComponent>): MockTagSelectorComponent {
    return fixture.debugElement.query(By.css('mesh-tag-selector')).componentInstance;
}

function typeSearchTerm(fixture: ComponentFixture<TestComponent>, term: string): void {
    const input = fixture.debugElement.query(By.css('gtx-input'));
    (input.componentInstance as InputField).writeValue(term);
    input.triggerEventHandler('change', term);
    tick();
}

@Component({
    template: `
    <mesh-node-tags-bar></mesh-node-tags-bar>
    <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {
    node: MeshNode;
}

@Component({ selector: 'mesh-tag', template: '' })
class MockTagComponent {
    @Input() tag: any;
}
