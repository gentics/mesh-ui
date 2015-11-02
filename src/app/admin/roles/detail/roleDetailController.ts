module meshAdminUi {

    class RoleDetailController {
        private roleId: string;
        private isNew: boolean;
        private modified: boolean;
        private role: IUserRole;
        private schemas: ISchema[];
        private projects: IProject[];
        private roles: IUserRole[];
        private groups: IUserGroup[];
        private users: IUser[];

        constructor(
            private $q: ng.IQService,
            private $state: ng.ui.IStateService,
            private $stateParams: any,
            private notifyService: NotifyService,
            private dataService: DataService) {

            this.roleId = $stateParams.uuid;
            this.isNew = this.roleId === 'new';
            this.modified = false;

            if (!this.isNew) {
                this.getRoleData();

                var queryParams = {
                    "role": $stateParams.uuid
                };
                $q.all([
                        dataService.getSchemas(queryParams),
                        dataService.getProjects(queryParams),
                        dataService.getRoles(queryParams),
                        dataService.getGroups(queryParams),
                        dataService.getUsers(queryParams)
                    ])
                    .then((dataArray:any[]) => {
                        this.schemas = dataArray[0].data;
                        this.projects = dataArray[1].data;
                        this.roles = dataArray[2].data;
                        this.groups = dataArray[3].data;
                        this.users = dataArray[4].data;
                    });
            }
        }

        /**
         * Get the project data from the server, or in the case of a new project,
         * create an empty project object.
         */
        public getRoleData() {
            if (this.roleId) {
                return this.dataService.getRole(this.roleId)
                    .then(data =>this.role = data);
            } else {
                this.role = this.createEmptyRole();
                this.isNew = true;
            }
        }

        public persist(role: IUserRole) {
            this.dataService.persistRole(role)
                .then(response => {
                    if (this.isNew) {
                        this.notifyService.toast('NEW_ROLE_CREATED');
                        this.isNew = false;
                        this.$state.go('admin.roles.detail', {uuid: response.uuid});
                    } else {
                        this.notifyService.toast('SAVED_CHANGES');
                        this.modified = false;
                    }
                });
        }

        /**
         * Create an empty project object.
         */
        public createEmptyRole(): IUserRole {
            return {
                name: '',
                groups: []
            };
        }
    }

    angular.module('meshAdminUi.admin')
        .controller('RoleDetailController', RoleDetailController);

}