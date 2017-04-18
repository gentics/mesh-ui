import { Component } from '@angular/core';
import { I18nService, UILanguage, UILanguageCode } from '../../../shared/providers/i18n/i18n.service';
import { UI_LANGUAGES } from '../../../common/config/config';
import { Observable } from 'rxjs';
import { AppState } from '../../../state/providers/app-state.service';

@Component({
    selector: 'language-switcher',
    templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {


    availableLanguages: UILanguage[];
    currentLanguage: Observable<UILanguage>;

    constructor(private appState: AppState,
                private i18n: I18nService) {
        this.availableLanguages = UI_LANGUAGES;
        this.currentLanguage = appState.changes$.map(state => state.currentLanguage).map(this.languageCodeToObject);
    }

    languageCodeToObject(languageCode: string): UILanguage {
        let language = UI_LANGUAGES.find(it => it.code === languageCode);
        if (!language) {
            throw 'Language not found!';
        }

        return language;
    }

    onChange(language: UILanguage): void {
        // TODO: Create state action which handles this
        this.appState.set('currentLanguage', language.code);
        this.i18n.setLanguage(language.code as UILanguageCode);
    }
}
