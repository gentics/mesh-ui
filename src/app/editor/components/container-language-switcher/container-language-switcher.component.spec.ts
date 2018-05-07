import { Component, Injectable } from '@angular/core';
import { TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { SharedModule } from '../../../shared/shared.module';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { mockProject } from '../../../../testing/mock-models';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { NodeLanguageLabelComponent } from '../language-label/language-label.component';
import { ContainerLanguageSwitcherComponent } from './container-language-switcher.component';

describe('ContainerLanguageSwitcherComponent:', () => {

    let config: MockConfigService;
    let navigation: MockNavigationService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                ContainerLanguageSwitcherComponent,
                NodeLanguageLabelComponent
            ],
            imports: [
                SharedModule,
                TestStateModule,
                GenticsUICoreModule
            ],
            providers: [
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ConfigService, useClass: MockConfigService },
                OverlayHostService,
            ]
        });
    });

    beforeEach(() => {
        navigation = TestBed.get(NavigationService);
        spyOn(navigation, 'list').and.callThrough();

        config = TestBed.get(ConfigService);
    });

    it(`Display available content languages in a list`,
        componentTest(() => TestComponent, fixture => {
            // Open Select
            fixture.nativeElement.querySelector('.trigger').click();
            fixture.detectChanges();
            tick();

            const items = fixture.debugElement.queryAll(By.css('gtx-dropdown-item'));
            expect (items.length).toEqual(config.CONTENT_LANGUAGES.length - 1); //-1 because the current language should be excluded
        })
    );

    it(`Changes the content language`,
        componentTest(() => TestComponent, fixture => {
            // Open Select
            fixture.nativeElement.querySelector('.trigger').click();
            fixture.detectChanges();
            tick();

            const items = fixture.debugElement.queryAll(By.css('gtx-dropdown-item'));
            items[0].nativeElement.click();

            expect(navigation.list).toHaveBeenCalled();
        })
    );
});


@Component({
    template: `
    <container-language-switcher></container-language-switcher>
    <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {

}

class MockEntitiesService { }

