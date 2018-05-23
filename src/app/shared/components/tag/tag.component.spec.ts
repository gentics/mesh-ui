import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from 'gentics-ui-core';

import { TagComponent } from './tag.component';
import { ChipComponent } from '../chip/chip.component';
import { BackgroundFromDirective } from '../../directives/background-from.directive';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { HighlightPipe } from '../../pipes/highlight/highlight.pipe';

describe('TagComponent', () => {
    let component: TagComponent;
    let fixture: ComponentFixture<TagComponent>;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TagComponent,
                ChipComponent,
                BackgroundFromDirective,
                HighlightPipe,
                Icon
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TagComponent);
        component = fixture.componentInstance;
        component.tag = { uuid: 'uuid', tagFamily: 'tagFamily'};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
