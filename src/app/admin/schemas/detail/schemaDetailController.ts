
module meshAdminUi {

    /**
     *
     */
    class SchemaDetailController {

        private isNew: boolean = false;
        private isValid: boolean = true;
        private modified: boolean = false;
        private contentLoaded: boolean = false;

        public lastError: string = '';
        public schema: ISchema;
        public schemaJson: string;
        public microschemas: IMicroschema[] = [];
        public schemas: ISchema[] = [];

        constructor(
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private schemaValidatorService: SchemaValidatorService,
            private schemaUpdateService: SchemaUpdateService,
            private confirmActionDialog: ConfirmActionDialog,
            private dataService: DataService,
            private notifyService: NotifyService) {

            this.getSchemaData();

            dataService.getMicroschemas()
                .then(response => this.microschemas = response.data);
            dataService.getSchemas()
                .then(response => this.schemas = response.data);
        }


        /**
         * Persist the user data back to the server.
         */
        public persist(schema: ISchema) {
            this.extendSchemaWithJsonValues(this.schemaJson);

            if (this.isNew) {
                this.dataService.createSchema(schema)
                    .then((response: any) => {
                        this.notifyService.toast('NEW_SCHEMA_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.schemas.detail', { uuid: response.uuid });
                    })
                    .catch(error => this.notifyService.toast([error.data.message, error.data.internalMessage]));
            } else {
                this.dataService.diffSchema(schema)
                    .then(changeset => this.schemaUpdateService.openDialog(schema, changeset))
                    .then(changeset => this.dataService.applySchemaChangeset(schema, changeset))
                    .then(() => {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    })
                    .catch(error => {
                        if (error) {
                            this.notifyService.toast([error.data.message, error.data.internalMessage]);
                        }
                    });
            }
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(schema: ISchema) {
            return this.showDeleteDialog()
                .then(() => this.dataService.deleteSchema(schema))
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.$state.go('admin.schemas.list');
                });
        }

        /**
         */
        private showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'CONFIRM_DELETE_SCHEMA_TITLE',
                message: 'CONFIRM_DELETE_SCHEMA_MESSAGE'
            });
        }

        public canDelete() {
            if (this.schema) {
                return this.schema.permissions && -1 < this.schema.permissions.indexOf('delete') && !this.isNew;
            }
        }

        /**
         * Callback invoked by the schemaEditor component when changes are made.
         */
        public schemaChanged(schema: ISchema) {
            this.schema = schema;
            this.schemaJson = this.schemaToJson(this.schema);
            this.modified = true;
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
                        this.checkErrors();
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
            const removeHashKey = (f: any) => {
                delete f.$$hashKey;
                return f;
            };

            let jsonObj = {
                name: schema.name || '',
                displayField: schema.displayField || '',
                segmentField: schema.segmentField || '',
                container: schema.container || false,
                binary: schema.binary || false,
                fields: schema.fields.map(removeHashKey) || []
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

        /**
         * Set up the ACE editor.
         */
        public aceLoaded = (editor: AceAjax.Editor) => {
            editor.setFontSize('14px');
            editor.$blockScrolling = Infinity;
        };

        /**
         * Handle data-binding from the ACE editor instance.
         */
        public aceChanged = () => {
            if (!this.contentLoaded) {
                this.contentLoaded = true;
                return;
            }
            this.modified = true;
            this.checkErrors();
        };

        /**
         * Run validation on the schema and set the error message and isValid status accordingly
         */
        private checkErrors() {
            this.lastError = '';
            const setLastError = message => this.lastError = message;
            this.isValid = this.schemaValidatorService.validateSchemaJson(this.schemaJson, setLastError);
        }

        /**
         * When the tab containing the ACE JSON editor is deselected, run validation and display
         * a toast message on any errors.
         */
        public deselectJsonTab() {
            const displayErrors = message => {
                this.notifyService.toast(message);
            };
            if (!this.isValid) {
                this.schemaValidatorService.validateSchemaJson(this.schemaJson, displayErrors);
            } else {
                this.extendSchemaWithJsonValues(this.schemaJson);
            }
        }

        /**
         * Create an empty user object.
         */
        private createEmptySchema(): ISchema {
            return {
                binary: false,
                displayField: '',
                segmentField: '',
                fields: [],
                container: false,
                name: ''
            };
        }
    }

    angular.module('meshAdminUi.admin')
        .controller('SchemaDetailController', SchemaDetailController);
}