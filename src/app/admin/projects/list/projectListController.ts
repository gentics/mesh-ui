module meshAdminUi {

    class ProjectListController{

        public projects: IProject[];
        public projectFilter: string;

        constructor(private dataService: DataService,
                    private mu: MeshUtils) {
            dataService.getProjects()
                .then(response => this.projects = response.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.projectFilter);
        };

    }

    angular.module('meshAdminUi.admin')
        .controller('ProjectListController', ProjectListController);

}