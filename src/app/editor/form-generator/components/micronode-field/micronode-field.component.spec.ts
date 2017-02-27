import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MicronodeFieldComponent } from './micronode-field.component';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { FieldControlGroupService } from '../../providers/field-control-group/field-control-group.service';

describe('MicronodeFieldComponent:', () => {

    let comp: MicronodeFieldComponent;
    let fixture: ComponentFixture<MicronodeFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MicronodeFieldComponent],
            providers: [FieldGeneratorService, FieldControlGroupService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MicronodeFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });
});
