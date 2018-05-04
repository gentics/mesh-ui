import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { errorHashFor, ErrorCode } from '../../common/form-errors';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';

import { StringFieldComponent } from './string-field.component';
import createSpy = jasmine.createSpy;

describe('StringFieldComponent:', () => {
    let fixture: ComponentFixture<StringFieldComponent>;
    let instance: StringFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [StringFieldComponent]
        });
        fixture = TestBed.createComponent(StringFieldComponent);
        instance = fixture.componentInstance;
    });

    it('invokes api.setValue() on changes', () => {
        const api = new MockMeshFieldControlApi();
        instance.init(api);

        expect(api.setValue).not.toHaveBeenCalled();
        instance.onChange('foo');
        expect(api.setValue).toHaveBeenCalledWith('foo');
    });

    describe('validity', () => {
        let api: MockMeshFieldControlApi;

        beforeEach(() => {
            api = new MockMeshFieldControlApi();
            api.field = {
                name: 'test',
                type: 'string'
            };
            api.getValue = createSpy('getValue').and.returnValue('');
        });

        it('correctly sets error when required == true', () => {
            api.field.required = true;
            instance.init(api);
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED));

            instance.onChange('foo');
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));
        });

        it('correctly sets error when required == false', () => {
            api.field.required = false;
            instance.init(api);
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));

            instance.onChange('foo');
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));
        });

        it('correctly sets error when required == undefined', () => {
            api.field.required = undefined;
            instance.init(api);
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));

            instance.onChange('foo');
            expect(api.setError).toHaveBeenCalledWith(errorHashFor(ErrorCode.REQUIRED, false));
        });
    });
});
