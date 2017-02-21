import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NumberFieldComponent} from './number-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('NumberFieldComponent:', () => {

    let comp: NumberFieldComponent;
    let fixture: ComponentFixture<NumberFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [NumberFieldComponent]
        })
        .compileComponents();
    }));

});
