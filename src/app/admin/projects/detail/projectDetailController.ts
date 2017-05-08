module meshAdminUi {

    import IPromise = ng.IPromise;
    /**
     */
    class ProjectDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        private project: IProject;
        private schemas: ISchema[];
        private microschemas: IMicroschema[];
        private projectSchemas: { [uuid: string]: boolean} = {};
        private projectMicroschemas: { [uuid: string]: boolean} = {};

        constructor(private $q: ng.IQService,
                    private $state: ng.ui.IStateService,
                    private $stateParams: any,
                    private confirmActionDialog: ConfirmActionDialog,
                    private dataService: DataService,
                    private notifyService: NotifyService) {

            this.getProjectData();
        }

        /**
         * Persist the project data back to the server.
         */
        public persist() {
            this.dataService.persistProject(this.project)
                .then(response => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_PROJECT_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.projects.detail', {uuid: response.uuid});
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                })
                .catch(error => {
                    this.notifyService.toast(error.data.message);
                })
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(project: IProject) {

            this.showDeleteDialog()
                .then(() => this.dataService.deleteProject(project))
                .then(() => {
                    this.notifyService.toast('DELETED');
                    this.$state.go('admin.projects.list');
                });
        }

        /**
         * The project name should not have any spaces in it.
         */
        public nameChanged() {
            this.modified = true;
            this.project.name = this.project.name.replace(/\s+/, '');
        }

        /**
         */
        private showDeleteDialog(): ng.IPromise<any> {
            return this.confirmActionDialog.show({
                title: 'CONFIRM_DELETE_PROJECT_TITLE',
                message: 'CONFIRM_DELETE_PROJECT_MESSAGE'
            });
        }

        public canDelete() {
            if (this.project) {
                return this.project.permissions && this.project.permissions.delete && !this.isNew;
            }
        }

        /**
         * Get the project data from the server, or in the case of a new project,
         * create an empty project object.
         */
        private getProjectData(): ng.IPromise<any> {
            const projectId = this.$stateParams.uuid;
            if (projectId && projectId !== 'new') {
                return this.$q.all<any>([
                    this.dataService.getProject(this.$stateParams.uuid),
                    this.dataService.getSchemas(),
                    this.dataService.getMicroschemas()
                ])
                    .then((responses: any[])=> {
                        this.project = responses[0];
                        this.schemas = responses[1].data;
                        this.microschemas = responses[2].data;
                        return this.$q.all<IListResponse<ISchema | IMicroschema>>([
                            this.dataService.getProjectSchemas(this.project.name),
                            this.dataService.getProjectMicroschemas(this.project.name)
                        ]);
                    })
                    .then(response => {
                        let currentSchemaUuids = response[0].data.map(schema => schema.uuid);
                        this.schemas.forEach(schema => {
                            this.projectSchemas[schema.uuid] = -1 < currentSchemaUuids.indexOf(schema.uuid);
                        });
                        let currentMicroschemaUuids = response[1].data.map(microschema => microschema.uuid);
                        this.microschemas.forEach(microschema => {
                            this.projectMicroschemas[microschema.uuid] = -1 < currentMicroschemaUuids.indexOf(microschema.uuid);
                        });
                    });
            } else {
                this.project = this.createEmptyProject();
                this.isNew = true;
            }
        }

        public toggleSchema(schema: ISchema) {
            let add = this.projectSchemas[schema.uuid];
            let promise;
            if (add) {
                promise = this.dataService.addSchemaToProject(schema.uuid, this.project.name);
            } else {
                promise = this.dataService.removeSchemaFromProject(schema.uuid, this.project.name);
            }
            promise.then(() => {
                let token = add ? 'SCHEMA_ADDED_TO_PROJECT' : 'SCHEMA_REMOVED_FROM_PROJECT';
                this.notifyService.toast(token, { name: schema.name });
            });
        }

        public toggleMicroschema(microschema: IMicroschema) {
            let add = this.projectMicroschemas[microschema.uuid];
            let promise;
            if (add) {
                promise = this.dataService.addMicroschemaToProject(microschema.uuid, this.project.name);
            } else {
                promise = this.dataService.removeMicroschemaFromProject(microschema.uuid, this.project.name);
            }
            promise.then(() => {
                let token = add ? 'MICROSCHEMA_ADDED_TO_PROJECT' : 'MICROSCHEMA_REMOVED_FROM_PROJECT';
                this.notifyService.toast(token, { name: microschema.name });
            });
        }

        /**
         * Create an empty project object.
         */
        private createEmptyProject(): IProject & { schema: { name: string }; } {
            return {
                name: '',
                rootNode: {
                    uuid: ''
                },
                schema: {
                    name: 'folder'
                }
            };
        }
    }

    angular.module('meshAdminUi.admin')
           .controller('ProjectDetailController', ProjectDetailController);

}