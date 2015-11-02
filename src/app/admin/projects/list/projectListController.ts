module meshAdminUi {

    class ProjectListController{

        private projects: IProject[];

        constructor(private dataService: DataService) {
            dataService.getProjects()
                        .then(response => this.projects = response.data);
        }


    }

    angular.module('meshAdminUi.admin')
            .controller('ProjectListController', ProjectListController);

}