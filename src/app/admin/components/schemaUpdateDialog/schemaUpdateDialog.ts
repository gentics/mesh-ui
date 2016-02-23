module meshAdminUi {

    export interface ISchemaChange {
        operation: string;
        properties: any;
        migrationScript: string;
    }

    export interface ISchemaChangeset {
        changes: ISchemaChange[]
    }


    export class SchemaUpdateService {

        constructor(private $mdDialog: ng.material.IDialogService) {}

        /**
         * Opens the node schema update dialog in order to show the results of the schema diff.
         */
        public openDialog(schema: ISchema|IMicroschema, changeset: ISchemaChangeset): ng.IPromise<ISchemaChangeset> {
            return this.$mdDialog.show({
                templateUrl: 'admin/components/schemaUpdateDialog/schemaUpdateDialog.html',
                controller: 'SchemaUpdateDialogController',
                controllerAs: 'dialog',
                locals: {
                    schema,
                    changeset
                },
                bindToController: true
            });
        }
    }

    class SchemaUpdateDialogController {

        private changeset: ISchemaChangeset;

        constructor(private $mdDialog: ng.material.IDialogService) {}

        public update() {
            this.$mdDialog.hide(this.changeset);
        }

        public cancel() {
            this.$mdDialog.cancel();
        }

    }

    class SchemaUpdateFormController {
        private changeset: ISchemaChangeset;

        constructor(private i18n: I18nFilter) {}

        /**
         * Returns a human-readable description of the change (in the imperative mood i.e. "Add a field named 'Foo'")
         */
        public describeChange(change: ISchemaChange): string {
            let description = '';
            let props = change.properties;

            switch (change.operation) {
                case 'ADDFIELD':
                    description = this.i18n('ADD_SCHEMA_FIELD_NAMED', { fieldName: props.field });
                    break;
                case 'REMOVEFIELD':
                    description = this.i18n('REMOVE_SCHEMA_FIELD', { fieldName: props.field });
                    break;
                case 'UPDATEFIELD':
                    let keys = Object.keys(props).filter(k => k !== 'field');
                    let values = keys.map(k => `"${props[k].toString()}"`);
                    description = this.i18n('UPDATE_SCHEMA_FIELD', { fieldName: props.field, keys: keys.join(', '), values: values.join(', ') });
                    break;
                case 'CHANGEFIELDTYPE':
                    description = this.i18n('CHANGE_SCHEMA_FIELD_TYPE', { fieldName: props.field, type: props.newType });
                    break;
                case 'UPDATESCHEMA':
                    let key = Object.keys(props)[0];
                    description = this.i18n('UPDATE_SCHEMA_PROPERTY', { key: key, value: props[key] });
                    break;
                default:
                    description = this.i18n('SCHEMA_OPERATION_NOT_RECOGNIZED', { name: change.operation });
            }

            return description;
        }

        /**
         * Returns a CSS class based on the change operation
         */
        public getChangeClass(change: ISchemaChange): string {
            switch (change.operation) {
                case 'ADDFIELD':
                    return 'change-add';
                case 'REMOVEFIELD':
                    return 'change-remove';
                case 'CHANGEFIELDTYPE':
                case 'UPDATESCHEMA':
                case 'UPDATEFIELD':
                    return 'change-update';
                default:
                    return '';
            }
        }
    }

    function schemaUpdateFormDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/schemaUpdateDialog/schemaUpdateForm.html',
            controller: 'SchemaUpdateFormController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                changeset: '='
            }
        }
    }

    angular.module('meshAdminUi.admin')
        .service('schemaUpdateService', SchemaUpdateService)
        .controller('SchemaUpdateDialogController', SchemaUpdateDialogController)
        .controller('SchemaUpdateFormController', SchemaUpdateFormController)
        .directive('schemaUpdateForm', schemaUpdateFormDirective);
}
