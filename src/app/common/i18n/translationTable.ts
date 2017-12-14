module meshAdminUi {

    const userAuth = {
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
        }
    };

    const projectsArea = {
        'WHOLE_PROJECT': {
            en: 'whole project',
            de: 'ganzes Projekt'
        },
        'PROJECTS': {
            en: 'Projects',
            de: 'Projekte'
        },
        'ALL_PROJECTS': {
            en: 'All Projects',
            de: 'Alle Projekte'
        },
        'CREATE_NODE': {
            en: 'Create node',
            de: 'Node erstellen'
        },
        'UPLOAD_FILES': {
            en: 'Upload files',
            de: 'Dateien hochladen'
        },
        'CHOOSE_FILES': {
            en: 'Select or drop files...',
            de: 'Dateien auswählen oder hier ablegen...'
        },
        'CHOOSE_SCHEMA_FIRST': {
            en: 'Choose a schema first',
            de: 'Wählen Sie zuerst ein Schema'
        },
        'UPLOAD_COMPLETE': {
            en: 'Upload complete',
            de: 'Upload abgeschlossen'
        },
        'PUBLISH_NODES': {
            en: 'Publish nodes',
            de: 'Nodes veröffentlichen'
        },
        'PUBLISH_NODES_TOOLTIP': {
            en: 'Automatically publish all nodes after uploading',
            de: 'Automatisch alle Nodes nach dem Hochladen veröffentlichen'
        },
        'MULTI_UPLOAD_INVALID_SCHEMA': {
            en: 'This schema has other fields that are required when creating a node. Please choose another field, create the node manually or make the field optional.',
            de: 'Dieses Schema hat andere notwendige Felder. Bitte wählen Sie ein anderes Feld, erstellen Sie den Node manuell oder ändern Sie das Schema, sodass die Felder optional sind.'
        },
        'NO_BINARY_SCHEMAS': {
            en: 'This project has no schema with a binary field',
            de: 'Dieses Projekt hat keine Schemas mit einem Binary-Feld'
        },
        'CLOSE_ALL_TABS': {
            en: 'Close all tabs',
            de: 'Alle Tabs schließen'
        },
        'MOVED_NODES': {
            en: 'Moved {{ count }} nodes',
            de: '{{ count }} Nodes verschoben'
        },
        'COPIED_NODE': {
            en: 'Copied node',
            de: 'Node kopiert'
        },
        'DELETED_NODES': {
            en: 'Deleted {{ count }} nodes',
            de: '{{ count }} Nodes gelöscht'
        },
        'AVAILABLE_IN': {
            en: 'Available in {{ lang }}',
            de: 'In {{ lang }} verfügbar'
        },
        'TRANSLATE_TO': {
            en: 'Translate to {{ lang }}',
            de: 'In {{ lang }} übersetzen'
        },
        'SWITCH_LANGUAGE_AND_OPEN_TITLE': {
            en: 'Switch Language to {{ lang }}?',
            de: 'Auf {{ lang }} ändern?'
        },
        'SWITCH_LANGUAGE_AND_OPEN_MESSAGE': {
            en: 'In order to open this node in {{ lang }}, the user interface language will be set to {{ lang }}',
            de: 'Um diesen Node zu öffnen, muss die Benutzeroberfläche zu {{ lang }} geändert werden'
        },
        'SELECT_DESTINATION': {
            en: 'Select destination',
            de: 'Zielort auswählen'
        }
    };

    const editorPane = {
        'EDIT_LOCALIZED_VERSION': {
            en: 'Edit localized version:',
            de: 'Lokalisierte Version bearbeiten:'
        },
        'CREATE_NEW_TAG': {
            en: 'Create new tag',
            de: 'Neuen Tag erstellen'
        },
        'NEW_TAG_CREATED': {
            en: 'Created new tag',
            de: 'Neuer Tag wurde erstellt'
        },
        'SELECT_A_TAG': {
            en: 'Select a tag',
            de: 'Tag auswählen'
        },
        'ADDED_TAG': {
            en: 'Added tag "{{ name }}"',
            de: 'Tag "{{ name }}" hinzugefügt'
        },
        'REMOVED_TAG': {
            en: 'Removed tag "{{ name }}"',
            de: 'Tag "{{ name }}" entfernt'
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
        'DRAFT': {
            en: 'Draft',
            de: 'Entwurf'
        },
        'SAVE_DRAFT': {
            en: 'Save Draft',
            de: 'Entwurf Speichern'
        },
        'PUBLISH': {
            en: 'Publish',
            de: 'Veröffentlichen'
        },
        'SAVE_AND_PUBLISH': {
            en: 'Save & publish',
            de: 'Aktualisieren & Veröffentlichen'
        },
        'NODE_MUST_BE_SAVED_BEFORE_TRANSLATING': {
            en: 'Node must be saved before translating',
            de: 'Node muss vor der Übersetzung gespeichert werden'
        },
        'NO_NODE_SELECTED': {
            en: 'No node selected',
            de: 'Keinen Node ausgewählt'
        },
        'SELECT_NODE': {
            en: 'Select node',
            de: 'Node auswählen'
        },
        'REMOVE_NODE': {
            en: 'Remove node',
            de: 'Node löschen'
        },
        'LIVE_URL': {
            en: 'Live URL',
            de: 'Live-URL'
        }
    };

    const adminArea = {
        'FILTER_TAGS': {
            en: 'Filter tags',
            de: 'Tags filtern'
        },
        'CREATE_NEW_TAG_FAMILY': {
            en: 'Create new tag family',
            de: 'Neue Tag-Familie erstellen'
        },
        'EDIT_TAG_FAMILY': {
            en: 'Edit tag family',
            de: 'Tag-Familie bearbeiten'
        },
        'DELETE_TAG_FAMILY': {
            en: 'Delete tag family',
            de: 'Tag-Familie löschen'
        },
        'DELETE_TAG_FAMILY_AND_ALL_TAGS': {
            en: 'Delete this tag family and all tags?',
            de: 'Diese Tag-Familie und all ihre Tags löschen?'
        },
        'TAG_FAMILY_CREATED': {
            en: 'Tag family created',
            de: 'Tag-Familie erstellt'
        },
        'TAG_FAMILY_UPDATED': {
            en: 'Tag family updated',
            de: 'Tag-Familie aktualisiert'
        },
        'TAG_FAMILY_DELETED': {
            en: 'Tag family deleted',
            de: 'Tag-Familie gelöscht'
        },
        'ADD_TAG': {
            en: 'Add tag',
            de: 'Tag hinzufügen'
        },
        'EDIT_TAG': {
            en: 'Edit tag',
            de: 'Tag bearbeiten'
        },
        'UPDATED_TAG': {
            en: 'Updated tag',
            de: 'Tag aktualisieren'
        },
        'DELETED_TAG': {
            en: 'Deleted tag',
            de: 'Tag wurde gelöscht'
        },
        'CREATE_NEW_USER': {
            en: 'Create new user',
            de: 'Neuen Benutzer erstellen'
        },
        'NEW_USER_CREATED': {
            en: 'New user created',
            de: 'Neuer Benutzer erstellt'
        },
        'FILTER_USERS': {
            en: 'Filter users',
            de: 'Benutzer durchsuchen'
        },
        'USERNAME': {
            en: 'Username',
            de: 'Benutzername'
        },
        'PASSWORD': {
            en: 'Password',
            de: 'Kennwort'
        },
        'FIRST_NAME': {
            en: 'First name',
            de: 'Vorname'
        },
        'LAST_NAME': {
            en: 'Last name',
            de: 'Nachname'
        },
        'EMAIL_ADDRESS': {
            en: 'Email address',
            de: 'E-Mail-Adresse'
        },
        'USER_ALREADY_IN_GROUP': {
            en: 'User already in group "{{ name }}"',
            de: 'Der Benutzer befindet sich bereits in der Gruppe "{{ name }}"'
        },
        'USER_ADDED_TO_GROUP': {
            en: 'User {{ userName }} added to group "{{ groupName }}"',
            de: 'Der Benutzer {{ userName }} wurde zur Gruppe "{{ groupName }}" hinzugefügt'
        },
        'USER_REMOVED_FROM_GROUP': {
            en: 'User {{ userName }} removed from group "{{ groupName }}"',
            de: 'Der Benutzer {{ userName }} wurde von der Gruppe "{{ groupName }}" entfernt'
        },
        'FILTER_GROUPS': {
            en: 'Filter groups',
            de: 'Gruppen durchsuchen'
        },
        'CREATE_NEW_GROUP': {
            en: 'Create new group',
            de: 'Neue Gruppe erstellen'
        },
        'NEW_GROUP_CREATED': {
            en: 'New group created',
            de: 'Neue Gruppe erstellt'
        },
        'GROUP_NAME': {
            en: 'Group name',
            de: 'Gruppenname'
        },
        'GROUP_ALREADY_ASSIGNED_TO_ROLE': {
            en: 'Group already assigned to role {{ name }}"',
            de: 'Die Gruppe wurde bereits zur Rolle {{ name }}" hinzugefügt'
        },
        'GROUP_ADDED_TO_ROLE': {
            en: 'Group {{ groupName }} added to role "{{ roleName }}"',
            de: 'Die Gruppe {{ groupName }} wurde zur Rolle "{{ roleName }}" hinzugefügt'
        },
        'GROUP_REMOVED_FROM_ROLE': {
            en: 'Group {{ groupName }} removed from role "{{ roleName }}"',
            de: 'Die Gruppe {{ groupName }} wurde von der Rolle "{{ roleName }}" entfernt'
        },
        'FILTER_ROLES': {
            en: 'Filter roles',
            de: 'Rollen durchsuchen'
        },
        'CREATE_NEW_ROLE': {
            en: 'Create new role',
            de: 'Neue Rolle erstellen'
        },
        'NEW_ROLE_CREATED': {
            en: 'New role created',
            de: 'Neue Rolle erstellt'
        },
        'ROLE_NAME': {
            en: 'Role name',
            de: 'Rollenname'
        },
        'NODE_PERMISSIONS': {
            en: 'Node permissions',
            de: 'Node-Berechtigungen'
        },
        'PERMISSIONS_SET_ON_NODE': {
            en: 'Permissions set on node "{{ name }}"',
            de: 'Berechtigungen wurden "{{ name }}" zugewiesen'
        },
        'PERMISSIONS_SET_ON_TYPE': {
            en: 'Permissions set on {{ type }} "{{ name }}"',
            de: 'Berechtigungen wurden für {{ type }} "{{ name }}" zugewiesen'
        },
        'TAG_PERMISSIONS': {
            en: 'Tag permissions',
            de: 'Tag-Berechtigungen'
        },
        'FILTER_PROJECTS': {
            en: 'Filter projects',
            de: 'Projekte durchsuchen'
        },
        'CREATE_NEW_PROJECT': {
            en: 'Create new project',
            de: 'Neues Projekt erstellen'
        },
        'SCHEMA_ADDED_TO_PROJECT': {
            en: 'Schema "{{ name }}" was added to this project',
            de: 'Schema "{{ name }}" wurde zu diesem Projekt hinzugefügt'
        },
        'SCHEMA_REMOVED_FROM_PROJECT': {
            en: 'Schema "{{ name }}" was removed from this project',
            de: 'Das Schema "{{ name }}" wurde von diesem Projekt entfernt'
        },
        'MICROSCHEMA_ADDED_TO_PROJECT': {
            en: 'Microschema "{{ name }}" was added to this project',
            de: 'Microschema "{{ name }}" wurde zu diesem Projekt hinzugefügt'
        },
        'MICROSCHEMA_REMOVED_FROM_PROJECT': {
            en: 'Microschema "{{ name }}" was removed from this project',
            de: 'Das Microschema "{{ name }}" wurde von diesem Projekt entfernt'
        },
        'PROJECT_NAME': {
            en: 'Project name',
            de: 'Projektname'
        },
        'CREATE_NEW_SCHEMA': {
            en: 'Create new schema',
            de: 'Neues Schema erstellen'
        },
        'NEW_PROJECT_CREATED': {
            en: 'New project created',
            de: 'Neues Projekt erstellt'
        },
        'NEW_SCHEMA_CREATED': {
            en: 'New schema created',
            de: 'Neues Schema erstellt'
        },
        'FILTER_SCHEMAS': {
            en: 'Filter schemas',
            de: 'Schemas durchsuchen'
        },
        'FILTER_MICROSCHEMAS': {
            en: 'Filter microschemas',
            de: 'Microschemas durchsuchen'
        },
        'CREATE_NEW_MICROSCHEMA': {
            en: 'Create new microschema',
            de: 'Neues Microschema erstellen'
        },
        'NEW_MICROSCHEMA_CREATED': {
            en: 'New microschema created',
            de: 'Neues Microschema erstellt'
        },
        'IMPORTED_SCHEMAS': {
            en: 'Imported {{ count }} schemas',
            de: '{{ count }} Schemas importiert'
        },
        'ADD_NEW_FIELD': {
            en: 'Add new field',
            de: 'Neues Feld hinzufügen'
        },
        'EDIT_MIGRATION_SCRIPT': {
            en: 'Edit migration script',
            de: 'Migrationsskript bearbeiten',
        },
        'ADD_SCHEMA_FIELD_NAMED': {
            en: 'Add a field named "{{ fieldName }}"',
            de: 'Neues Feld "{{ fieldName }}" hinzufügen',
        },
        'REMOVE_SCHEMA_FIELD': {
            en: 'Remove field "{{ fieldName }}"',
            de: 'Das Feld "{{ fieldName }}" löschen',
        },
        'UPDATE_SCHEMA_FIELD': {
            en: 'Update field "{{ fieldName }}", setting keys [{{ keys }}] to values [{{ values }}]',
            de: 'Das Feld "{{ fieldName }}" aktualisieren, keys [{{ keys }}], values [{{ values }}]',
        },
        'CHANGE_SCHEMA_FIELD_TYPE': {
            en: 'Change field "{{ fieldName }}" to type "{{ type }}"',
            de: 'Change field "{{ fieldName }}" to type "{{ type }}"'
        },
        'UPDATE_SCHEMA_PROPERTY': {
            en: 'Update schema property "{{ key }}" to "{{ value }}"',
            de: 'Change field "{{ fieldName }}" to type "{{ type }}"'
        },
        'SCHEMA_OPERATION_NOT_RECOGNIZED': {
            en: 'Operation "{{ name }}" not recognized',
            de: 'Operation "{{ name }}" nicht erkannt',
        }
    };

    const common = {
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
        'FIELD': {
            en: 'Field',
            de: 'Feld'
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
            de: 'Einträge pro Seite'
        },
        'SAVE_CHANGES': {
            en: 'Save Changes',
            de: 'Speichern'
        },
        'DISCARD_CHANGES': {
            en: 'Discard Changes',
            de: 'Verwerfen'
        },
        'EDIT': {
            en: 'Edit',
            de: 'Bearbeiten'
        },
        'COPY': {
            en: 'Copy',
            de: 'Kopieren'
        },
        'MOVE': {
            en: 'Move',
            de: 'Verschieben'
        },
        'UNPUBLISH': {
            en: 'Unpublish',
            de: 'Offline nehmen'
        },
        'OKAY': {
            en: 'Okay',
            de: 'Okay'
        },
        'CANCEL': {
            en: 'Cancel',
            de: 'Abbrechen'
        },
        'DELETE': {
            en: 'Delete',
            de: 'Löschen'
        },
        'DELETED': {
            en: 'Deleted',
            de: 'Gelöscht'
        },
        'CREATE': {
            en: 'Create',
            de: 'Erstellen'
        },
        'PREVIEW': {
            en: 'Preview',
            de: 'Vorschau'
        },
        'ADD': {
            en: 'Add',
            de: 'Hinzufügen'
        },
        'IMPORT': {
            en: 'Import',
            de: 'Importieren'
        },
        'EXPORT': {
            en: 'Export',
            de: 'Exportieren'
        },
        'FILE_NAME': {
            en: 'File name',
            de: 'Dateiname'
        },
    };

    const dialogs = {
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
            de: 'Neuen Inhalt erstellt'
        },
        'EDIT_IMAGE': {
            en: 'Edit Image',
            de: 'Bild Bearbeiten'
        },
        'USE_SELECTED_NODE': {
            en: 'Use selected node',
            de: 'Benutze ausgewählten Node'
        },
        'CONFIRM_UNPUBLISH_TITLE': {
            en: 'Unpublish?',
            de: 'Offline nehmen?'
        },
        'CONFIRM_UNPUBLISH_NODE_MESSAGE': {
            en: 'This node exists in the following languages. Check the ones you wish to unpublish:',
            de: 'Dieser Node existiert in folgenden Sprachen. Wählen Sie die zu offline nehmenden Versionen:'
        },
        'CONFIRM_UNPUBLISH_NODE_MULTI_MESSAGE': {
            en: 'The selected nodes may exist in more than one language.',
            de: 'Die ausgewählten Nodes könnten in mehreren Sprachen existieren.'
        },
        'CONFIRM_UNPUBLISH_NODE_MULTI_CURRENT_MESSAGE': {
            en: 'Unpublish current language version only.',
            de: 'Nur derzeitige Sprachversion offline nehmen.'
        },
        'CONFIRM_UNPUBLISH_NODE_MULTI_ALL_MESSAGE': {
            en: 'Unpublish all language versions.',
            de: 'Alle Sprachversionen offline nehmen.'
        },
        'CONFIRM_DELETE_TITLE': {
            en: 'Delete?',
            de: 'Löschen?'
        },
        'CONFIRM_DELETE_NODE_MESSAGE': {
            en: 'This node exists in the following languages. Check the ones you wish to delete:',
            de: 'Dieser Node existiert in folgenden Sprachen. Wählen Sie die zu löschenden Versionen:'
        },
        'CONFIRM_DELETE_NODE_MULTI_MESSAGE': {
            en: 'The selected nodes may exist in more than one language.',
            de: 'Die ausgewählten Nodes könnten in mehreren Sprachen existieren.'
        },
        'CONFIRM_DELETE_NODE_MULTI_CURRENT_MESSAGE': {
            en: 'Delete current language version only.',
            de: 'Nur derzeitige Sprachversion löschen.'
        },
        'CONFIRM_DELETE_NODE_MULTI_ALL_MESSAGE': {
            en: 'Delete all language versions.',
            de: 'Alle Sprachversionen löschen.'
        },
        'CONFIRM_DELETE_MESSAGE': {
            en: 'Are you sure you want to delete this object?',
            de: 'Sind Sie sicher, dass Sie dieses Objekt löschen wollen?'
        },
        'CONFIRM_DELETE_GROUP_TITLE': {
            en: 'Delete Group?',
            de: 'Gruppe löschen?'
        },
        'CONFIRM_DELETE_GROUP_MESSAGE': {
            en: 'Are you sure you want to delete this group?',
            de: 'Sind Sie sicher, dass Sie diese Gruppe löschen wollen?'
        },
        'CONFIRM_DELETE_MICROSCHEMA_TITLE': {
            en: 'Delete Microschema?',
            de: 'Microschema löschen?'
        },
        'CONFIRM_DELETE_MICROSCHEMA_MESSAGE': {
            en: 'Are you sure you want to delete this microschema?',
            de: 'Sind Sie sicher, dass Sie dieses Microschema löschen wollen?'
        },
        'CONFIRM_DELETE_PROJECT_TITLE': {
            en: 'Delete Project?',
            de: 'Projekt löschen?'
        },
        'CONFIRM_DELETE_PROJECT_MESSAGE': {
            en: 'Are you sure you want to delete this project?',
            de: 'Sind Sie sicher, dass Sie dieses Projekt löschen wollen?'
        },
        'CONFIRM_DELETE_ROLE_TITLE': {
            en: 'Delete Role?',
            de: 'Rolle löschen?'
        },
        'CONFIRM_DELETE_ROLE_MESSAGE': {
            en: 'Are you sure you want to delete this role?',
            de: 'Sind Sie sicher, dass Sie diese Rolle löschen wollen?'
        },
        'CONFIRM_DELETE_SCHEMA_TITLE': {
            en: 'Delete Schema?',
            de: 'Schema löschen?'
        },
        'CONFIRM_DELETE_SCHEMA_MESSAGE': {
            en: 'Are you sure you want to delete this schema?',
            de: 'Sind Sie sicher, dass Sie dieses Schema löschen wollen?'
        }
    };

    const errors = {
        'ERROR': {
            en: 'Error',
            de: 'Fehler'
        },
        'ERR_CHECK_LOGIN_DETAILS': {
            en: 'Please check your login details and try again.',
            de: 'Überprüfen Sie bitte Ihre Daten und versuchen Sie es erneut.'
        },
        'ERR_SESSION_EXPIRED': {
            en: 'Session has expired. Please log in again.',
            de: 'Die Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
        },
        'JSON_IS_INVALID': {
            en: 'JSON is invalid',
            de: 'JSON ist ungültig'
        },
        'ERR_SCHEMA_NAME_INVALID': {
            en: 'Schema name may contain only letters, numbers and underscores, and may not start with a number.',
            de: 'Der Schema Name darf nur Burchstaben, Nummern und Unterstriche enthalten und darf nicht mit einer Nummer beginnen.'
        },
        'ERR_SCHEMA_NAME_EMPTY': {
            en: 'Please specify a schema name',
            de: 'Bitte geben Sie einen Schema Name an'
        },
        'ERR_SCHEMA_PLEASE_SPECIFY_DISPLAY_FIELD': {
            en: 'Please specify a displayField',
            de: 'Bitte geben Sie ein Display-Field an'
        },
        'ERR_SCHEMA_PLEASE_SPECIFY_SEGMENT_FIELD': {
            en: 'Please specify a segmentField',
            de: 'Bitte geben Sie ein Segment-Field an'
        },
        'ERR_SCHEMA_MUST_HAVE_AT_LEAST_ONE_FIELD': {
            en: 'Schema must have at least one field defined',
            de: 'Das Schema muss mindestens ein Feld besitzen'
        },
        'ERR_SCHEMA_DISPLAY_FIELD_DOES_NOT_MATCH': {
            en: 'displayField value "{{ value }}" does not match any fields',
            de: 'Der Display-Field-Wert "{{ value }}" entspricht keinem Feld'
        },
        'ERR_SCHEMA_SEGMENT_FIELD_DOES_NOT_MATCH': {
            en: 'segmentField value "{{ value }}" does not match any fields',
            de: 'Der Segment-Field-Wert "{{ value }}" entspricht keinem Feld'
        },
        'ERR_SCHEMA_REQUIRE_NAME_AND_TYPE': {
            en: 'All fields must have a "name" and "type" property',
            de: 'Alle Felder müssen mindestens ein "name"- und "type"-Attribut besitzen.'
        },
        'ERR_SCHEMA_INVALID_TYPES': {
            en: 'The following fields have invalid types: {{ names }}',
            de: 'Die folgenden Felder haben einen ungültigen Typ: {{ names }}'
        },
        'ERR_SCHEMA_DUPLICATE_FIELD_NAMES': {
            en: 'Fields must have unique names - duplicate field detected: {{ names }}',
            de: 'Felder müssen einen eindeutigen Namen besitzen. Doppelt vergebene Felder wurden erkannt: {{ names }}'
        },
        'ERR_SCHEMA_INVALID_LIST_TYPE': {
            en: 'The following list fields have an invalid listType: {{ names }}',
            de: 'Die folgenden List Felder haben einen ungültigen List-Typ: {{ names }}'
        },
        'ERR_SCHEMA_ALLOW_PROPERTY_MISSING': {
            en: 'The following micronode fields must have an "allow" property defined: {{ names }}',
            de: 'Die folgenden Micronode-Felder müssen ein "allow" Attribut angeben: {{ names }}'
        }
    };

    const translations = angular.merge({}, userAuth, projectsArea, editorPane, adminArea, common, dialogs, errors);

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