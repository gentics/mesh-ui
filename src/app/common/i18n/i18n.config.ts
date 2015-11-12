module meshAdminUi {

    /**
     * Configures the languages available to the app and also the translation objects
     * to be used with those languages.
     *
     * For details on the $translateProvider see http://angular-translate.github.io/
     */
    function i18nConfig(i18nServiceProvider, $translateProvider, translationTable) {

        i18nServiceProvider.setAvailableLanguages([
            'en',
            'de'
        ]);

        i18nServiceProvider.setDefaultLanguage('en');
        $translateProvider
            .translations('en', translationTable.getLanguage('en'))
            .translations('de', translationTable.getLanguage('de'))
            .preferredLanguage('en')
            .fallbackLanguage('en');
    }

    angular.module('meshAdminUi.common.i18n', [
                'pascalprecht.translate'
            ])
            .config(i18nConfig);
}