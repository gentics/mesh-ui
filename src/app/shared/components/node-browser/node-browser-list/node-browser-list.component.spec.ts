import { async, ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { GenticsUICoreModule } from 'gentics-ui-core';

import { MockI18nPipe } from '../../../pipes/i18n/i18n.pipe.mock';
=======
>>>>>>> Add node browser

import { NodeBrowserListComponent } from './node-browser-list.component';

describe('NodeBrowserListComponent', () => {
    let component: NodeBrowserListComponent;
    let fixture: ComponentFixture<NodeBrowserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
<<<<<<< HEAD
            declarations: [NodeBrowserListComponent, MockI18nPipe],
            imports: [GenticsUICoreModule]
=======
            declarations: [NodeBrowserListComponent]
>>>>>>> Add node browser
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
