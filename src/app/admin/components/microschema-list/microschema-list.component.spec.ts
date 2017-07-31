import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Button, GenticsUICoreModule, ModalService } from 'gentics-ui-core';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { mockProject } from '../../../../testing/mock-models';
import { MicroschemaListComponent } from './mircoschema-list.component';
import { RouterModule, Router } from '@angular/router';
import { MicroschemaEffectsService } from '../../providers/effects/microschema-effects.service';

describe('MicroSchemaListComponent', () => {

    let appState: TestApplicationState;
    const mockModal = { fromComponent() { } };
    let mockMicroSchemaEffects;
    let mockRouter;

    beforeEach(async(() => {
        spyOn(mockModal, 'fromComponent').and.returnValue(Promise.resolve({ open() { } }));
        mockMicroSchemaEffects = jasmine.createSpyObj('MicroSchemaEffects', ['loadMicroschemas']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [MicroschemaListComponent],
            imports: [GenticsUICoreModule, SharedModule, CoreModule, RouterModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: MicroschemaEffectsService, useValue: mockMicroSchemaEffects },
                { provide: Router, useValue: mockRouter },
            ]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({});
    });

    it(`loads the microschemas`,
        componentTest(() => MicroschemaListComponent, fixture => {
            fixture.detectChanges();
            expect(mockMicroSchemaEffects.loadMicroschemas).toHaveBeenCalled();
        })
    );

    it(`navigates to new microschema`,
        componentTest(() => MicroschemaListComponent, fixture => {
            fixture.debugElement.query(By.directive(Button)).nativeElement.click();
            fixture.detectChanges();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['admin', 'microschemas', 'new']);
        })
    );
});
