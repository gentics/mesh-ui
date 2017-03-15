
module meshAdminUi {

    /**
     *
     */
    class MicroschemaDetailController {

        private isNew: boolean = false;
        private isValid: boolean = true;
        private modified: boolean = false;
        private contentLoaded: boolean = false;

        public lastError: string = '';
        public microschema: IMicroschema;
        public microschemaJson: string;
        public schemas: ISchema[] = [];

        constructor(
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private schemaValidatorService: SchemaValidatorService,
            private confirmActionDialog: ConfirmActionDialog,
            private schemaUpdateService: SchemaUpdateService,
            private dataService: DataService,
            private notifyService: NotifyService) {

            this.getMicroschemaData();

            dataService.getSchemas()
                .then(response => this.schemas = response.data);
        }


        /**
         * Persist the user data back to the server.
         */
        public persist(microschema: IMicroschema) {
            this.extendMicroschemaWithJsonValues(this.microschemaJson);

            if (this.isNew) {
                this.dataService.createMicroschema(microschema)
                    .then((response: any) => {
                        this.notifyService.toast('NEW_MICROSCHEMA_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.microschemas.detail', { uuid: response.uuid });
                    })
                    .catch(error => this.notifyService.toast([error.data.message, error.data.internalMessage]));
            } else {
                this.dataService.forceMicroschemaUpdate(microschema)
                   /* .then(changeset => this.schemaUpdateService.openDialog(microschema, changeset))
                    .then(changeset => this.dataService.applyMicroschemaChangeset(microschema, changeset))*/
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
        public remove(microschema: IMicroschema) {
            return this.showDeleteDialog()
                .then(() => this.dataService.deleteMicroschema(microschema))
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.$state.go('admin.microschemas.list');
                });
        }

        /**
         */
        private showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'CONFIRM_DELETE_MICROSCHEMA_TITLE',
                message: 'CONFIRM_DELETE_MICROSCHEMA_MESSAGE'
            });
        }

        public canDelete() {
            if (this.microschema) {
                return this.microschema.permissions && this.microschema.permissions.delete && !this.isNew;
            }
        }

        /**
         * Callback invoked by the schemaEditor component when changes are made.
         */
        public microschemaChanged(microschema: IMicroschema) {
            this.microschema = microschema;
            this.microschemaJson = this.microschemaToJson(this.microschema);
            this.modified = true;
        }


        /**
         * Get the user data from the server, or in the case of a new user,
         * create an empty user object.
         */
        private getMicroschemaData() {
            var uuid = this.$stateParams.uuid;
            if (uuid && uuid !== 'new') {
                return this.dataService.getMicroschema(uuid)
                    .then(data => {
                        this.microschema = data;
                        this.microschemaJson = this.microschemaToJson(this.microschema);
                        this.checkErrors();
                    });
            } else {
                this.microschema = this.createEmptyMicroschema();
                this.microschemaJson = this.microschemaToJson(this.microschema);
                this.isNew = true;
            }
        }

        /**
         * Converts the microschema object into a json string to be used in the editor.
         */
        private microschemaToJson(microschema: IMicroschema): string {
            const removeHashKey = (f: any) => {
                delete f.$$hashKey;
                return f;
            };

            let jsonObj = {
                name: microschema.name || '',
                fields: microschema.fields.map(removeHashKey) || []
            };
            return JSON.stringify(jsonObj, null, '\t');
        }

        /**
         * Takes the code from the json editor and merges the values back with the original microschema object.
         */
        private extendMicroschemaWithJsonValues(json: string) {
            let jsonObject = JSON.parse(json);
            angular.extend(this.microschema, jsonObject);
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
         * Run validation on the microschema and set the error message and isValid status accordingly
         */
        private checkErrors() {
            this.lastError = '';
            const setLastError = message => this.lastError = message;
            this.isValid = this.schemaValidatorService.validateMichroschemaJson(this.microschemaJson, setLastError);
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
                this.schemaValidatorService.validateSchemaJson(this.microschemaJson, displayErrors);
            } else {
                this.extendMicroschemaWithJsonValues(this.microschemaJson);
            }
        }

        /**
         * Create an empty microschema object.
         */
        private createEmptyMicroschema(): IMicroschema {
            return {
                fields: [],
                name: ''
            };
        }
    }

    angular.module('meshAdminUi.admin')
        .controller('MicroschemaDetailController', MicroschemaDetailController);
}