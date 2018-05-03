import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';
import { BooleanFieldComponent } from './boolean-field.component';

describe('BooleanFieldComponent:', () => {

    let fixture: ComponentFixture<BooleanFieldComponent>;
    let instance: BooleanFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [BooleanFieldComponent]
        });
        fixture = TestBed.createComponent(BooleanFieldComponent);
        instance = fixture.componentInstance;
    });

    it('invokes api.setValue() on changes', () => {
        const api = new MockMeshFieldControlApi();
        instance.init(api);

        expect(api.setValue).not.toHaveBeenCalled();
        instance.onChange(false);
        expect(api.setValue).toHaveBeenCalledWith(false);
    });
});
