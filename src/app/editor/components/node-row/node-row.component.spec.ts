import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { By } from '@angular/platform-browser';
import { DebugElement, Pipe, PipeTransform, Component } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { ModalService, GenticsUICoreModule, DropdownTriggerDirective, DropdownItem, OverlayHostService } from 'gentics-ui-core';
import { EntitiesService } from '../../../state/providers/entities.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { ApiService } from '../../../core/providers/api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { MeshNode } from '../../../common/models/node.model';
import { componentTest } from '../../../../testing/component-test';
import { NodeRowComponent } from './node-row.component';
import { AvailableLanguagesListComponent } from '../available-languages-list/available-languages-list.component';
import { ConfigService } from '../../../core/providers/config/config.service';
import { mockMeshNode } from '../../../../testing/mock-models';
import { HighlightPipe } from '../../../shared/pipes/highlight/highlight.pipe';

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
                TestComponent,
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
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
                { provide: ActivatedRoute }
            ],
            imports: [
                GenticsUICoreModule,
                RouterTestingModule.withRoutes([])
            ]
        });

        api = TestBed.get(ApiService);
        modalService = TestBed.get(ModalService);
        listService = TestBed.get(ListEffectsService);
    });


    describe('Deleting new node', () => {
        it('asks the user for confirmation',
            componentTest(() => TestComponent, (fixture, instance) => {
                instance.node = mockMeshNode({language: 'en', version: '1'})['en']['1'];
                openDropdownAndDeleteFirstItem(fixture);

                expect(modalService.dialog).toHaveBeenCalled();
                expect(modalService.fakeDialog.open).toHaveBeenCalled();
            })
        );

        it('deletes the node via the API if the user confirms',
            componentTest(() => TestComponent, (fixture, instance) => {
                instance.node = mockMeshNode({language: 'en', version: '1'})['en']['1'];
                openDropdownAndDeleteFirstItem(fixture);
                expect(api.project.deleteNode).not.toHaveBeenCalled();
                modalService.confirmLastModal();
                expect(listService.deleteNode).toHaveBeenCalled();
            })
        );
    });
});

@Component({
    template: `
        <app-node-row [node]="node" [listLanguage]="listLanguage"></app-node-row>
        <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {
    node: MeshNode;
    listLanguage: string;
}

const routerLinkOf = (node: MeshNode): any[] => [];

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
    loadSchemasForProject = () => { };
    loadMicroschemasForProject = () => { };
    setActiveContainer = (projectName: string, containerUuid: string, language: string) => { };
}

class MockNavigationService {
    list = jasmine.createSpy('list').and.returnValue({ commands: () => { } });
    detail = jasmine.createSpy('detail').and.returnValue({ navigate: () => { }, commands: () => { } });
}

class MockI18nService {
    translate(str: string): string {
        return str;
    }
}

class MockModalService {
    dialog = jasmine.createSpy('dialog').and.callFake(() => Promise.resolve(this.fakeDialog));
    fakeDialog = {
        open: jasmine.createSpy('open').and.callFake(() => {
            return new Promise(resolve => {
                this.confirmLastModal = () => { resolve(); tick(); };
            });
        })
    };
    confirmLastModal: () => void;
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
