import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { SharedModule } from '../../../shared.module';

import { NodeBrowserListComponent } from './node-browser-list.component';

describe('NodeBrowserListComponent', () => {
    let component: NodeBrowserListComponent;
    let fixture: ComponentFixture<NodeBrowserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, SharedModule]
        }).compileComponents();

        fixture = TestBed.createComponent(NodeBrowserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
