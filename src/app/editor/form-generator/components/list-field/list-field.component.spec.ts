import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ListFieldComponent} from './list-field.component';

describe('ListFieldComponent:', () => {

    let comp: ListFieldComponent;
    let fixture: ComponentFixture<ListFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListFieldComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });
  

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
