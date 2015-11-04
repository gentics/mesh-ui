
module meshAdminUi {

    /**
     *
     */
    class SchemaDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        public schema: ISchema;
        public schemaJson: string;

        constructor(
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private confirmActionDialog: ConfirmActionDialog,
            private dataService: DataService,
            private notifyService: NotifyService) {

            this.getSchemaData();
        }


        /**
         * Persist the user data back to the server.
         */
        public persist(schema: ISchema) {
            if (!this.validateJsonContent(this.schemaJson)) {
                return;
            }
            this.extendSchemaWithJsonValues(this.schemaJson);

            if (this.isNew) {
                this.dataService.persistSchema(schema)
                    .then((response: any) => {
                        if (this.isNew) {
                            this.notifyService.toast('NEW_SCHEMA_CREATED');
                            this.isNew = false;
                            this.$state.go('admin.schemas.detail', {uuid: response.uuid});
                        } else {
                            this.notifyService.toast('SAVED_CHANGES');
                            this.modified = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.notifyService.toast(error.data);
                    });
            } else {
                this.notifyService.toast('Sorry, updating of schemas is not yet implemented in the beta.');
                this.modified = false;
            }
        }

        /**
         * Some basic validation of the schema def.
         * TODO: need much more robust and precise validation.
         */
        private validateJsonContent(json: string) {
            let obj;
            try{
                obj = JSON.parse(json);
            } catch(e) {
                this.notifyService.toast('JSON is invalid.');
                return false;
            }
            // ensure the displayField is set
            if (typeof obj.displayField === 'undefined' || obj.displayField === '') {
                this.notifyService.toast('Please specify a displayField.');
                return false;
            }
            // ensure at least one field has been defined
            if (!obj.fields || obj.fields.length === 0) {
                this.notifyService.toast('Schema must have at least one field defined.');
                return false;
            }
            // ensure displayField matches an actual field name
            let fieldNames = obj.fields.map(field => field.name);
            if (fieldNames.indexOf(obj.displayField) === -1) {
                this.notifyService.toast(`displayField value "${obj.displayField}" does not match any fields.`);
                return false;
            }
            // ensure each field has a name and type
            let badFields = obj.fields.filter(field => {
                return !field.name || !field.type;
            });
            if (0 < badFields.length) {
                this.notifyService.toast(`All fields must have a "name" and "type" property.`);
                return false;
            }
            return true;
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(schema: ISchema) {
            return this.showDeleteDialog()
                .then(() => this.dataService.deleteSchema(schema))
                .then(() => {
                    this.notifyService.toast('Deleted');
                    this.$state.go('admin.schemas.list');
                });
        }

        /**
         */
        private showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'Delete Schema?',
                message: 'Are you sure you want to delete this schema?'
            });
        }

        public canDelete() {
            if (this.schema) {
                return this.schema.permissions && -1 < this.schema.permissions.indexOf('delete') && !this.isNew;
            }
        }

        /**
         * Get the user data from the server, or in the case of a new user,
         * create an empty user object.
         */
        private getSchemaData() {
            var uuid = this.$stateParams.uuid;
            if (uuid && uuid !== 'new') {
                return this.dataService.getSchema(uuid)
                    .then(data => {
                        this.schema = data;
                        this.schemaJson = this.schemaToJson(this.schema);
                    });
            } else {
                this.schema = this.createEmptySchema();
                this.schemaJson = this.schemaToJson(this.schema);
                this.isNew = true;
            }
        }

        /**
         * Converts the schema object into a json string to be used in the editor.
         */
        private schemaToJson(schema: ISchema): string {
            let jsonObj = {
                displayField: schema.displayField || '',
                folder: schema.folder || false,
                binary: schema.binary || false,
                fields: schema.fields || []
            };
            return JSON.stringify(jsonObj, null, '\t');
        }

        /**
         * Takes the code from the json editor and merges the values back with the original schema object.
         */
        private extendSchemaWithJsonValues(json: string) {
            let jsonObject = JSON.parse(json);
            angular.extend(this.schema, jsonObject);
        }

        public aceLoaded = (editor: AceAjax.Editor) => {
            let session = editor.getSession(),
                contentLoaded = false;

            editor.setFontSize('14px');

            session.on('change', (e) => {
                if (!contentLoaded) {
                    contentLoaded = true;
                } else {
                    this.modified = true
                }
            });
        };

        /**
         * Create an empty user object.
         */
        private createEmptySchema(): ISchema {
            return {
                binary: false,
                displayField: '',
                fields: [],
                folder: false,
                name: ''
            };
        }
    }

    angular.module('meshAdminUi.admin')
          .controller('SchemaDetailController', SchemaDetailController);
}