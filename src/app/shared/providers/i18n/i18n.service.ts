import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { FALLBACK_LANGUAGE, UI_LANGUAGES } from '../../../common/config/config';

export type UILanguage = 'en' | 'de';

@Injectable()
export class I18nService {

    constructor(private ng2Translate: TranslateService) {
        ng2Translate.setDefaultLang(FALLBACK_LANGUAGE);
    }

    /**
     * Set the UI language
     */
    setLanguage(language: UILanguage): void {
        this.ng2Translate.use(language);
    }

    /**
     * Translate the given key.
     */
    translate(key: string | string[], params?: any): string {
        return this.ng2Translate.instant(key, params);
    }

    /**
     * Attempt to infer the user language from the browser's navigator object. If the result is not
     * amongst the valid UI languages, default to the fallback language instead.
     */
    inferUserLanguage(): UILanguage {
        const browserLanguage = navigator.language.split('-')[0];
        if (UI_LANGUAGES.indexOf(browserLanguage) >= 0) {
            return browserLanguage as any;
        }

        if ((<any> navigator).languages) {
            const languages: string[] = (<any> navigator).languages;
            for (let lang of languages.map(l => l.split('-')[0])) {
                if (UI_LANGUAGES.indexOf(lang) >= 0) {
                    return lang as any;
                }
            }
        }

        return FALLBACK_LANGUAGE as any;
    }
}
