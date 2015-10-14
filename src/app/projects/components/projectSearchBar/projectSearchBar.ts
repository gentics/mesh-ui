module meshAdminUi {

    class ProjectSearchBarController {

        public currentProject: IProject;
        public currentNode: INode;

        constructor($scope: ng.IScope,
                    private $state: ng.ui.IStateService,
                    private contextService: ContextService,
                    private dispatcher: Dispatcher) {
            this.updateCurrentContext(contextService.getProject(), contextService.getCurrentNode());

            const changeHandler = (event, project: IProject, node: INode) => {
                this.updateCurrentContext(project, node);
            };
            dispatcher.subscribe(dispatcher.events.contextChanged, changeHandler);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(changeHandler));
        }

        /**
         * Jump to a new context
         */
        public goToContext(projectName: string) {
            if (projectName !== '') {
                this.$state.go('projects.node', {projectName: projectName});
            } else {
                this.$state.go('projectsList');
            }
        }

        /**
         * Update the view model with the current context
         */
        private updateCurrentContext(currentProject: IProject, currentNode: INode) {
            this.currentProject = currentProject;
            this.currentNode = currentNode;
        }
    }

    /**
     * The search/nav bar component which allows and contextual search of projects.
     */
    function projectSearchBarDirective() {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/projectSearchBar/projectSearchBar.html',
            controller: 'projectSearchBarController',
            controllerAs: 'vm',
            scope: {}
        };
    }

    angular.module('meshAdminUi.projects')
        .directive('projectSearchBar', projectSearchBarDirective)
        .controller('projectSearchBarController', ProjectSearchBarController);
}