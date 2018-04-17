import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { TagSelectorComponent } from './tag-selector.component';
import { BackgroundFromDirective } from '../../directives/background-from.directive';
import { HighlightPipe } from '../../pipes/highlight/highlight.pipe';
import { configureComponentTest } from '../../../../testing/configure-component-test';

describe('TagSelectorComponent', () => {
    let component: TagSelectorComponent;
    let fixture: ComponentFixture<TagSelectorComponent>;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TagSelectorComponent,
                BackgroundFromDirective,
                HighlightPipe
            ],
            imports: [
                GenticsUICoreModule.forRoot()
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TagSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
