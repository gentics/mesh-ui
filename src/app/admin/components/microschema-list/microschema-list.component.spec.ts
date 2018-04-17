import { async, TestBed } from '@angular/core/testing';
import { Button, GenticsUICoreModule } from 'gentics-ui-core';
import { By } from '@angular/platform-browser';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { MicroschemaListComponent } from './mircoschema-list.component';
import { Router, RouterModule } from '@angular/router';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

describe('MicroSchemaListComponent', () => {

    let appState: TestApplicationState;
    const mockModal = { fromComponent() { } };
    let mockAdminSchemaEffects;
    let mockRouter;

    beforeEach(async(() => {
        spyOn(mockModal, 'fromComponent').and.returnValue(Promise.resolve({ open() { } }));
        mockAdminSchemaEffects = jasmine.createSpyObj('MicroSchemaEffects', ['loadMicroschemas']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        configureComponentTest({
            declarations: [MicroschemaListComponent],
            imports: [GenticsUICoreModule, RouterModule, TestStateModule],
            providers: [
                { provide: AdminSchemaEffectsService, useValue: mockAdminSchemaEffects },
                { provide: Router, useValue: mockRouter },
            ]
        });

        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({});
    }));

    it(`loads the microschemas`,
        componentTest(() => MicroschemaListComponent, fixture => {
            fixture.detectChanges();
            expect(mockAdminSchemaEffects.loadMicroschemas).toHaveBeenCalled();
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
