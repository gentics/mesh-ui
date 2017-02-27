import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { NodeFieldComponent } from './node-field.component';
import { GenticsUICoreModule } from 'gentics-ui-core';

describe('NumberFieldComponent:', () => {

    let comp: NodeFieldComponent;
    let fixture: ComponentFixture<NodeFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [NodeFieldComponent]
        })
        .compileComponents();
    }));

});
