import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGeneratorComponent} from './form-generator.component';

describe('FormGeneratorComponent:', () => {

    let comp: FormGeneratorComponent;
    let fixture: ComponentFixture<FormGeneratorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormGeneratorComponent]
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
