import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeBrowserListComponent } from './node-browser-list.component';

describe('NodeBrowserListComponent', () => {
    let component: NodeBrowserListComponent;
    let fixture: ComponentFixture<NodeBrowserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NodeBrowserListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeBrowserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
