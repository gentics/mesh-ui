import { ConfigService } from './config.service';

export class MockConfigService implements ConfigService {
    readonly ANONYMOUS_USER_NAME = 'anonymous';
    readonly UI_LANGUAGES = ['en', 'de'];

    FALLBACK_LANGUAGE: any = 'en';
    CONTENT_LANGUAGES = ['en', 'de'];
}
