
module meshAdminUi {

    /**
     *
     */
    class MicroschemaDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        public microschema: IMicroschema;
        public microschemaJson: string;

        constructor(
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private confirmActionDialog: ConfirmActionDialog,
            private dataService: DataService,
            private notifyService: NotifyService) {

            this.getMicroschemaData();
        }


        /**
         * Persist the user data back to the server.
         */
        public persist(microschema: IMicroschema) {
            if (!this.validateJsonContent(this.microschemaJson)) {
                return;
            }
            this.extendMicroschemaWithJsonValues(this.microschemaJson);

            this.dataService.persistMicroschema(microschema)
                .then((response: any) => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_MICROSCHEMA_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.microschemas.detail', {uuid: response.uuid});
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                })
                .catch(error => {
                    this.notifyService.toast(error.data);
                });
        }

        /**
         * Some basic validation of the microschema def.
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
            // ensure at least one field has been defined
            if (!obj.fields || obj.fields.length === 0) {
                this.notifyService.toast('Microschema must have at least one field defined.');
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
        public remove(microschema: IMicroschema) {
            return this.showDeleteDialog()
                .then(() => this.dataService.deleteMicroschema(microschema))
                .then(() => {
                    this.notifyService.toast('Deleted');
                    this.$state.go('admin.microschemas.list');
                });
        }

        /**
         */
        private showDeleteDialog() {
            return this.confirmActionDialog.show({
                title: 'Delete Microschema?',
                message: 'Are you sure you want to delete this microschema?'
            });
        }

        public canDelete() {
            if (this.microschema) {
                return this.microschema.permissions && -1 < this.microschema.permissions.indexOf('delete') && !this.isNew;
            }
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
            let jsonObj = {
                fields: microschema.fields || []
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

        public aceLoaded = (editor: AceAjax.Editor) => {
            let session = editor.getSession(),
                contentLoaded = false;

            editor.setFontSize('14px');
            editor.$blockScrolling = Infinity;

            session.on('change', (e) => {
                if (!contentLoaded) {
                    contentLoaded = true;
                } else {
                    this.modified = true
                }
            });
        };

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