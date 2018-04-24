import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { AddToGroupButtonComponent } from './add-to-group-button.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';

describe('AddToGroupButtonComponent', () => {
    let component: AddToGroupButtonComponent;
    let fixture: ComponentFixture<AddToGroupButtonComponent>;

    beforeEach(async(() => {
        configureComponentTest({
            declarations: [ AddToGroupButtonComponent ],
            imports: [ GenticsUICoreModule ],
            providers: [ OverlayHostService ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddToGroupButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
