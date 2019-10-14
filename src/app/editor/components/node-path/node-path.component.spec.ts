import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePathComponent } from './node-path.component';

xdescribe('NodePathComponent', () => {
    let component: NodePathComponent;
    let fixture: ComponentFixture<NodePathComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NodePathComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NodePathComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
