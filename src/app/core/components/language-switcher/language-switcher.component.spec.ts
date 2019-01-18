import { Component } from '@angular/core';
import { tick, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownItem, OverlayHostService } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { ConfigService } from '../../providers/config/config.service';
import { MockConfigService } from '../../providers/config/config.service.mock';
import { I18nService } from '../../providers/i18n/i18n.service';

import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent:', () => {
    let appState: TestApplicationState;

    beforeEach(() => {
        configureComponentTest({
            declarations: [TestComponent, LanguageSwitcherComponent, MockI18nPipe],
            imports: [SharedModule, TestStateModule],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                OverlayHostService,
                { provide: I18nService, useValue: { setLanguage() {} } }
            ]
        });
    });

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        // Initial language is english
        appState.mockState({
            ui: {
                currentLanguage: 'en'
            }
        });
    });

    it(
        `shows the current selected language`,
        componentTest(
            () => TestComponent,
            fixture => {
                fixture.detectChanges();
                const buttonText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
                expect(buttonText).toContain('translated lang.en');
            }
        )
    );

    it(
        `has an option for each available language`,
        componentTest(
            () => TestComponent,
            fixture => {
                fixture.detectChanges();

                // Open dropdown
                const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                button.click();

                fixture.detectChanges();
                tick();

                const config = new MockConfigService();
                const dropdownItems = fixture.debugElement.queryAll(By.directive(DropdownItem));
                expect(dropdownItems.length).toEqual(config.UI_LANGUAGES.length);
            }
        )
    );

    it(
        `updates the change when the user selects a language`,
        componentTest(
            () => TestComponent,
            fixture => {
                fixture.detectChanges();

                // Open dropdown
                const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                button.click();

                fixture.detectChanges();
                tick();

                // Select german
                const dropdownItems = fixture.debugElement.queryAll(By.directive(DropdownItem));
                const germanButton = dropdownItems.filter(
                    item => item.nativeElement.textContent.trim() === 'Deutsch'
                )[0];
                expect(germanButton).toBeDefined('german button not found');
                germanButton.triggerEventHandler('click', {});

                fixture.detectChanges();
                tick();

                // The state must have been updated
                expect(appState.actions.ui.setLanguage).toHaveBeenCalledWith('de');
            }
        )
    );

    it(
        `changes the active label when the language is changed in the state`,
        componentTest(
            () => TestComponent,
            fixture => {
                // English at first
                fixture.detectChanges();
                const buttonText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
                expect(buttonText).toContain('translated lang.en');

                // Change state
                appState.mockState({
                    ui: {
                        currentLanguage: 'de'
                    }
                });

                // Label shows German now
                fixture.detectChanges();
                const buttonTextAfter: string = fixture.nativeElement.querySelector('gtx-button').innerText;
                expect(buttonTextAfter).toContain('translated lang.de');
            }
        )
    );
});

@Component({
    template: `
        <gtx-overlay-host></gtx-overlay-host>
        <mesh-language-switcher></mesh-language-switcher>`
})
class TestComponent {}
