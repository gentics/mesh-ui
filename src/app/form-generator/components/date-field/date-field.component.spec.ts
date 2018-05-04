import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GenticsUICoreModule, ModalService, OverlayHostService } from 'gentics-ui-core';

import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';

import { DateFieldComponent } from './date-field.component';
import createSpy = jasmine.createSpy;

describe('DateFieldComponent:', () => {
    let fixture: ComponentFixture<DateFieldComponent>;
    let instance: DateFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [DateFieldComponent],
            providers: [ModalService, OverlayHostService]
        });
        fixture = TestBed.createComponent(DateFieldComponent);
        instance = fixture.componentInstance;
    });

    it('init() sets the correct timestampValue', () => {
        const api = new MockMeshFieldControlApi();
        const testDateString = '2017-02-01T14:15:19.000Z';
        const testTimestamp = new Date(testDateString).getTime() / 1000;
        api.getValue = createSpy('getValue').and.returnValue(testDateString);
        instance.init(api);

        expect(instance.timestampValue).toBe(testTimestamp);
    });

    it('valueChange() sets the correct timestampValue', () => {
        const api = new MockMeshFieldControlApi();
        const testDateString = '2017-02-01T14:15:19.000Z';
        const testTimestamp = new Date(testDateString).getTime() / 1000;
        instance.init(api);
        instance.valueChange(testDateString);

        expect(instance.timestampValue).toBe(testTimestamp);
    });

    it('invokes api.setValue() on changes with correct format', () => {
        const api = new MockMeshFieldControlApi();
        instance.init(api);

        const testTimestamp = 1457971763;
        const testTimestampIsoString = new Date(testTimestamp * 1000).toISOString();

        expect(api.setValue).not.toHaveBeenCalled();
        instance.onChange(testTimestamp);
        expect(api.setValue).toHaveBeenCalledWith(testTimestampIsoString);
    });

    it('sets date picker to disabled if in readOnly mode', () => {
        const api = new MockMeshFieldControlApi();
        api.readOnly = true;
        instance.init(api);
        const datePickerInput: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        fixture.detectChanges();

        expect(datePickerInput.disabled).toBe(true);
    });
});
