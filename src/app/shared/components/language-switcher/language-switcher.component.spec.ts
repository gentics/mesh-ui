import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StateModule } from '../../../state/state.module';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { SharedModule } from '../../shared.module';
import { AppState } from '../../../state/providers/app-state.service';

describe('LanguageSwitcherComponent:', () => {

    let comp: LanguageSwitcherComponent;
    let fixture: ComponentFixture<LanguageSwitcherComponent>;
    let appState: AppState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, StateModule],
            providers: [
                AppState
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageSwitcherComponent);
        comp = fixture.componentInstance;
        appState = fixture.debugElement.injector.get(AppState);
        spyOn(appState, 'set');

        fixture.detectChanges();
    });

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    it(`should change state if language is changed`, () => {
        // Default language is english
        comp.onChange('de');
        expect(appState.set).toHaveBeenCalled();
    });

    it(`should NOT change state if same language is selected`, () => {
        // Since default language is english, setting it to english should do nothing
        comp.onChange('en');
        expect(appState.set).not.toHaveBeenCalled();
    });
});
