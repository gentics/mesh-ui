angular.module('caiLunAdminUi.projects')
    .run(projectsRunBlock)
    .config(routesConfig);

function projectsRunBlock($rootScope, contextService) {
    /**
     * Update the contextService if transitioning to a project state.
     */
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
        if (toState.name === 'projects.explorer') {
            contextService.setProject(toParams.projectName, '');
        }
        else if (toState.name === 'projects.list') {
            contextService.setProject('', '');
        }
    });
}

function routesConfig($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        abstract: true,
        views: {
            'main' : {
                templateUrl: 'projects/projects.html',
                controller: 'ProjectsListController',
                controllerAs: 'vm'
            }
        }
    })
        .state('projects.list', {
            url: '',
            views: {
                'projects': {
                    templateUrl: 'projects/projectsList/projectsList.html'
                }
            }
        })
        .state('projects.explorer', {
            url: '/:projectName',
            views: {
                'projects' : {
                    templateUrl: 'projects/projectExplorer/projectExplorer.html',
                    controller: 'ProjectExplorerController',
                    controllerAs: 'vm'
                }
            }
        });
}