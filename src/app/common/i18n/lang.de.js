var germanTranslations = {
    'LOG_IN': 'Einloggen',
    'LOG_OUT': 'Ausloggen',
    'USER_NAME': 'Benutzername',
    'PASSWORD': 'Kennwort',
    'PROFILE': 'Profil',

    'PROJECTS': 'Projekte',
    'ALL_PROJECTS': 'Alle Projekte',

    /* Tags */
    'CREATE_NEW_TAG': 'Neuen Tag erstellen',

    /* Other */
    'SEARCH': 'Suche',
    'UPDATE': 'Aktualisieren',
    'TITLE': 'Titel',
    'SCHEMA': 'Schema',
    'AUTHOR': 'Autor',
    'CREATED': 'Erstellt',
    'ITEMS_PER_PAGE': 'Artikel pro Seite',

    /* Dialogs */
    'CONTENT_MODIFIED': 'Inhalt geändert',
    'CONTENT_MODIFIED_HOW_TO_PROCEED': 'Dieser Inhalt wurde geändert. Wie möchten Sie vorgehen?',

    /* Common buttons */
    'SAVE_CHANGES': 'Speichern',
    'DISCARD_CHANGES': 'Wegwerfen',
    'CANCEL': 'Stornieren',

    /* Error messages */
    'ERROR': 'Fehler',
    'ERR_CHECK_LOGIN_DETAILS': 'Überprüfen Sie bitte Ihre Daten ein und versuchen Sie es erneut.'
};

angular.module('caiLunAdminUi.common.i18n')
    .constant('de', germanTranslations);
