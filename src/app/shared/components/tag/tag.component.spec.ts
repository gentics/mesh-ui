import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from 'gentics-ui-core';

import { configureComponentTest } from '../../../../testing/configure-component-test';
import { BackgroundFromDirective } from '../../directives/background-from.directive';
import { ChipComponent } from '../chip/chip.component';
import { HighlightComponent } from '../highlight/highlight.component';

import { TagComponent } from './tag.component';

describe('TagComponent', () => {
    let component: TagComponent;
    let fixture: ComponentFixture<TagComponent>;

    beforeEach(() => {
        configureComponentTest({
            declarations: [TagComponent, ChipComponent, BackgroundFromDirective, HighlightComponent, Icon]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TagComponent);
        component = fixture.componentInstance;
        component.tag = { uuid: 'uuid', tagFamily: 'tagFamily' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
