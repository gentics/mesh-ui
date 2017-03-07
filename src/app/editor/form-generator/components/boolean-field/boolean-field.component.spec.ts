import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { BooleanFieldComponent } from './boolean-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('StringFieldComponent:', () => {

    let comp: BooleanFieldComponent;
    let fixture: ComponentFixture<BooleanFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [BooleanFieldComponent]
        })
        .compileComponents();
    }));

});
