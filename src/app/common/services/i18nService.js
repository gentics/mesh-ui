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

    /**
     * Set the 2-character (ISO-639-1) language code, which must be part of the
     * availableLanguages array.
     * @param {string} value
     */
    function setLanguage(value) {
        if (-1 < availableLanguages.indexOf(value)) {
            language = value;
        }
    }

    /**
     * Get the 2-character language code of the current language.
     * @returns {string}
     */
    function getLanguage() {
        return language;
    }
}