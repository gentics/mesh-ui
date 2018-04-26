import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule, ModalService } from 'gentics-ui-core';

import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { componentTest } from '../../../../testing/component-test';
import { SchemaLabelComponent } from '../../../shared/components/schema-label/schema-label.component';
import { VersionLabelComponent } from '../version-label/version-label.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { NodeLanguageLabelComponent } from '../language-label/language-label.component';
import { ConfigService } from '../../../core/providers/config/config.service';
import { mockMeshNode, mockSchema } from '../../../../testing/mock-models';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { MockApiBase } from '../../../core/providers/api/api-base.mock';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { NodeEditorComponent } from './node-editor.component';

describe('NodeEditorComponent', () => {
    let editorEffectsService: MockEditorEffectsService;
    let state: TestApplicationState;
    let listEffectsService: MockListEffectsService;
    let navigationService: MockNavigationService;
    let modalService: MockModalService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                NodeEditorComponent,
                SchemaLabelComponent,
                VersionLabelComponent,
                NodeLanguageLabelComponent,
                MockLanguageSwitcherComponent,
                MockNodeTagsBarComponent,
                MockFormGeneratorComponent
            ],
            providers: [
                EntitiesService,
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ApiBase, useClass: MockApiBase },
                { provide: ApiService, useClass: MockApiService }
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
                GenticsUICoreModule.forRoot(),
                FormsModule
            ]
        });
        editorEffectsService = TestBed.get(EditorEffectsService);
        state = TestBed.get(ApplicationStateService);
        listEffectsService = TestBed.get(ListEffectsService);
        navigationService = TestBed.get(NavigationService);
        modalService = TestBed.get(ModalService);
    });

    const clickSave = (fixture: ComponentFixture<NodeEditorComponent>) => {
        fixture.detectChanges();
        tick();
        (fixture.debugElement.query(By.css('.save-button')).nativeElement as HTMLElement).click();
        tick();
    };

    const clickClose = (fixture: ComponentFixture<NodeEditorComponent>) => {
        fixture.detectChanges();
        tick();
        (fixture.debugElement.query(By.css('.close-button gtx-button')).nativeElement as HTMLElement).click();
        tick();
    };

    describe('saving a new node', () => {
        const newNode = { language: 'en', uuid: 'new_node_uuid' };
        beforeEach(() => {
            editorEffectsService.saveNewNode = jasmine.createSpy('saveNewNode').and.returnValue(Promise.resolve(newNode));
            state.mockState({
                editor: {
                    openNode: {
                        schemaUuid: 'uuid1',
                        uuid: '',
                        projectName: '',
                        language: 'en',
                        parentNodeUuid: 'uuid_parentNode',
                    }
                },
                entities: {
                    schema: {
                        uuid1: mockSchema({ uuid: 'uuid1', version: '0.1' }),
                    },
                    node: {
                        uuid_parentNode: mockMeshNode({ uuid: 'uuid_parentNode', project: { name: 'demo', uuid: 'demo_uuid' } })
                    }
                }
            });
        });

        it('calls EditorEffectsService.saveNewNode',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                clickSave(fixture);
                expect(editorEffectsService.saveNewNode).toHaveBeenCalled();
            })
        );

        it('calls formGenerator.setPristine',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                instance.formGenerator.setPristine = jasmine.createSpy('setPristine');
                clickSave(fixture);
                expect(instance.formGenerator.setPristine).toHaveBeenCalledWith(newNode);
            })
        );

        it('calls listEffects.loadChildren',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                instance.formGenerator.setPristine = jasmine.createSpy('setPristine');
                clickSave(fixture);
                expect(listEffectsService.loadChildren).toHaveBeenCalledWith('demo', 'uuid_parentNode', 'en');
            })
        );

        it('calls navigationService.detail and navigationService.navigate',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                const navigateSpy = jasmine.createSpy('navigate');
                navigationService.detail = jasmine.createSpy('detail').and.returnValue({ navigate: navigateSpy });
                clickSave(fixture);
                expect(navigationService.detail).toHaveBeenCalledWith('demo', 'new_node_uuid', 'en');
                expect(navigateSpy).toHaveBeenCalled();
            })
        );
    });

    describe('updating a node', () => {
        const node = {
            uuid: 'node_uuid',
            project: {
                uuid: 'demo_uuid',
                name: 'demo'
            },
            parentNode: {
                uuid: 'uuid_parentNode'
            },
            language: 'en',
        };

        beforeEach(() => {
            state.mockState({
                editor: {
                    openNode: {
                        uuid: node.uuid,
                        projectName: node.project.name,
                        language: node.language,
                        parentNodeUuid: node.parentNode.uuid,
                    }
                },
                entities: {
                    schema: {
                        uuid1: mockSchema({ uuid: 'uuid1', version: '0.1' }),
                    },
                    node: {
                        [node.parentNode.uuid]: mockMeshNode({
                            uuid: node.parentNode.uuid,
                            project: {
                                name: node.project.name,
                                uuid: node.project.uuid,
                            }
                        }),
                        [node.uuid]: mockMeshNode({
                            uuid: node.uuid,
                            project: {
                                name: node.project.name,
                                uuid: node.project.uuid,
                            },
                            parentNode: {
                                uuid: node.parentNode.uuid,
                                projectName: node.project.name,
                                schema: { uuid: 'uuid1' }
                            },
                            schema: { uuid: 'uuid1' }
                        }),
                    }
                }
            });
        });

        it('calls editorEffects.saveNode',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                editorEffectsService.saveNode = jasmine.createSpy('saveNode').and.returnValue(Promise.resolve(node));
                clickSave(fixture);
                expect(editorEffectsService.saveNode).toHaveBeenCalled();
            })
        );

        it('calls listEffects.loadChildren',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                editorEffectsService.saveNode = jasmine.createSpy('saveNode').and.returnValue(Promise.resolve(node));
                clickSave(fixture);
                expect(listEffectsService.loadChildren).toHaveBeenCalledWith(node.project.name, node.parentNode.uuid, node.language);
            })
        );

        it('handles conflicts from the server',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                editorEffectsService.saveNode = jasmine.createSpy('saveNode').and.callFake(() => {
                    const errorResponse =  {
                        response: {
                            json: () => {
                                return {
                                    type: 'node_version_conflict',
                                    properties: {
                                        conflicts: []
                                    }
                                };
                            }
                        }
                    }
                    return Promise.reject(errorResponse);
                });

                instance.handleSaveConflicts = jasmine.createSpy('handleSaveConflicts');
                clickSave(fixture);
                expect(instance.handleSaveConflicts).toHaveBeenCalled();
            })
        );
    });


    describe('closing editor', () => {
        it('calls navigationService.clearDetail',
            componentTest(() => NodeEditorComponent, (fixture, instance) => {
                clickClose(fixture);
                expect(navigationService.clearDetail).toHaveBeenCalled();
            })
        );
    });
});


class MockEditorEffectsService {
    saveNewNode = jasmine.createSpy('saveNewNode');
    closeEditor = jasmine.createSpy('closeEditor');
    openNode = jasmine.createSpy('openNode');
    createNode = jasmine.createSpy('createNode');
    saveNode = jasmine.createSpy('saveNode');
}

class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
}

class MockNavigationService {
    detail = jasmine.createSpy('detail').and.returnValue({ navigate: () => { } });
    clearDetail = jasmine.createSpy('clearDetail').and.returnValue({ navigate: () => { } });
    list = jasmine.createSpy('list').and.returnValue({ commands: () => { } });
}

class MockI18nService {
    translate(str: string): string {
        return str;
    }
}

@Component({ selector: 'node-language-switcher', template: '' })
class MockLanguageSwitcherComponent {
    @Input() node: any;
}

@Component({ selector: 'form-generator', template: '' })
class MockFormGeneratorComponent {
    @Input()schema: any;
    @Input() node: any;
    isDirty = true;
    setPristine = jasmine.createSpy('setPristine');
}

@Component({ selector: 'mesh-node-tags-bar', template: '' })
class MockNodeTagsBarComponent {
    @Input() node: any;
    isDirty = true;
    nodeTags = [];
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
