import { Component, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownItem } from 'gentics-ui-core';

import { StateModule } from '../../../state/state.module';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { SharedModule } from '../../shared.module';
import { componentTest } from '../../../../testing/component-test';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { UI_LANGUAGES } from '../../../common/config/config';


describe('LanguageSwitcherComponent:', () => {

    let appState: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [SharedModule, StateModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState }
            ]
        })
        .compileComponents();
    }));

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

    it(`shows the current selected language`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            const buttonText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
            expect(buttonText).toContain('English');
        })
    );

    it(`has an option for each available language`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();

            // Open dropdown
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
            button.click();

            fixture.detectChanges();
            tick();

            const dropdownItems = fixture.debugElement.queryAll(By.directive(DropdownItem));
            expect(dropdownItems.length).toEqual(UI_LANGUAGES.length);
        })
    );

    it(`updates the change when the user selects a language`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();

            // Open dropdown
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
            button.click();

            fixture.detectChanges();
            tick();

            // Select german
            const dropdownItems = fixture.debugElement.queryAll(By.directive(DropdownItem));
            const germanButton = dropdownItems
                .filter(item => item.nativeElement.textContent.trim() === 'Deutsch')[0];
            expect(germanButton).toBeDefined('german button not found');
            germanButton.triggerEventHandler('click', {});

            fixture.detectChanges();
            tick();

            // The state must have been updated
            expect(appState.actions.ui.setLanguage).toHaveBeenCalledWith('de');
        })
    );

    it(`changes the active label when the langauge is changed in the state`,
        componentTest(() => TestComponent, fixture => {
            // English at first
            fixture.detectChanges();
            const buttonText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
            expect(buttonText).toContain('English');

            // Change state
            appState.mockState({
                ui: {
                    currentLanguage: 'de'
                }
            });

            // Label shows German now
            fixture.detectChanges();
            const buttonTextAfter: string = fixture.nativeElement.querySelector('gtx-button').innerText;
            expect(buttonTextAfter).toContain('Deutsch');
        })
    );

});


@Component({
    template: `
        <gtx-overlay-host></gtx-overlay-host>
        <language-switcher></language-switcher>`
})
class TestComponent { }

