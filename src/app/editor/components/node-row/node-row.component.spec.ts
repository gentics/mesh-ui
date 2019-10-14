import { Component, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DropdownTriggerDirective, GenticsUICoreModule, ModalService, OverlayHostService } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { mockMeshNode } from '../../../../testing/mock-models';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { MeshNode } from '../../../common/models/node.model';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { MockListEffectsService } from '../../../core/providers/effects/list-effects.service.mock';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { AvailableLanguagesListComponent } from '../../../shared/components/available-languages-list/available-languages-list.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { NodeStatusComponent } from '../../../shared/components/node-status/node-status.component';
import { PublishOptionsComponent } from '../../../shared/components/publish-options/publish-options.component';
import { TagComponent } from '../../../shared/components/tag/tag.component';
import { BackgroundFromDirective } from '../../../shared/directives/background-from.directive';
import { HighlightPipe } from '../../../shared/pipes/highlight/highlight.pipe';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { MockEditorEffectsService } from '../../providers/editor-effects.service.mock';

import { NodeRowComponent } from './node-row.component';

xdescribe('NodeRowComponent', () => {
    let api: MockApiService;
    let modalService: MockModalService;
    let listService: MockListEffectsService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                NodeRowComponent,
                MockDisplayFieldPipe,
                HighlightPipe,
                AvailableLanguagesListComponent,
                TestComponent,
                PublishOptionsComponent,
                NodeStatusComponent,
                TagComponent,
                ChipComponent,
                BackgroundFromDirective
            ],
            providers: [
                EntitiesService,
                OverlayHostService,
                { provide: ModalService, useClass: MockModalService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: EditorEffectsService, useClass: MockEditorEffectsService },
                { provide: ApiService, useClass: MockApiService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ActivatedRoute }
            ],
            imports: [NoopAnimationsModule, GenticsUICoreModule, RouterTestingModule.withRoutes([])]
        });

        api = TestBed.get(ApiService);
        modalService = TestBed.get(ModalService);
        listService = TestBed.get(ListEffectsService);
    });

    describe('Deleting new node', () => {
        it(
            'asks the user for confirmation',
            componentTest(
                () => TestComponent,
                (fixture, instance) => {
                    instance.node = mockMeshNode({ language: 'en', version: '1' })['en']['1'];
                    openDropdownAndDeleteFirstItem(fixture);

                    expect(modalService.dialogSpy).toHaveBeenCalled();
                    expect(modalService.fakeModalInstance.open).toHaveBeenCalled();
                }
            )
        );

        it(
            'deletes the node via the API if the user confirms',
            componentTest(
                () => TestComponent,
                (fixture, instance) => {
                    instance.node = mockMeshNode({ language: 'en', version: '1' })['en']['1'];
                    openDropdownAndDeleteFirstItem(fixture);
                    expect(api.project.deleteNode).not.toHaveBeenCalled();
                    modalService.confirmLastModal();
                    expect(listService.deleteNode).toHaveBeenCalled();
                }
            )
        );
    });
});

@Component({
    template: `
        <mesh-node-row [node]="node"></mesh-node-row>
        <gtx-overlay-host></gtx-overlay-host>
    `
})
class TestComponent {
    node: MeshNode;
}

@Pipe({ name: 'displayField' })
class MockDisplayFieldPipe implements PipeTransform {
    transform(a: any): any {
        return a;
    }
}

function findDeleteButton(fixture: ComponentFixture<any>): DebugElement {
    return fixture.debugElement.query(By.css('.item-delete'));
}

function openDropdownAndDeleteFirstItem(fixture: ComponentFixture<any>): void {
    fixture.detectChanges();
    tick();

    const dropdownTrigger = fixture.debugElement.query(By.directive(DropdownTriggerDirective));
    dropdownTrigger.nativeElement.click();
    fixture.detectChanges();

    const deleteButton = findDeleteButton(fixture);
    deleteButton.nativeElement.click();
    tick();
}
