angular.module('caiLunAdminUi.common')
    .service('i18nService', I18nService);

/**
 * Service for setting and retrieving app-wide language settings.
 * @constructor
 */
function I18nService() {

    var defaultLanguage = 'en',
        language = defaultLanguage,
        availableLanguages = [
            'en',
            'de'
        ];

    // public API
    Object.defineProperties(this, {
        "languages": { get: function () { return availableLanguages; } }
    });
    this.setLanguage = setLanguage;
    this.getLanguage = getLanguage;


    function setLanguage(value) {
        if (-1 < availableLanguages.indexOf(value)) {
            language = value;
        }
    }

    function getLanguage() {
        return language;
    }
}