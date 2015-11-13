module meshAdminUi {

    class BreadcrumbsController {
        private breadcrumbs = [];
        private projectName: string;

        constructor($scope: ng.IScope,
                    private dataService: DataService,
                    private searchService: SearchService,
                    private dispatcher: Dispatcher) {

            const changeHandler = (event, project: IProject, node: INode) => {
                this.contextChangeHandler(project, node);
            };

            dispatcher.subscribe(dispatcher.events.contextChanged, changeHandler);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(changeHandler))
        }

        public isGlobal(): boolean {
            return this.searchService.getParams().searchAll;
        }

        /**
         * Update the breadcrumbs array whenever the context changes (i.e. user moves to a new
         * node or project).
         */
        private contextChangeHandler(currentProject: IProject, currentNode: INode) {
            if (!currentProject.name || !currentNode.uuid) {
                this.breadcrumbs = [];
                return;
            }

            this.projectName = currentProject.name;
            if (this.projectName === '') {
                this.breadcrumbs = [];
            } else {
                return this.dataService.getNode(currentProject.name, currentNode.uuid)
                    .then(node => this.dataService.getBreadcrumb(currentProject, node))
                    .then(breadcrumbs => {
                        let breadcrumbLabels = breadcrumbs.map(node => {
                            return {
                                name: node.fields[node.displayField],
                                uuid: node.uuid
                            };
                        });

                        breadcrumbLabels.push({
                            name: currentProject.name,
                            uuid: currentProject.rootNodeUuid
                        });

                        this.breadcrumbs = breadcrumbLabels.reverse();
                    });
            }
        }
    }


    /**
     * Directive to generate breadcrumbs for navigating a project.
     */
    function breadcrumbsDirective() {

        return {
            restrict: 'E',
            templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
            controller: 'breadcrumbsController',
            controllerAs: 'vm',
            scope: {}
        };
    }

    angular.module('meshAdminUi.common')
        .directive('breadcrumbs', breadcrumbsDirective)
        .controller('breadcrumbsController', BreadcrumbsController);


}