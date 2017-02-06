import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HtmlFieldComponent} from './html-field.component';

describe('HtmlFieldComponent:', () => {

    let comp: HtmlFieldComponent;
    let fixture: ComponentFixture<HtmlFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HtmlFieldComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HtmlFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });
  

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
