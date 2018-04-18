import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { ModalService, GenticsUICoreModule } from 'gentics-ui-core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';

import { ConflictedFieldComponent } from './conflicted-field.component';


describe('ConflictedFieldComponent', () => {
    let component: ConflictedFieldComponent;
    let fixture: ComponentFixture<ConflictedFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConflictedFieldComponent,
                MockI18nPipe
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useClass: MockConfigService },
            ],
            imports: [
                GenticsUICoreModule
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConflictedFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        component.conflictedField = {
            field: { type: '__TAGS__', name: 'somename' },
            mineValue: 'somavalue',
            theirValue: 'somevalue',
            overwrite: false,
            conflictedFields: []
        };
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render recursively for the micronode', () => {
        component.conflictedField = {
            field: { type: 'micronode', name: 'micronode' },
            mineValue: 'somavalue',
            theirValue: 'somevalue',
            overwrite: false,
            conflictedFields: [
                {
                    field: { type: 'number', name: 'number' },
                    mineValue: '1',
                    theirValue: '2',
                    overwrite: false
                },

                {
                    field: { type: 'string', name: 'title' },
                    mineValue: 'mine title',
                    theirValue: 'theirs title',
                    overwrite: true
                }
            ]
        };
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.micronode-row')).length).toEqual(1);
        expect(fixture.debugElement.queryAll(By.css('.micronode-row .change-item')).length)
            .toEqual(component.conflictedField.conflictedFields.length);
    });


    it('should allow the user to select the prefered version', () => {
        component.conflictedField = {
            field: { type: '__TAGS__', name: 'somename' },
            mineValue: 'somavalue',
            theirValue: 'somevalue',
            overwrite: false,
            conflictedFields: []
        };
        fixture.detectChanges();

        const theirElement: DebugElement = fixture.debugElement.query(By.css('.their-val'));
        const mineElement: DebugElement = fixture.debugElement.query(By.css('.mine-val'));

        // First their version is selected because of overwrite: false in the conflictedField definition
        expect(theirElement.classes['selected']).toBeTruthy();
        expect(mineElement.classes['selected']).toBeFalsy();

        mineElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        // Now our version should be selected
        expect(theirElement.classes['selected']).toBeFalsy();
        expect(mineElement.classes['selected']).toBeTruthy();
    });
});

@Pipe({
    name: 'i18n'
})
class MockI18nPipe implements PipeTransform {
    transform(arg) {
        return `translated ${arg}`;
    }
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
