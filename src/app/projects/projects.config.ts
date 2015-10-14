module meshAdminUi {

    angular.module('meshAdminUi.projects')
        .config(routesConfig);

    function routesConfig($stateProvider) {
        $stateProvider
            .state('projects', {
                url: '/projects',
                abstract: true,
                views: {
                    'main': {
                        templateUrl: 'projects/projects.html'
                    }
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
            })
            .state('projects.explorer', {
                url: '/:projectName/:nodeId',
                views: {
                    'explorer': {
                        templateUrl: 'projects/projectExplorer/projectExplorer.html',
                        controller: 'ProjectExplorerController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    parentNode: updateContext
                }
            })
            .state('projects.explorer.tag', {
                url: '/tag/:uuid',
                views: {
                    'projects@projects': {
                        templateUrl: 'projects/tagEditor/tagEditor.html',
                        controller: 'TagEditorController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('projects.explorer.createTag', {
                url: '/tag/new?schemaId',
                views: {
                    'projects@projects': {
                        templateUrl: 'projects/tagEditor/tagEditor.html',
                        controller: 'TagEditorController',
                        controllerAs: 'vm'
                    }
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