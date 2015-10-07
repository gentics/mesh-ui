module meshAdminUi {

    /**
     * Directive to generate breadcrumbs for navigating a project.
     */
    function breadcrumbsDirective($q: ng.IQService, dataService: DataService, contextService: ContextService) {

        function breadcrumbsController() {
            var vm = this;
            vm.breadcrumbs = [];

            vm.clearProject = function () {
                vm.projectName = '';
                vm.breadcrumbs = [];
            };

            populateBreadcrumbs();
            contextService.registerContextChangeHandler(contextChangeHandler);

            /**
             * Populate the breadcrumbs on the initial page load. This would only be called once, when
             * the app bootstraps, and is responsible for setting the breadcrumbs on first load.
             */
            function populateBreadcrumbs() {
                contextChangeHandler(contextService.getProject(), contextService.getCurrentNode());
            }

            /**
             * Update the breadcrumbs array whenever the context changes (i.e. user moves to a new
             * node or project).
             */
            function contextChangeHandler(currentProject: IProject, currentNode: INode) {
                vm.projectName = currentProject.name;

                if (vm.projectName === '') {
                    vm.breadcrumbs = [];
                } else {
                    return dataService.getNode(currentProject.name, currentNode.uuid)
                        .then(node => {
                            return getBreadcrumbs(currentProject, node);
                        })
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

                            vm.breadcrumbs = breadcrumbLabels.reverse();
                        });
                }
            }

            /**
             * TODO: implement dedicated breadcrumbs endpoint when one becomes available.
             * This is a recursive promise-based solution which is inefficient in that it
             * needs to make a call for each level of the breadcrumb hierarchy.
             */
            function getBreadcrumbs(project: IProject, currentNode:INode, breadcrumbs: INode[] = []): ng.IPromise<INode[]> {
                let complete = breadcrumbs;
                breadcrumbs.push(currentNode);

                if (currentNode.parentNode && currentNode.parentNode.uuid !== project.uuid) {
                    complete = dataService.getNode(project.name, currentNode.parentNode.uuid)
                        .then(node => getBreadcrumbs(project, node, breadcrumbs));
                }

                return $q.when(complete);
            }

        }

        return {
            restrict: 'E',
            templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
            controller: breadcrumbsController,
            controllerAs: 'vm',
            scope: {}
        };
    }

    angular.module('meshAdminUi.common')
            .directive('breadcrumbs', breadcrumbsDirective);


}