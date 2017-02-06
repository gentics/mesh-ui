import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {StringFieldComponent} from './string-field.component';

describe('StringFieldComponent:', () => {

    let comp: StringFieldComponent;
    let fixture: ComponentFixture<StringFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StringFieldComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StringFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });
  

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
