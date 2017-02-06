import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NumberFieldComponent} from './number-field.component';

describe('NumberFieldComponent:', () => {

    let comp: NumberFieldComponent;
    let fixture: ComponentFixture<NumberFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NumberFieldComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NumberFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });
  

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
