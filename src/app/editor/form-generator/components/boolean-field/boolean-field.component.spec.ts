import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {StringFieldComponent} from './boolean-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('StringFieldComponent:', () => {

    let comp: StringFieldComponent;
    let fixture: ComponentFixture<StringFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [StringFieldComponent]
        })
        .compileComponents();
    }));

});
