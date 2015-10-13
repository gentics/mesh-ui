module meshAdminUi {

    class ProjectsListController {

        public projects: IProject[];

        constructor(private dataService: DataService) {
            this.populate();
        }

        public populate() {
            this.dataService.getProjects()
                .then(data => {
                    this.projects = data.data;
                });
        }

    }

    angular.module('meshAdminUi.projects')
           .controller('ProjectsListController', ProjectsListController);
}