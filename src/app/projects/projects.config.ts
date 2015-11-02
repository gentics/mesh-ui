module meshAdminUi {

    angular.module('meshAdminUi.projects')
        .config(routesConfig);

    function routesConfig($stateProvider) {
        $stateProvider
            .state('projects', {
                abstract: true,
                url: '',
                views: {
                    'main': {
                        templateUrl: 'projects/projects.html',
                        controller: 'projectController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('projects.node', {
                url: '/projects/:projectName/:nodeId',
                views: {
                    'node-contents': {
                        templateUrl: `projects/projectExplorer/projectExplorer.html`,
                        controller: 'ProjectExplorerController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    currentNode: updateContext
                }
            })
            .state('projectsList', {
                url: '/projects',
                views: {
                    'main': {
                        templateUrl: 'projects/projectsList/projectsList.html',
                        controller: 'ProjectsListController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    parentNode: updateContext
                }
            });
    }

    /**
     * Update the context service with the current project. Used in the "resolve" property of the
     * state defs so that it will get invoked by any child states of a project on page load.
     */
    function updateContext($q:ng.IQService, $stateParams: any, dataService: DataService, contextService: ContextService) {
        var projectName = $stateParams.projectName || '',
            nodeId = $stateParams.nodeId,
            result;

        if (projectName !== '') {
            var qProject = dataService.getProjectByName(projectName),
                qNode = dataService.getNode(projectName, nodeId);

            result = $q.all([qProject, qNode])
                .then((result: any) => {
                    var project = result[0],
                        node = result[1];

                    contextService.setProject(project);
                    contextService.setCurrentNode(node);
                    return node;
                });
        } else {
            contextService.setProject();
            contextService.setCurrentNode();
        }

        return result;
    }

}