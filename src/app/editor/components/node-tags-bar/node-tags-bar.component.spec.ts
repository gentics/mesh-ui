import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GenticsUICoreModule, ModalService, OverlayHostService, DropdownList, InputField } from 'gentics-ui-core';

import { MeshNode } from '../../../common/models/node.model';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { componentTest } from '../../../../testing/component-test';
import { ConfigService } from '../../../core/providers/config/config.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { mockMeshNode, mockSchema, mockTagFamily, mockTag } from '../../../../testing/mock-models';
import { Tag } from '../../../common/models/tag.model';
import { TagFamily } from '../../../common/models/tag-family.model';
import { NodeTagsBarComponent } from './node-tags-bar.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { DebugElement } from '@angular/core/src/debug/debug_node';

describe('NodeTagsBarComponent', () => {
    let state: TestApplicationState;
    let modalService: MockModalService;

    const tagFamily: TagFamily = mockTagFamily({uuid: 'tagFamilyUuid', name: 'mockFamily' });
    const tag: Tag = mockTag({uuid: 'tagUuid', name: 'mockTag', tagFamily});
    const tag2: Tag = mockTag({uuid: 'tagUuid2', name: 'secondTag', tagFamily});
    const node = mockMeshNode({
        uuid: 'uuid_parentNode',
        tags: [ { uuid: tag.uuid } ],
        version: '1',
        project: {
            name: 'demo',
            uuid: 'demo_uuid'
        }
    });

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                NodeTagsBarComponent,
                TestComponent,
            ],
            providers: [
                OverlayHostService,
                EntitiesService,
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
            ],
            imports: [
                GenticsUICoreModule
            ]
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
                }
            },

            tags: {
                tags: [tag.uuid, tag2.uuid],
                tagFamilies: [tagFamily.uuid]
            }
        });
    });

    describe('Start typing', () => {
        it('it shows dropdown',
            componentTest(() => TestComponent, (fixture, instance) => {
                typeSearchTerm(fixture, 'mock');
                const dropDown: DropdownList = getDropDownList(fixture);
                expect(dropDown.isOpen).toBe(true);
            })
        );

        it('it filters matching tags',
            componentTest(() => TestComponent, (fixture, instance) => {
                typeSearchTerm(fixture, 'mock');
                const tagBarComponent = getTagsBarComponent(fixture);
                expect(tagBarComponent.filteredTags[0].tag).toEqual(tag);
            })
        );

        it('it requires saving if things change',
            componentTest(() => TestComponent, (fixture, instance) => {
                const tagBarComponent = getTagsBarComponent(fixture);
                tagBarComponent.node = node['en']['1'];
                typeSearchTerm(fixture, tag2.name);
                fixture.detectChanges();
                tick();
                const filteredTagItem: DebugElement = fixture.debugElement.queryAll(By.css('gtx-dropdown-item'))[0];
                filteredTagItem.triggerEventHandler('click', tag2);
                expect(tagBarComponent.isDirty).toEqual(true);
            })
        );

        it('it opens a dialog to create a new tag',
            componentTest(() => TestComponent, (fixture, instance) => {
                const tagBarComponent = getTagsBarComponent(fixture);
                typeSearchTerm(fixture, 'new-tag');

                fixture.detectChanges();
                tick();
                const dropDownItemForNewTag: DebugElement = fixture.debugElement.query(By.css('gtx-dropdown-item'));
                dropDownItemForNewTag.triggerEventHandler('click', null);
                fixture.detectChanges();
                tick();
                expect(modalService.fromComponent).toHaveBeenCalled();
            })
        );
    });
});

function getTagsBarComponent(fixture: ComponentFixture<TestComponent>): NodeTagsBarComponent {
    const tagBarComponent: NodeTagsBarComponent = fixture.debugElement.query(By.css('app-node-tags-bar'))
                                                                            .componentInstance as NodeTagsBarComponent;
    return tagBarComponent;
}

function typeSearchTerm(fixture: ComponentFixture<TestComponent>, term: string): void {
    const input = fixture.debugElement.query(By.css('gtx-input'));
    (input.componentInstance as InputField).writeValue(term);
    input.triggerEventHandler('change', term);
    tick();
}

function getDropDownList(fixture: ComponentFixture<TestComponent>): DropdownList {
    const dropDown: DropdownList = fixture.debugElement.query(By.css('gtx-dropdown-list')).componentInstance as DropdownList;
    return dropDown;
}
@Component({
    template: `
    <app-node-tags-bar></app-node-tags-bar>
    <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {
    node: MeshNode;
}

class MockI18nService {
    translate(str: string): string {
        return str;
    }
}

class MockEditorEffectsService {
    saveNewNode = jasmine.createSpy('saveNewNode');
    closeEditor = jasmine.createSpy('closeEditor');
    openNode = jasmine.createSpy('openNode');
    createNode = jasmine.createSpy('createNode');
    saveNode = jasmine.createSpy('saveNode');
}

class MockModalService {
    dialog = jasmine.createSpy('dialog').and.callFake(() => Promise.resolve(this.fakeDialog));
    fromComponent = jasmine.createSpy('fromComponent').and.callFake(() => Promise.resolve(this.fakeDialog));
    fakeDialog = {
        open: jasmine.createSpy('open').and.callFake(() => {
            return new Promise(resolve => {
                this.confirmLastModal = () => { resolve(); tick(); };
            });
        })
    };
    confirmLastModal: () => void;
}
