import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DateFieldComponent } from './date-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('HtmlFieldComponent:', () => {

    let comp: DateFieldComponent;
    let fixture: ComponentFixture<DateFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [DateFieldComponent]
        })
        .compileComponents();
    }));

});
