import { Injectable } from '@angular/core';

import { MeshPreviewUrl, MeshUiAppConfig } from '../../../common/models/appconfig.model';

interface MeshWindow {
    [key: string]: any | MeshUiAppConfig | undefined;
}

/**
 * Service which provides all constant config values for the app. Providing these values
 * as an injectable service allows us to leverage the Angular DI to override values e.g.
 * for testing.
 */
@Injectable()
export class ConfigService {
    /**
     * Returns the current UI application configuration
     * @return UI application configuration
     */
    get appConfig(): MeshUiAppConfig {
        const meshWindow = window as MeshWindow;
        const config: any = (meshWindow && meshWindow['MeshUiConfig']) || undefined;
        if (!config) {
            throw new Error('No Mesh UI configuration found!');
        }
        return config;
    }

    /** UI localizations */
    get UI_LANGUAGES(): string[] {
        return this.getConfigValueFromProperty('uiLanguages') as string[];
    }

    /**
     * Languages in which the content is available.
     * TODO: This will need to be user-configurable eventually.
     */
    get CONTENT_LANGUAGES(): string[] {
        return this.getConfigValueFromProperty('contentLanguages') as string[];
    }

    /** Language used when no translation is found in the current language */
    get FALLBACK_LANGUAGE(): string {
        return this.getConfigValueFromProperty('fallbackLanguage') as string;
    }

    /** Username of the default anonymous (unauthenticated) user in Mesh */
    get ANONYMOUS_USER_NAME(): string {
        return this.getConfigValueFromProperty('anonymousUsername') as string;
    }

    /** preview URLs defined per project */
    getPreviewUrlsByProjectUuid(projectUuid: string): MeshPreviewUrl[] {
        return (this.getConfigValueFromProperty('previewUrls') as {
            [projectUuid: string]: MeshPreviewUrl[];
        })[projectUuid] as MeshPreviewUrl[];
    }

    /**
     * Helper function to retrieve values from app config
     * @param property key of config object
     */
    getConfigValueFromProperty(property: keyof MeshUiAppConfig) {
        const retVal = this.appConfig[property];
        if (retVal) {
            return retVal;
        } else {
            throw new Error(`Property '${property}' not set in /src/assets/config/mesh-ui-config.js`);
        }
    }
}
