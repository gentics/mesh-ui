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

        public isReadonly() {
            return !this.role || this.role.name === 'admin' || -1 === this.role.permissions.indexOf('update');
        }

        public setProjectPermissions(project: IProject, permissions: IPermissionsRequest) {
            this.dataService.setProjectPermissions(this.role.uuid, project.uuid, permissions)
                .then(() => this.notifyService.toast(`Permissions set on project "${project.name}"`));
        }
        public setSchemaPermissions(schema: ISchema, permissions: IPermissionsRequest) {
            this.dataService.setSchemaPermissions(this.role.uuid, schema.uuid, permissions)
                .then(() => this.notifyService.toast(`Permissions set on schema "${schema.name}"`));
        }
        public setUserPermissions(user: IUser, permissions: IPermissionsRequest) {
            this.dataService.setUserPermissions(this.role.uuid, user.uuid, permissions)
                .then(() => this.notifyService.toast(`Permissions set on user "${user.username}"`));
        }
        public setGroupPermissions(group: IUserGroup, permissions: IPermissionsRequest) {
            this.dataService.setGroupPermissions(this.role.uuid, group.uuid, permissions)
                .then(() => this.notifyService.toast(`Permissions set on group "${group.name}"`));
        }
        public setRolePermissions(role: IUserRole, permissions: IPermissionsRequest) {
            this.dataService.setRolePermissions(this.role.uuid, role.uuid, permissions)
                .then(() => this.notifyService.toast(`Permissions set on role "${role.name}"`));
        }
    }

    angular.module('meshAdminUi.admin')
        .controller('RoleDetailController', RoleDetailController);

}