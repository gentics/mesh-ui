import { Injectable } from '@angular/core';

/**
 * Service which provides all constant config values for the app. Providing these values
 * as an injectable service allows us to leverage the Angular DI to override values e.g.
 * for testing.
 */
@Injectable()
export class ConfigService {
    /** UI localizations */
    readonly UI_LANGUAGES = ['en', 'de'];

    /** Language used when no translation is found in the current language */
    readonly FALLBACK_LANGUAGE = 'en';

    /** Username of the default anonymous (unauthenticated) user in Mesh */
    readonly ANONYMOUS_USER_NAME = 'anonymous';
}
