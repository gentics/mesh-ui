import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Button, GenticsUICoreModule, ModalService } from 'gentics-ui-core';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { MockActivatedRoute } from '../../../../testing/router-testing-mocks';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { MockAdminListItem } from '../admin-list-item/admin-list-item.component.mock';
import { AdminListComponent } from '../admin-list/admin-list.component';

import { MicroschemaListComponent } from './microschema-list.component';

fdescribe('MicroSchemaListComponent', () => {
    let appState: TestApplicationState;
    const mockModal = { fromComponent() {} };
    let mockAdminSchemaEffects: any;
    let mockRouter: any;

    beforeEach(async(() => {
        spyOn(mockModal, 'fromComponent').and.returnValue(Promise.resolve({ open() {} }));
        mockAdminSchemaEffects = jasmine.createSpyObj('MicroSchemaEffects', ['loadMicroschemas']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        configureComponentTest({
            declarations: [MicroschemaListComponent, AdminListComponent, MockAdminListItem],
            imports: [GenticsUICoreModule, FormsModule, SharedModule, RouterModule, TestStateModule],
            providers: [
                { provide: AdminSchemaEffectsService, useValue: mockAdminSchemaEffects },
                { provide: ModalService, useClass: MockModalService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: I18nService, useClass: MockI18nService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({});
    }));

    it(
        `loads the microschemas`,
        componentTest(
            () => MicroschemaListComponent,
            fixture => {
                fixture.detectChanges();
                expect(mockAdminSchemaEffects.loadMicroschemas).toHaveBeenCalled();
            }
        )
    );

    it(
        `navigates to new microschema`,
        componentTest(
            () => MicroschemaListComponent,
            fixture => {
                fixture.debugElement.query(By.directive(Button)).nativeElement.click();
                fixture.detectChanges();
                expect(mockRouter.navigate).toHaveBeenCalledWith(['admin', 'microschemas', 'new']);
            }
        )
    );
});
