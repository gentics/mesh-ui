import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePermissionsComponent } from './node-permissions.component';

xdescribe('NodePermissionsComponent', () => {
    let component: NodePermissionsComponent;
    let fixture: ComponentFixture<NodePermissionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NodePermissionsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NodePermissionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
