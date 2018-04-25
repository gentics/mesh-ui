import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { configureComponentTest } from '../../../../testing/configure-component-test';
import { UserGroupSelectComponent } from './user-group-select.component';

describe('UserGroupSelectComponent', () => {
    let component: UserGroupSelectComponent;
    let fixture: ComponentFixture<UserGroupSelectComponent>;

    beforeEach(async(() => {
        configureComponentTest({
            declarations: [ UserGroupSelectComponent ],
            imports: [ GenticsUICoreModule ],
            providers: [ OverlayHostService ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserGroupSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
