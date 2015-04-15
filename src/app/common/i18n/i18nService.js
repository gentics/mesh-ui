angular.module('caiLunAdminUi.common.i18n')
    .provider('i18nService', i18nServiceProvider);

/**
 * This provider allows language settings to be set up at config time for the app.
 */
function i18nServiceProvider() {

    var defaultLang = 'en',
        availableLangs = [
            'en',
            'de'
        ];

    this.$get = function($translate){
        return new I18nService($translate, availableLangs, defaultLang);
    };

    /**
     * Set the app's default language at config time.
     * @param value
     */
    this.setDefaultLanguage = function(value) {
        if (-1 < availableLangs.indexOf(value)) {
            defaultLang = value;
        } else {
            throw new Error('i18nServiceProvider#setDefaultLanguage: ' + value + ' is not an available language.');
        }
    };

    /**
     * Specify available languages in the form of an array of the 2-character ISO-639-1 codes,
     * e.g. ['en', 'de', 'fr']
     * @param {Array} value
     */
    this.setAvailableLanguages = function(value) {
        if (Array.isArray(value)) {
            availableLangs = value;
        } else {
            throw new Error('i18nServiceProvider#setAvailableLanguages: argument must be an array');
        }
    };
}


/**
 * Service for setting and retrieving app-wide language settings.
 * @constructor
 * @param {Array} availableLangs
 * @param {String} defaultLang
 */
function I18nService($translate, availableLangs, defaultLang) {

    var language = defaultLang;

    // public API
    Object.defineProperties(this, {
        "languages": { get: function () { return availableLangs; } }
    });
    this.setLanguage = setLanguage;
    this.getLanguage = getLanguage;

    /**
     * Set the 2-character (ISO-639-1) language code, which must be part of the
     * availableLanguages array.
     * @param {string} value
     */
    function setLanguage(value) {
        if (-1 < availableLangs.indexOf(value)) {
            language = value;
            $translate.use(value);
        } else {
            throw new Error('I18nService#setLanguage: ' + value + ' is not an available language.');
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