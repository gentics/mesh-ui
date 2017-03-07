import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BinaryFieldComponent } from './binary-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('NumberFieldComponent:', () => {

    let comp: BinaryFieldComponent ;
    let fixture: ComponentFixture<BinaryFieldComponent >;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [BinaryFieldComponent ]
        })
        .compileComponents();
    }));

});
