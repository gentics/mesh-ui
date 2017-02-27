import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGeneratorComponent} from './form-generator.component';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { FieldControlGroupService } from '../../providers/field-control-group/field-control-group.service';

describe('FormGeneratorComponent:', () => {

    let comp: FormGeneratorComponent;
    let fixture: ComponentFixture<FormGeneratorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormGeneratorComponent],
            providers: [FieldGeneratorService, FieldControlGroupService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormGeneratorComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
