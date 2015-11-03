
module meshAdminUi {

    /**
     *
     */
    class SchemaDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        private schema: ISchema;

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
            this.dataService.persistSchema(schema)
                .then((response: any) => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_SCHEMA_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.schema.detail', {uuid: response.uuid});
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                });
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(schema: ISchema) {
            return this.showDeleteDialog()
                .then(() => this.dataService.deleteSchema(schema))
                .then(() => {
                    this.notifyService.toast('Deleted');
                    this.$state.go('admin.schema.list');
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
                    .then(data => this.schema = data);
            } else {
                this.schema = this.createEmptySchema();
                this.isNew = true;
            }
        }

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