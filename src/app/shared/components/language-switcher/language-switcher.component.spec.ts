import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateModule } from '../../../state/state.module';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { SharedModule } from '../../shared.module';
// import { AppState } from '../../../state/providers/app-state.service';
import { componentTest } from '../../../../testing/component-test';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { By } from '@angular/platform-browser';


describe('LanguageSwitcherComponent:', () => {

    let appState: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, StateModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
    });

    it(`should change state if language is changed`, componentTest(() => LanguageSwitcherComponent, (fixture, comp) => {
        // Default language is english
        comp.changeLanguage('de');
        expect(appState.set).toHaveBeenCalled();
    }));

    it(`should NOT change state if same language is selected`, componentTest(() => LanguageSwitcherComponent, (fixture, comp) => {
        // Since default language is english, setting it to english should do nothing
        comp.changeLanguage('en');
        expect(appState.set).not.toHaveBeenCalled();
    }));
});
