import { MeshPreviewUrlResolver, MeshUiAppConfig } from '../../../common/models/appconfig.model';

import { ConfigService } from './config.service';

export class MockConfigService implements ConfigService {
    readonly appConfig: MeshUiAppConfig;
    readonly ANONYMOUS_USER_NAME = 'anonymous';
    readonly UI_LANGUAGES = ['en', 'de'];
    FALLBACK_LANGUAGE = 'en';
    DEFAULT_CONTENT_LANGUAGE = 'en';
    CONTENT_LANGUAGES = ['en', 'de'];
    readonly CONTENT_ITEMS_PER_PAGE = 8;
    getPreviewUrlsByProjectName(projectName: string) {
        return [
            {
                label: 'previewUrlLabelTest-01',
                urlResolver: (node => {
                    return 'http://test-01.tld/segment/' + node.uuid + '?preview=true';
                }) as MeshPreviewUrlResolver
            },
            {
                label: 'previewUrlLabelTest-02',
                urlResolver: (node => {
                    return 'http://test-02.tld/segment/' + node.uuid + '?preview=true';
                }) as MeshPreviewUrlResolver
            }
        ];
    }
    getConfigValueFromProperty() {
        return '' as any;
    }
}
