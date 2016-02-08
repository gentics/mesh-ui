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
        'CREATE_NODE': {
            en: 'Create node',
            de: 'Node erstellen'
        },
        'CLOSE_ALL_TABS': {
            en: 'Close all tabs',
            de: 'Alle Tabs schließen'
        },
        'MOVED_NODES': {
            en: 'Moved {{ count }} nodes',
            de: 'DE Moved {{ count }} nodes'
        },
        'DELETED_NODES': {
            en: 'Deleted {{ count }} nodes',
            de: 'DE Deleted {{ count }} nodes'
        }
    };

    const editorPane = {
        'EDIT_LOCALIZED_VERSION': {
            en: 'Edit localized version:',
            de: 'Lokalisierte Version bearbeiten:'
        },
        'CREATE_NEW_TAG': {
            en: 'Create new tag',
            de: 'DE Create new tag'
        },
        'NEW_TAG_CREATED': {
            en: 'Created new tag',
            de: 'DE Created new tag'
        },
        'SELECT_A_TAG': {
            en: 'Select a tag',
            de: 'DE Select a tag'
        },
        'ADDED_TAG': {
            en: 'Added tag "{{ name }}"',
            de: 'DE Added tag "{{ name }}"'
        },
        'REMOVED_TAG': {
            en: 'Removed tag "{{ name }}"',
            de: 'DE Removed tag "{{ name }}"'
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
        'NODE_MUST_BE_SAVED_BEFORE_TRANSLATING': {
            en: 'Node must be saved before translating',
            de: 'DE Node must be saved before translating'
        },
        'NO_NODE_SELECTED': {
            en: 'No node selected',
            de: 'DE No node selected'
        },
        'SELECT_NODE': {
            en: 'Select node',
            de: 'DE Select node'
        }
    };

    const adminArea = {
        'FILTER_TAGS': {
            en: 'Filter tags',
            de: 'DE Filter tags'
        },
        'CREATE_NEW_TAG_FAMILY': {
            en: 'Create new tag family',
            de: 'DE Create new tag family'
        },
        'EDIT_TAG_FAMILY': {
            en: 'Edit tag family',
            de: 'DE Edit tag family'
        },
        'DELETE_TAG_FAMILY': {
            en: 'Delete tag family',
            de: 'DE Delete tag family'
        },
        'DELETE_TAG_FAMILY_AND_ALL_TAGS': {
            en: 'Delete this tag family and all tags?',
            de: 'DE Delete this tag family and all tags?'
        },
        'TAG_FAMILY_CREATED': {
            en: 'Tag family created',
            de: 'DE Tag family deleted'
        },
        'TAG_FAMILY_UPDATED': {
            en: 'Tag family updated',
            de: 'DE Tag family updated'
        },
        'TAG_FAMILY_DELETED': {
            en: 'Tag family deleted',
            de: 'DE Tag family deleted'
        },
        'ADD_TAG': {
            en: 'Add tag',
            de: 'DE Add tag'
        },
        'EDIT_TAG': {
            en: 'Edit tag',
            de: 'DE Edit tag'
        },
        'UPDATED_TAG': {
            en: 'Updated tag',
            de: 'DE Updated tag'
        },
        'DELETED_TAG': {
            en: 'Deleted tag',
            de: 'DE Deleted tag'
        },
        'CREATE_NEW_USER': {
            en: 'Create new user',
            de: 'DE Create new user'
        },
        'NEW_USER_CREATED': {
            en: 'New user created',
            de: 'Neuer Benutzer erstellt'
        },
        'FILTER_USERS': {
            en: 'Filter users',
            de: 'DE Filter users'
        },
        'USERNAME': {
            en: 'Username',
            de: 'Username'
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
            de: 'Email Addresse'
        },
        'USER_ALREADY_IN_GROUP': {
            en: 'User already in group "{{ name }}"',
            de: 'DE User already in group "{{ name }}"'
        },
        'USER_ADDED_TO_GROUP': {
            en: 'User {{ userName }} added to group "{{ groupName }}"',
            de: 'DE User {{ userName }} added to group "{{ groupName }}"'
        },
        'USER_REMOVED_FROM_GROUP': {
            en: 'User {{ userName }} removed from group "{{ groupName }}"',
            de: 'DE User {{ userName }} removed from group "{{ groupName }}"'
        },
        'FILTER_GROUPS': {
            en: 'Filter groups',
            de: 'DE Filter groups'
        },
        'CREATE_NEW_GROUP': {
            en: 'Create new group',
            de: 'DE Create new group'
        },
        'NEW_GROUP_CREATED': {
            en: 'New group created',
            de: 'Neue Gruppe erstellt'
        },
        'GROUP_NAME': {
            en: 'Group name',
            de: 'DE Group name'
        },
        'GROUP_ALREADY_ASSIGNED_TO_ROLE': {
            en: 'Group already assigned to role {{ name }}"',
            de: 'DE Group already assigned to role {{ name }}"'
        },
        'GROUP_ADDED_TO_ROLE': {
            en: 'Group {{ groupName }} added to role "{{ roleName }}"',
            de: 'DE Group {{ groupName }} added to role "{{ roleName }}"'
        },
        'GROUP_REMOVED_FROM_ROLE': {
            en: 'Group {{ groupName }} removed from role "{{ roleName }}"',
            de: 'DE Group {{ groupName }} removed from role "{{ roleName }}"'
        },
        'FILTER_ROLES': {
            en: 'Filter roles',
            de: 'DE Filter roles'
        },
        'CREATE_NEW_ROLE': {
            en: 'Create new role',
            de: 'DE Create new role'
        },
        'NEW_ROLE_CREATED': {
            en: 'New role created',
            de: 'Neue Rolle erstellt'
        },
        'ROLE_NAME': {
            en: 'Role name',
            de: 'DE Role name'
        },
        'NODE_PERMISSIONS': {
            en: 'Node permissions',
            de: 'DE Node Permissions'
        },
        'PERMISSIONS_SET_ON_NODE': {
            en: 'Permissions set on node "{{ name }}"',
            de: 'DE Permissions set on node "{{ name }}"'
        },
        'PERMISSIONS_SET_ON_TYPE': {
            en: 'Permissions set on {{ type }} "{{ name }}"',
            de: 'DE Permissions set on {{ type }} "{{ name }}"'
        },
        'TAG_PERMISSIONS': {
            en: 'Tag permissions',
            de: 'DE Tag Permissions'
        },
        'FILTER_PROJECTS': {
            en: 'Filter projects',
            de: 'DE Filter projects'
        },
        'CREATE_NEW_PROJECT': {
            en: 'Create new project',
            de: 'DE Create new project'
        },
        'SCHEMA_ADDED_TO_PROJECT': {
            en: 'Schema "{{ name }}" was added to this project',
            de: 'DE Schema "{{ name }}" was added to this project'
        },
        'SCHEMA_REMOVED_FROM_PROJECT': {
            en: 'Schema "{{ name }}" was removed from this project',
            de: 'DE Schema "{{ name }}" was removed from this project'
        },
        'PROJECT_NAME': {
            en: 'Project name',
            de: 'DE Project name'
        },
        'CREATE_NEW_SCHEMA': {
            en: 'Create new schema',
            de: 'DE Create new schema'
        },
        'FILTER_SCHEMAS': {
            en: 'Filter schemas',
            de: 'DE Filter schemas'
        },
        'FILTER_MICROSCHEMAS': {
            en: 'Filter microschemas',
            de: 'DE Filter microschemas'
        },
        'CREATE_NEW_MICROSCHEMA': {
            en: 'Create new microschema',
            de: 'DE Create new microschema'
        },
        'IMPORTED_SCHEMAS': {
            en: 'Imported {{ count }} schemas',
            de: 'DE Imported {{ count }} schemas'
        },
        'ADD_NEW_FIELD': {
            en: 'Add new field',
            de: 'Neues Feld hinzufügen'
        },
        'EDIT_MIGRATION_SCRIPT': {
            en: 'Edit migration script',
            de: 'Migration Script bearbeiten',
        },
        'ADD_SCHEMA_FIELD_NAMED': {
            en: 'Add a field named "{{ fieldName }}"',
            de: 'Neues Feld "{{ fieldName }}" hinzufügen',
        },
        'REMOVE_SCHEMA_FIELD': {
            en: 'Remove field "{{ fieldName }}"',
            de: 'Das Feld "{{ fieldName }}" löschen',
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
            de: 'Operation "{{ name }}" not recognized',
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
        'IMPORT': {
            en: 'Import',
            de: 'DE Import'
        },
        'EXPORT': {
            en: 'Export',
            de: 'DE Export'
        },
        'FILE_NAME': {
            en: 'File name',
            de: 'DE File name'
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
            de: 'Neue Inhalt erstellt'
        },
        'EDIT_IMAGE': {
            en: 'Edit Image',
            de: 'Bild Bearbeiten'
        },
        'USE_SELECTED_NODE': {
            en: 'Use selected node',
            de: 'Use selected node'
        },
        'CONFIRM_DELETE_TITLE': {
            en: 'Delete?',
            de: 'DE Delete?'
        },
        'CONFIRM_DELETE_MESSAGE': {
            en: 'Are you sure you want to delete this object?',
            de: 'DE Are you sure you want to delete this object?'
        },
        'CONFIRM_DELETE_GROUP_TITLE': {
            en: 'Delete Group?',
            de: 'DE Delete Group?'
        },
        'CONFIRM_DELETE_GROUP_MESSAGE': {
            en: 'Are you sure you want to delete this group?',
            de: 'DE Are you sure you want to delete this group?'
        },
        'CONFIRM_DELETE_MICROSCHEMA_TITLE': {
            en: 'Delete Microschema?',
            de: 'DE Delete Microschema?'
        },
        'CONFIRM_DELETE_MICROSCHEMA_MESSAGE': {
            en: 'Are you sure you want to delete this microschema?',
            de: 'DE Are you sure you want to delete this microschema?'
        },
        'CONFIRM_DELETE_PROJECT_TITLE': {
            en: 'Delete Project?',
            de: 'DE Delete Project?'
        },
        'CONFIRM_DELETE_PROJECT_MESSAGE': {
            en: 'Are you sure you want to delete this project?',
            de: 'DE Are you sure you want to delete this project?'
        },
        'CONFIRM_DELETE_ROLE_TITLE': {
            en: 'Delete Role?',
            de: 'DE Delete Role?'
        },
        'CONFIRM_DELETE_ROLE_MESSAGE': {
            en: 'Are you sure you want to delete this role?',
            de: 'DE Are you sure you want to delete this role?'
        },
        'CONFIRM_DELETE_SCHEMA_TITLE': {
            en: 'Delete Schema?',
            de: 'DE Delete Schema?'
        },
        'CONFIRM_DELETE_SCHEMA_MESSAGE': {
            en: 'Are you sure you want to delete this schema?',
            de: 'DE Are you sure you want to delete this schema?'
        }
    };

    const errors = {
        'ERROR': {
            en: 'Error',
            de: 'Fehler'
        },
        'ERR_CHECK_LOGIN_DETAILS': {
            en: 'Please check your login details and try again.',
            de: 'Überprüfen Sie bitte Ihre Daten ein und versuchen Sie es erneut.'
        },
        'JSON_IS_INVALID': {
            en: 'JSON is invalid',
            de: 'DE JSON is invalid'
        },
        'ERR_SCHEMA_PLEASE_SPECIFY_DISPLAY_FIELD': {
            en: 'Please specify a displayField',
            de: 'DE Please specify a displayField'
        },
        'ERR_SCHEMA_PLEASE_SPECIFY_SEGMENT_FIELD': {
            en: 'Please specify a segmentField',
            de: 'DE Please specify a segmentField'
        },
        'ERR_SCHEMA_MUST_HAVE_AT_LEAST_ONE_FIELD': {
            en: 'Schema must have at least one field defined',
            de: 'DE Schema must have at least one field defined'
        },
        'ERR_SCHEMA_DISPLAY_FIELD_DOES_NOT_MATCH': {
            en: 'displayField value "{{ value }}" does not match any fields',
            de: 'DE displayField value "{{ value }}" does not match any fields'
        },
        'ERR_SCHEMA_SEGMENT_FIELD_DOES_NOT_MATCH': {
            en: 'segmentField value "{{ value }}" does not match any fields',
            de: 'DE segmentField value "{{ value }}" does not match any fields'
        },
        'ERR_SCHEMA_REQUIRE_NAME_AND_TYPE': {
            en: 'All fields must have a "name" and "type" property',
            de: 'DE All fields must have a "name" and "type" property'
        },
        'ERR_SCHEMA_INVALID_TYPES': {
            en: 'The following fields have invalid types {{ names }}',
            de: 'DE The following fields have invalid types {{ names }}'
        },
        'ERR_SCHEMA_DUPLICATE_FIELD_NAMES': {
            en: 'Fields must have unique names - duplicate field detected: {{ names }}',
            de: 'DE Fields must have unique names - duplicate field detected: {{ names }}'
        },
        'ERR_SCHEMA_INVALID_LIST_TYPE': {
            en: 'The following list fields have an invalid listType: {{ names }}',
            de: 'DE The following list fields have an invalid listType: {{ names }}'
        },
        'ERR_SCHEMA_ALLOW_PROPERTY_MISSING': {
            en: 'The following micronode fields must have an "allow" property defined: {{ names }}',
            de: 'DE The following micronode fields must have an "allow" property defined: {{ names }}'
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