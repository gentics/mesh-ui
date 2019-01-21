import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ConfigService } from '../../providers/config/config.service';
import { I18nService, UILanguage } from '../../providers/i18n/i18n.service';

@Component({
    selector: 'mesh-language-switcher',
    templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {
    availableLanguages: string[];
    currentLanguage$: Observable<UILanguage>;

    constructor(config: ConfigService, private appState: ApplicationStateService, private i18n: I18nService) {
        this.availableLanguages = config.UI_LANGUAGES;
        this.currentLanguage$ = appState
            .select(state => state.ui.currentLanguage)
            .map(languageCode => `lang.${languageCode}` as UILanguage);
    }

    changeLanguage(language: UILanguage): void {
        this.appState.actions.ui.setLanguage(language);
        this.i18n.setLanguage(language);
    }
}
