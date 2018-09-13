import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { MockI18nPipe } from '../../../pipes/i18n/i18n.pipe.mock';
import { IconCheckboxComponent } from '../../icon-checkbox/icon-checkbox.component';

import { NodeBrowserListComponent } from './node-browser-list.component';

describe('NodeBrowserListComponent', () => {
    let component: NodeBrowserListComponent;
    let fixture: ComponentFixture<NodeBrowserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NodeBrowserListComponent, MockI18nPipe, IconCheckboxComponent],
            imports: [GenticsUICoreModule]
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
