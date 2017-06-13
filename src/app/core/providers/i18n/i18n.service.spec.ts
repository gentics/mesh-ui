import { I18nService } from './i18n.service';
import { FALLBACK_LANGUAGE } from '../../../common/config/config';

describe('I18nService', () => {

    let i18n: I18nService;
    let mockTranslateService: MockTranslateService;

    beforeEach(() => {
        mockTranslateService = new MockTranslateService();
        i18n = new I18nService(mockTranslateService as any);
    });

    it('passes key and params to TranslateService', () => {
        for (let i = 0; i < 100; i++) {
            const key = Math.random().toString(36);
            const params = {
                foo: i
            };
            i18n.translate(key, params);

            expect(mockTranslateService.instant).toHaveBeenCalledWith(key, params);
        }
    });

    describe('inferUserLanguage()', () => {

        let originalNavigator: Navigator;
        let mockNavigator: { language: string; languages: string[] | undefined };
        beforeEach(() => {
            originalNavigator = window.navigator;
            mockNavigator = {
                language: '',
                languages: []
            };
            Object.defineProperty(window, 'navigator', {
                configurable: true,
                enumerable: true,
                value: mockNavigator,
                writable: false
            });
        });
        afterEach(() => {
            Object.defineProperty(window, 'navigator', {
                configurable: true,
                enumerable: true,
                value: originalNavigator,
                writable: false
            });
        });

        it('returns "en" when the browser reports "en"', () => {
            mockNavigator.language = 'en';
            expect(i18n.inferUserLanguage()).toBe('en');
        });

        it('returns "en" when the browser reports "en-GB"', () => {
            mockNavigator.language = 'en-GB';
            expect(i18n.inferUserLanguage()).toBe('en');
        });

        it('returns "en" when the browser reports "en-US"', () => {
            mockNavigator.language = 'en-US';
            expect(i18n.inferUserLanguage()).toBe('en');
        });

        it('returns de" when the browser reports "de"', () => {
            mockNavigator.language = 'de';
            expect(i18n.inferUserLanguage()).toBe('de');
        });

        it('returns "de" when the browser reports "de-DE"', () => {
            mockNavigator.language = 'de-DE';
            expect(i18n.inferUserLanguage()).toBe('de');
        });

        it('returns "de" when the browser reports "de-AT"', () => {
            mockNavigator.language = 'de-AT';
            expect(i18n.inferUserLanguage()).toBe('de');
        });

        it('returns "en" when the browser reports ["fr", "en"]', () => {
            mockNavigator.language = 'fr';
            mockNavigator.languages = ['fr', 'en'];
            expect(i18n.inferUserLanguage()).toBe('en');
        });

        it('returns "en" when the browser reports ["fr", "en-US"]', () => {
            mockNavigator.language = 'fr';
            mockNavigator.languages = ['fr', 'en-US'];
            expect(i18n.inferUserLanguage()).toBe('en');
        });

        it('returns "de" when the browser reports ["it", "de"]', () => {
            mockNavigator.language = 'it';
            mockNavigator.languages = ['it', 'de'];
            expect(i18n.inferUserLanguage()).toBe('de');
        });

        it('returns "de" when the browser reports ["it", "de-AT"]', () => {
            mockNavigator.language = 'it';
            mockNavigator.languages = ['it', 'de-AT'];
            expect(i18n.inferUserLanguage()).toBe('de');
        });

        it(`defaults to "${FALLBACK_LANGUAGE}"`, () => {
            mockNavigator.languages = undefined;
            mockNavigator.language = 'es'; // Spanish
            expect(i18n.inferUserLanguage()).toBe(FALLBACK_LANGUAGE);

            mockNavigator.language = 'fr'; // French
            expect(i18n.inferUserLanguage()).toBe(FALLBACK_LANGUAGE);

            mockNavigator.language = 'eo'; // Esperanto
            expect(i18n.inferUserLanguage()).toBe(FALLBACK_LANGUAGE);

            mockNavigator.language = 'tlh'; // Klingon
            expect(i18n.inferUserLanguage()).toBe(FALLBACK_LANGUAGE);
        });

    });

});

class MockTranslateService {
    instant = jasmine.createSpy('instant').and.callFake((key: string) => {
        return `${key}_translated`;
    });
    setDefaultLang = jasmine.createSpy('setDefaultLang');
}
