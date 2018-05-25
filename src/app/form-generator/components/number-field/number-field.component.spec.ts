import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { errorHashFor, ErrorCode } from '../../common/form-errors';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';

import { NumberFieldComponent } from './number-field.component';
import createSpy = jasmine.createSpy;

describe('NumberFieldComponent:', () => {
    let fixture: ComponentFixture<NumberFieldComponent>;
    let instance: NumberFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [NumberFieldComponent]
        });
        fixture = TestBed.createComponent(NumberFieldComponent);
        instance = fixture.componentInstance;
    });

    it('invokes api.setValue() on changes', () => {
        const api = new MockMeshFieldControlApi();
        instance.init(api);

        expect(api.setValue).not.toHaveBeenCalled();
        instance.onChange(42);
        expect(api.setValue).toHaveBeenCalledWith(42);
    });

    describe('validity', () => {
        let api: MockMeshFieldControlApi;

        beforeEach(() => {
            api = new MockMeshFieldControlApi();
            api.field = {
                name: 'test',
                type: 'string'
            };
        });

        it('correctly sets error when required == true', () => {
            api.field.required = true;
            api.getValue = createSpy('getValue').and.returnValue(null);
            instance.init(api);
            expect(api.setError.calls.argsFor(0)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.REQUIRED))
            );

            instance.onChange(42);
            expect(api.setError.calls.argsFor(1)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.REQUIRED, false))
            );
        });

        it('correctly sets error when required == true for a value of 0', () => {
            api.field.required = true;
            api.getValue = createSpy('getValue').and.returnValue(0);
            instance.init(api);
            expect(api.setError.calls.argsFor(0)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.REQUIRED, false))
            );
        });

        it('correctly sets error when required == true for a value of NaN', () => {
            api.field.required = true;
            api.getValue = createSpy('getValue').and.returnValue(NaN);
            instance.init(api);
            expect(api.setError.calls.argsFor(0)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.REQUIRED))
            );
        });

        it('correctly sets error when required == false', () => {
            api.getValue = createSpy('getValue').and.returnValue(null);
            api.field.required = false;
            instance.init(api);
            expect(api.setError.calls.argsFor(0)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.REQUIRED, false))
            );

            instance.onChange(42);
            expect(api.setError.calls.argsFor(1)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.REQUIRED, false))
            );
        });

        it('correctly sets error when min is violated', () => {
            api.getValue = createSpy('getValue').and.returnValue(9);
            api.field.min = 10;
            instance.init(api);
            expect(api.setError.calls.argsFor(0)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.MIN_VALUE))
            );
        });

        it('correctly sets error when max is violated', () => {
            api.getValue = createSpy('getValue').and.returnValue(101);
            api.field.max = 100;
            instance.init(api);
            expect(api.setError.calls.argsFor(0)[0]).toEqual(
                jasmine.objectContaining(errorHashFor(ErrorCode.MAX_VALUE))
            );
        });
    });
});
