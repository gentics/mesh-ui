import { ConfigService } from './config.service';
import { MeshUiAppConfig, MeshPreviewUrlResolver } from '../../../src/app/common/models/appconfig.model';


export class MockConfigService implements ConfigService {

    readonly appConfig: MeshUiAppConfig;
    readonly ANONYMOUS_USER_NAME = 'anonymous';
    readonly UI_LANGUAGES = ['en', 'de'];
    FALLBACK_LANGUAGE: any = 'en';
    CONTENT_LANGUAGES = ['en', 'de'];
    readonly PREVIEW_URLS = [
        {
            label: 'previewUrlLabelTest',
            urlResolver: ((nodeUuid, path) => 'http://test.tld/segment/' + nodeUuid) as MeshPreviewUrlResolver
        }
    ];
    getConfigValueFromProperty() {
        return '';
    }
}
