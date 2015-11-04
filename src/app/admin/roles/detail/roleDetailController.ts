module meshAdminUi {

    enum NodeType {
        PROJECT,
        SCHEMA,
        GROUP,
        USER,
        ROLE,
        NODE
    }

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

        public setNodePermissions(node: INode, project:IProject, permissions: IPermissionsRequest) {
            this.dataService.setNodePermissions(this.role.uuid, project.uuid, node.uuid, permissions)
                .then(() => this.notifyService.toast(`Permissions set on node "${node.fields[node.displayField]}"`));
        }

        public setProjectPermissions(permissions: IPermissionsRequest, project?: IProject) {
           return this.executeSetPermissions(NodeType.PROJECT, permissions, project);
        }

        public setSchemaPermissions(permissions: IPermissionsRequest, schema: ISchema) {
            return this.executeSetPermissions(NodeType.SCHEMA, permissions, schema);
        }

        public setUserPermissions(permissions: IPermissionsRequest, user: IUser) {
            return this.executeSetPermissions(NodeType.USER, permissions, user);
        }

        public setGroupPermissions(permissions: IPermissionsRequest, group: IUserGroup) {
            return this.executeSetPermissions(NodeType.GROUP, permissions, group);
        }

        public setRolePermissions(permissions: IPermissionsRequest, role: IUserRole) {
            return this.executeSetPermissions(NodeType.ROLE, permissions, role);
        }

        public executeSetPermissions(type: NodeType, permissions: IPermissionsRequest, node?: any) {
            let uuid = (typeof node === 'undefined') ? undefined : node.uuid,
                name = (typeof node === 'undefined') ? undefined : node.name || node.username,
                nodeType,
                promise: ng.IPromise<any>;

            switch (type) {
                case NodeType.PROJECT:
                    promise = this.dataService.setProjectPermissions(this.role.uuid, permissions, uuid);
                    nodeType = 'project';
                    break;
                case NodeType.SCHEMA:
                    promise = this.dataService.setSchemaPermissions(this.role.uuid, permissions, uuid);
                    nodeType = 'schema';
                    break;
                case NodeType.USER:
                    promise = this.dataService.setUserPermissions(this.role.uuid, permissions, uuid);
                    nodeType = 'user';
                    break;
                case NodeType.GROUP:
                    promise = this.dataService.setGroupPermissions(this.role.uuid, permissions, uuid);
                    nodeType = 'group';
                    break;
                case NodeType.ROLE:
                    promise = this.dataService.setRolePermissions(this.role.uuid, permissions, uuid);
                    nodeType = 'role';
                    break;
                default:
            }

            return promise.then(this.notifyPermissionsSuccess(nodeType, name));
        }

        private notifyPermissionsSuccess(nodeType: string, name?: string) {
            let message = `Permissions set on ${nodeType}`;
            message += typeof name === 'undefined' ? 's' : ` "${name}"`;
            this.notifyService.toast(message)
        }
    }

    angular.module('meshAdminUi.admin')
        .controller('RoleDetailController', RoleDetailController);

}