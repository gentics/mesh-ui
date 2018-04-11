import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from 'gentics-ui-core';

import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
    let component: ChipComponent;
    let fixture: ComponentFixture<ChipComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ChipComponent,
                Icon
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
