import { Pipe, PipeTransform } from '@angular/core';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { HighlightPipe } from '../../../shared/pipes/highlight/highlight.pipe';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';

import { MockTagsEffectsService } from '../../../core/providers/effects/tags-effects.service.mock';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { CreateTagDialogComponent } from './create-tag-dialog.component';

describe('CreateTagDialogComponent', () => {
    let component: CreateTagDialogComponent;
    let fixture: ComponentFixture<CreateTagDialogComponent>;
    let tagsEffecsService: MockTagsEffectsService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [CreateTagDialogComponent, MockI18nPipe, HighlightPipe],
            providers: [
                OverlayHostService,
                EntitiesService,
                { provide: TagsEffectsService, useClass: MockTagsEffectsService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useClass: MockConfigService }
            ],
            imports: [FormsModule, GenticsUICoreModule]
        });

        tagsEffecsService = TestBed.get(TagsEffectsService);
        fixture = TestBed.createComponent(CreateTagDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(
        'should create new family',
        fakeAsync(() => {
            component.closeFn = jasmine.createSpy('closeFn');
            fixture.componentInstance.inputTagFamilyValue = 'new family name';
            fixture.componentInstance.newTagName = 'new name';

            const buttonSave = fixture.debugElement.query(By.css('.button_save'));
            buttonSave.triggerEventHandler('click', null);
            expect(tagsEffecsService.createTagFamily).toHaveBeenCalled();
        })
    );

    it(
        'should create new node',
        fakeAsync(() => {
            component.closeFn = jasmine.createSpy('closeFn');
            fixture.componentInstance.inputTagFamilyValue = 'new family name';
            fixture.componentInstance.newTagName = 'new name';

            const buttonSave = fixture.debugElement.query(By.css('.button_save'));
            buttonSave.triggerEventHandler('click', null);
            tick();
            expect(tagsEffecsService.createTag).toHaveBeenCalled();
        })
    );
});
