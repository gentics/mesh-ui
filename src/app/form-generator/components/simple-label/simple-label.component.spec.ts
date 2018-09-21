import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLabelComponent } from './simple-label.component';

describe('SimpleLabelComponent', () => {
    let component: SimpleLabelComponent;
    let fixture: ComponentFixture<SimpleLabelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SimpleLabelComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
