import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';

import { NodeTagsBarComponent } from './node-tags-bar.component';
import { MeshNode } from '../../../common/models/node.model';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { GenticsUICoreModule, ModalService, OverlayHostService, DropdownList } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { componentTest } from '../../../../testing/component-test';
import { ConfigService } from '../../../core/providers/config/config.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { mockMeshNode, mockSchema, mockTagFamily, mockTag } from '../../../../testing/mock-models';
import { Tag } from '../../../common/models/tag.model';
import { TagFamily } from '../../../common/models/tag-family.model';
import { By } from '@angular/platform-browser';

describe('NodeTagsBarComponent', () => {
    let state: TestApplicationState;
    let modalService: MockModalService;

    const tagFamily: TagFamily = mockTagFamily({uuid: 'tagFamilyUuid', name: 'mockFamily' });
        const tag: Tag = mockTag({uuid: 'tagUuid', name: 'mockTag', tagFamily});
        const node = mockMeshNode({
            uuid: 'uuid_parentNode',
            tags: [ { uuid: 'tagUuid' }],
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
                    'tagFamilyUuid': tagFamily
                },
                tag: {
                    'tagUuid': tag
                }
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
                const originalComponent = getOriginalComponent(fixture);
                expect(originalComponent.filteredTags[0].tag).toEqual(tag);
            })
        );

        it('it requires saving if things change',
            componentTest(() => TestComponent, (fixture, instance) => {
                const originalComponent = getOriginalComponent(fixture);
                originalComponent.node = node['en']['1'];
                const newTag: Tag = mockTag({uuid: 'incomingTagUuid', name: 'incomingTag', tagFamily});

                expect(originalComponent.isDirty).toEqual(false);
                originalComponent.onTagSelected(newTag);
                expect(originalComponent.isDirty).toEqual(true);
            })
        );

        it('it opens a dialog to create a now tag',
            componentTest(() => TestComponent, (fixture, instance) => {
                const originalComponent = getOriginalComponent(fixture);
                originalComponent.onCreateNewTagClick();
                expect(modalService.fromComponent).toHaveBeenCalled();
            })
        );
    });
});


function getOriginalComponent(fixture: ComponentFixture<TestComponent>): NodeTagsBarComponent {
    const originalComponent: NodeTagsBarComponent = fixture.debugElement.query(By.css('app-node-tags-bar'))
                                                                            .componentInstance as NodeTagsBarComponent;
    return originalComponent;
}

function typeSearchTerm(fixture: ComponentFixture<TestComponent>, term: string): void {
    const input = fixture.debugElement.query(By.css('gtx-input'));
    input.triggerEventHandler('change', term);
    tick();
}

function getDropDownList(fixture: ComponentFixture<TestComponent>): DropdownList {
    const dropDown: DropdownList = fixture.debugElement.query(By.css('gtx-dropdown-list')).componentInstance as DropdownList;
    return dropDown;
}


@Component({
    template: `
    <app-node-tags-bar [node]="node"></app-node-tags-bar>
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
