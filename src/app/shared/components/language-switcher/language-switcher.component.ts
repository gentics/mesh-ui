import { Component } from '@angular/core';
import { I18nService, UILanguage } from '../../../shared/providers/i18n/i18n.service';
import { UI_LANGUAGES } from '../../../common/config/config';
import { Observable } from 'rxjs';
import { AppState } from '../../../state/providers/app-state.service';

@Component({
    selector: 'language-switcher',
    templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {

    availableLanguages: string[];
    currentLanguage: Observable<UILanguage>;

    constructor(private appState: AppState,
                private i18n: I18nService) {
        this.availableLanguages = UI_LANGUAGES;
        this.currentLanguage = appState.changes$.map(state => state.currentLanguage);
    }

    onChange(language: UILanguage): void {
        // TODO: Create state action which handles this
        if (this.appState.get('currentLanguage') !== language) {
            this.appState.set('currentLanguage', language);
            this.i18n.setLanguage(language);
        }
    }
}
