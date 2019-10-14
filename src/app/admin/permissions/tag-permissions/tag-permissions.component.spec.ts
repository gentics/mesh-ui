import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPermissionsComponent } from './tag-permissions.component';

xdescribe('TagPermissionsComponent', () => {
    let component: TagPermissionsComponent;
    let fixture: ComponentFixture<TagPermissionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagPermissionsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagPermissionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
