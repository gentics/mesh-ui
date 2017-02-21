import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MicronodeFieldComponent } from './micronode-field.component';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';

describe('MicronodeFieldComponent:', () => {

    let comp: MicronodeFieldComponent;
    let fixture: ComponentFixture<MicronodeFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MicronodeFieldComponent],
            providers: [FieldGeneratorService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MicronodeFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
