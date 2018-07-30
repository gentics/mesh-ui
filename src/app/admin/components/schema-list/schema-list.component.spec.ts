import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GenticsUICoreModule, ModalService } from 'gentics-ui-core';

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
import { MockAdminListItemComponent } from '../admin-list-item/admin-list-item.component.mock';
import { AdminListComponent } from '../admin-list/admin-list.component';

import { SchemaListComponent } from './schema-list.component';

fdescribe('SchemaListComponent', () => {
    let appState: TestApplicationState;
    const mockModal = { fromComponent() {} };
    let mockAdminSchemaEffects: any;
    let mockRouter: any;

    beforeEach(async(() => {
        spyOn(mockModal, 'fromComponent').and.returnValue(Promise.resolve({ open() {} }));
        mockAdminSchemaEffects = jasmine.createSpyObj('SchemaEffects', ['loadSchemas']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        configureComponentTest({
            declarations: [SchemaListComponent, AdminListComponent, MockAdminListItemComponent],
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
        `should create`,
        componentTest(
            () => SchemaListComponent,
            fixture => {
                expect(fixture.componentInstance).toBeTruthy();
            }
        )
    );

    it(
        `loads the schemas`,
        componentTest(
            () => SchemaListComponent,
            fixture => {
                fixture.detectChanges();
                expect(mockAdminSchemaEffects.loadSchemas).toHaveBeenCalled();
            }
        )
    );

    it(
        `navigates to new schema`,
        componentTest(
            () => SchemaListComponent,
            fixture => {
                fixture.debugElement.query(By.css('.list-controls > gtx-button')).nativeElement.click();
                fixture.detectChanges();
                expect(mockRouter.navigate).toHaveBeenCalledWith(['admin', 'schemas', 'new']);
            }
        )
    );
});
