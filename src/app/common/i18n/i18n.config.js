angular.module('caiLunAdminUi.common.i18n',[
    'pascalprecht.translate'
])
    .config(i18nConfig);


function i18nConfig($translateProvider, en, de) {
    $translateProvider
        .translations('en', en)
        .translations('de', de)
        .preferredLanguage('de')
        .fallbackLanguage('en');
}