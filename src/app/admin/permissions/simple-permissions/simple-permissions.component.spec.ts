import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplePermissionsComponent } from './simple-permissions.component';

xdescribe('SimplePermissionsComponent', () => {
    let component: SimplePermissionsComponent;
    let fixture: ComponentFixture<SimplePermissionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SimplePermissionsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SimplePermissionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
