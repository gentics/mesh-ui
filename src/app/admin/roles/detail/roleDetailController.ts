module meshAdminUi {

    class RoleDetailController {
        private roleId: string;
        private isNew: boolean;
        private modified: boolean;
        private role: IUserRole;
        private schemas: ISchema[];
        private microschemas: any[];
        private projects: IProject[];
        private roles: IUserRole[];
        private groups: IUserGroup[];
        private users: IUser[];

        constructor(
            private $q: ng.IQService,
            private $stateParams: any,
            private dataService: DataService) {

            this.roleId = $stateParams.uuid;
            this.isNew = false;
            this.modified = false;

            this.getRoleData();

            var queryParams = {
                "role": $stateParams.uuid
            };

            $q.all([
                dataService.getSchemas(queryParams),
                dataService.getMicroschemas(queryParams),
                dataService.getProjects(queryParams),
                dataService.getRoles(queryParams),
                dataService.getGroups(queryParams),
                dataService.getUsers(queryParams)
            ])
                .then((dataArray: any[]) => {
                    this.schemas = dataArray[0].data;
                    this.microschemas = dataArray[1].data;
                    this.projects = dataArray[2].data;
                    this.roles = dataArray[3].data;
                    this.groups = dataArray[4].data;
                    this.users = dataArray[5].data;
                });

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