import { Component, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { HighlightPipe } from '../../../shared/pipes/highlight/highlight.pipe';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { AvailableLanguagesListComponent } from '../available-languages-list/available-languages-list.component';

import { NodeRowComponent } from './node-row.component';

describe('NodeRowComponent', () => {
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
                TestComponent
            ],
            providers: [
                EntitiesService,
                OverlayHostService,
                { provide: ModalService, useClass: MockModalService },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ListEffectsService, useClass: MockListEffectsService },
                { provide: ApiService, useClass: MockApiService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ActivatedRoute }
            ],
            imports: [GenticsUICoreModule, RouterTestingModule.withRoutes([])]
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
        <mesh-node-row [node]="node" [listLanguage]="listLanguage"></mesh-node-row>
        <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {
    node: MeshNode;
    listLanguage: string;
}

@Pipe({ name: 'displayField' })
class MockDisplayFieldPipe implements PipeTransform {
    transform(a: any): any {
        return a;
    }
}

class MockListEffectsService {
    loadChildren = jasmine.createSpy('loadChildren');
    // deleteNode = jasmine.createSpy('deleteNode');
    deleteNode = jasmine.createSpy('deleteNode');
    loadSchemasForProject = () => {};
    loadMicroschemasForProject = () => {};
    setActiveContainer = (projectName: string, containerUuid: string, language: string) => {};
}

class MockNavigationService {
    list = jasmine.createSpy('list').and.returnValue({ commands: () => {} });
    detail = jasmine.createSpy('detail').and.returnValue({ navigate: () => {}, commands: () => {} });
}

class MockI18nService {
    translate(str: string): string {
        return str;
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
