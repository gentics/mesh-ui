module meshAdminUi {

    const translations = {
        /* User auth */
        'LOG_IN': {
            en: 'Log In',
            de: 'Einloggen'
        },
        'LOG_OUT': {
            en: 'Log Out',
            de: 'Ausloggen'
        },
        'USER_NAME': {
            en: 'User Name',
            de: 'Benutzername'
        },
        'PASSWORD': {
            en: 'Password',
            de: 'Kennwort'
        },
        'PROFILE': {
            en: 'Profile',
            de: 'Profil'
        },

        /* Projects */
        'WHOLE_PROJECT': {
            en: 'whole project',
            de: 'ganze Projekt'
        },
        'PROJECTS': {
            en: 'Projects',
            de: 'Projekte'
        },
        'ALL_PROJECTS': {
            en: 'All Projects',
            de: 'Alle Projekte'
        },

        /* Tags */
        'CREATE_NEW_TAG': {
            en: 'Create new tag',
            de: 'Neuen Tag erstellen'
        },

        /* Explorer View */
        'CREATE_NODE': {
            en: 'Create node',
            de: 'Node erstellen'
        },
        'CLOSE_ALL_TABS': {
            en: 'Close all tabs',
            de: 'Alle Tabs schließen'
        },


        /* Content Editor */
        'EDIT_LOCALIZED_VERSION': {
            en: 'Edit localized version:',
            de: 'Lokalisierte Version bearbeiten:'
        },
        'TIMEPICKER_HOURS': {
            en: 'Hours',
            de: 'Stunden'
        },
        'TIMEPICKER_MINUTES': {
            en: 'Minutes',
            de: 'Minuten'
        },
        'TIMEPICKER_SECONDS': {
            en: 'Seconds',
            de: 'Sekunden'
        },
        'ADD_ITEM_TO': {
            en: 'Add item to',
            de: 'Hinzufügen zu'
        },
        'PUBLISHED': {
            en: 'Published',
            de: 'Veröffentlicht'
        },

        /* Admin Area */
        'NEW_USER_CREATED': {
            en: 'New user created',
            de: 'Neuer Benutzer erstellt'
        },
        'NEW_GROUP_CREATED': {
            en: 'New group created',
            de: 'Neue Gruppe erstellt'
        },
        'NEW_ROLE_CREATED': {
            en: 'New role created',
            de: 'Neue Rolle erstellt'
        },
        'ADD_NEW_FIELD': {
            en: 'Add new field',
            de: 'Neues Feld hinzufügen'
        },

        /* Other */
        'SEARCH_IN': {
            en: 'Search in',
            de: 'Suche in'
        },
        'UPDATE': {
            en: 'Update',
            de: 'Aktualisieren'
        },
        'TITLE': {
            en: 'Title',
            de: 'Titel'
        },
        'SCHEMA': {
            en: 'Schema',
            de: 'Schema'
        },
        'AUTHOR': {
            en: 'Author',
            de: 'Autor'
        },
        'CREATED': {
            en: 'Created',
            de: 'Erstellt'
        },
        'ITEMS_PER_PAGE': {
            en: 'Items per page',
            de: 'Artikel pro Seite'
        },

        /* Dialogs */
        'CONTENT_MODIFIED': {
            en: 'Content Modified',
            de: 'Inhalt geändert'
        },
        'CONTENT_MODIFIED_HOW_TO_PROCEED': {
            en: 'This content has been modified. How would you like to proceed?',
            de: 'Dieser Inhalt wurde geändert. Wie möchten Sie vorgehen?'
        },
        'SAVED_CHANGES': {
            en: 'Saved changes',
            de: 'Gespeichert'
        },
        'NEW_CONTENT_CREATED': {
            en: 'New content created',
            de: 'Neue Inhalt erstellt'
        },
        'EDIT_IMAGE': {
            en: 'Edit Image',
            de: 'Bild Bearbeiten'
        },

        /* Common buttons */
        'SAVE_CHANGES': {
            en: 'Save Changes',
            de: 'Speichern'
        },
        'DISCARD_CHANGES': {
            en: 'Discard Changes',
            de: 'Wegwerfen'
        },
        'EDIT': {
            en: 'Edit',
            de: 'Bearbeiten'
        },
        'MOVE': {
            en: 'Move',
            de: 'Verschieben'
        },
        'CANCEL': {
            en: 'Cancel',
            de: 'Abbrechen'
        },
        'DELETE': {
            en: 'Delete',
            de: 'Löschen'
        },
        'CREATE': {
            en: 'Create',
            de: 'Speichern'
        },
        'PREVIEW': {
            en: 'Preview',
            de: 'Vorschau'
        },
        'ADD': {
            en: 'Add',
            de: 'Hinzufügen'
        },

        /* Error messages */
        'ERROR': {
            en: 'Error',
            de: 'Fehler'
        },
        'ERR_CHECK_LOGIN_DETAILS': {
            en: 'Please check your login details and try again.',
            de: 'Überprüfen Sie bitte Ihre Daten ein und versuchen Sie es erneut.'
        }
    };

    export const TranslationTable = {

        getLanguage(code: string): any {
            let table = {};
            for (let key in translations) {
                if (translations[key][code]) {
                    table[key] = translations[key][code];
                } else {
                    // specified language not found for this key,
                    // so fall back to the first one.
                    let options = Object.keys(translations[key]);
                    table[key] = translations[key][options[0]];
                }
            }
            return table;
        }
    };

    angular.module('meshAdminUi.common.i18n')
        .constant('translationTable', TranslationTable);
}