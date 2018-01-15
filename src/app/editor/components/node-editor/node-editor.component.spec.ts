import { Component, Input } from '@angular/core';
import { TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavigationService, InstructionActions } from '../../../core/providers/navigation/navigation.service';
import { NodeEditorComponent } from './node-editor.component';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { componentTest } from '../../../../testing/component-test';
import { By } from '@angular/platform-browser';
import { SchemaLabelComponent } from '../../../shared/components/schema-label/schema-label.component';
import { VersionLabelComponent } from '../version-label/version-label.component';
import { Button, Icon, DropdownTriggerDirective } from 'gentics-ui-core';
import { NodeLanguageSwitcherComponent } from '../node-language-switcher/node-language-switcher.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { NodeLanguageLabelComponent } from '../language-label/language-label.component';
import { DropdownContent } from 'gentics-ui-core/dist/components/dropdown-list/dropdown-content.component';
import { ConfigService } from '../../../core/providers/config/config.service';
import { mockSchema, mockMeshNode } from '../../../../testing/mock-models';
import { FormGeneratorComponent } from '../../form-generator/components/form-generator/form-generator.component';
import { FieldGeneratorService } from '../../form-generator/providers/field-generator/field-generator.service';
import { MeshControlGroupService } from '../../form-generator/providers/field-control-group/mesh-control-group.service';

describe('NodeEditorComponent', () => {
    let editorEffectsService: MockEditorEffectsService;
    let state: TestApplicationState;

    beforeEach(() => {
        configureComponentTest({
            declarations: [ 
                NodeEditorComponent,
                SchemaLabelComponent,
                VersionLabelComponent,
                NodeLanguageLabelComponent,
                Button,
                Icon,
                MockLanguageSwitcher,
                FormGeneratorComponent
            ],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                EntitiesService,
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: []} },
                { provide: FieldGeneratorService, useClass: MockFieldGeneratorService },
                { provide: MeshControlGroupService, useClass: MockMeshControlGroupService },
            ],

            imports: [ RouterTestingModule.withRoutes([]) ]
        });
        editorEffectsService = TestBed.get(EditorEffectsService);
        state = TestBed.get(ApplicationStateService);
        navigator
    });

    describe('saving a new node', () => {
        it('calls EditorEffectsService.saveNewNode',
            componentTest( () => NodeEditorComponent, (fixture, instance) => {
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
                            uuid1 : mockSchema({uuid: 'uuid1', version: '0.1'}),
                        },
                        node: { 
                            uuid_parentNode: mockMeshNode({uuid: 'uuid_parentNode', })
                        }
                    }
                });
                fixture.detectChanges();
                tick();
                (fixture.debugElement.query(By.css('.save-button')).nativeElement as HTMLElement).click();
                tick();
                expect(editorEffectsService.saveNewNode).toHaveBeenCalled();
            })
        );
    });
});

class MockEditorEffectsService {
    saveNewNode = jasmine.createSpy('saveNewNode').and.returnValue(Promise.resolve({}));
    closeEditor = jasmine.createSpy('closeEditor');
    openNode = jasmine.createSpy('openNode');
    createNode = jasmine.createSpy('createNode');
}

class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
}

class MockNavigationService {
    detail = jasmine.createSpy('detail').and.returnValue({ navigate: () => {} });
}

class MockI18nService {
    translate(str: string):string {
        return str;
    }
}

class MockFieldGeneratorService {
    create() {}
}

class MockMeshControlGroupService {
    reset() {}
    isDirty() { return true; }
}

@Component({selector: 'node-language-switcher', template: ''})
class MockLanguageSwitcher {
    @Input()
    node: any;
}

@Component({selector: 'form-generator', template: ''})
class MockFormGeneratorComponent {
    @Input()
    schema: any;

    @Input()
    node: any;
}
