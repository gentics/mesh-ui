module meshAdminUi {

    declare var meshUiConfig:any;

    /**
     * Configures the languages available to the app and also the translation objects
     * to be used with those languages.
     *
     * For details on the $translateProvider see http://angular-translate.github.io/
     */
    function i18nConfig(i18nServiceProvider, $translateProvider, translationTable) {

        const availableLanguages = meshUiConfig.availableLanguages.map(s => s.toLowerCase());
        const defaultLanguage = meshUiConfig.defaultLanguage.toLowerCase();

        i18nServiceProvider.setAvailableLanguages(meshUiConfig.availableLanguages);
        i18nServiceProvider.setDefaultLanguage(defaultLanguage);

        $translateProvider
            .useSanitizeValueStrategy('escapeParameters')
            .preferredLanguage(defaultLanguage)
            .fallbackLanguage(defaultLanguage);

        angular.forEach(availableLanguages, (langCode: string) => {
            $translateProvider.translations(langCode, translationTable.getLanguage(langCode));
        });
    }

    angular.module('meshAdminUi.common.i18n', [
                'pascalprecht.translate'
            ])
            .config(i18nConfig);
}