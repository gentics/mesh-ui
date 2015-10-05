angular.module('meshAdminUi.common.i18n',[
    'pascalprecht.translate'
])
    .config(i18nConfig);

/**
 * Configures the languages available to the app and also the translation objects
 * to be used with those languages.
 *
 * For details on the $translateProvider see http://angular-translate.github.io/
 *
 * @param i18nServiceProvider
 * @param $translateProvider
 * @param en
 * @param de
 */
function i18nConfig(i18nServiceProvider, $translateProvider, en, de) {

    i18nServiceProvider.setAvailableLanguages([
        'en',
        'de',
        'ar'
    ]);

    i18nServiceProvider.setDefaultLanguage('de');

    $translateProvider
        .translations('en', en)
        .translations('de', de)
        .preferredLanguage('en')
        .fallbackLanguage('en');
}