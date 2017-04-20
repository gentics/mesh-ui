import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { ListFieldComponent } from './list-field.component';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';

describe('ListFieldComponent:', () => {

    let comp: ListFieldComponent;
    let fixture: ComponentFixture<ListFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule],
            declarations: [ListFieldComponent],
            providers: [FieldGeneratorService]
        })
        .compileComponents();
    }));

});
