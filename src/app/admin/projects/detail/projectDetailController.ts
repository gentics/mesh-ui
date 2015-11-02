module meshAdminUi {

    /**
     */
    class ProjectDetailController {

        private isNew: boolean = false;
        private modified: boolean = false;
        private project: IProject;

        constructor(private $state: ng.ui.IStateService,
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
                });
        }

        /**
         * Delete the open content, displaying a confirmation dialog first before making the API call.
         */
        public remove(project: IProject) {

            this.showDeleteDialog()
                .then(() => this.dataService.deleteProject(project))
                .then(() => {
                    this.notifyService.toast('Deleted');
                    this.$state.go('admin.projects.list');
                });
        }

        /**
         */
        private showDeleteDialog(): ng.IPromise<any> {
            return this.confirmActionDialog.show({
                title: 'Delete Project?',
                message: 'Are you sure you want to delete this project?'
            });
        }

        public canDelete() {
            if (this.project) {
                return this.project.permissions && -1 < this.project.permissions.indexOf('delete') && !this.isNew;
            }
        }

        /**
         * Get the project data from the server, or in the case of a new project,
         * create an empty project object.
         */
        private getProjectData(): ng.IPromise<any> {
            var projectId = this.$stateParams.uuid;
            if (projectId) {
                return this.dataService.getProject(this.$stateParams.uuid)
                    .then(response => this.project = response);
            } else {
                this.project = this.createEmptyProject();
                this.isNew = true;
            }
        }

        /**
         * Create an empty project object.
         */
        private createEmptyProject(): IProject {
            return {
                name: '',
                rootNodeUuid: ''
            };
        }
    }

    angular.module('meshAdminUi.admin')
           .controller('ProjectDetailController', ProjectDetailController);

}