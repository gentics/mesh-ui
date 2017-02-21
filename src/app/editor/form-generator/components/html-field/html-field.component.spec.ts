import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HtmlFieldComponent} from './html-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('HtmlFieldComponent:', () => {

    let comp: HtmlFieldComponent;
    let fixture: ComponentFixture<HtmlFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [HtmlFieldComponent]
        })
        .compileComponents();
    }));

});
