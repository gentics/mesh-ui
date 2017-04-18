import { UILanguage } from '../../shared/providers/i18n/i18n.service';

/** UI localizations */
export const UI_LANGUAGES: UILanguage[] = [
    {
        code: 'en',
        name: 'English'
    },
    {
        code: 'de',
        name: 'Deutsch'
    }
];

/** Language used when no translation is found in the current language */
export const FALLBACK_LANGUAGE = 'en';
