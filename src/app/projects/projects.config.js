angular.module('caiLunAdminUi.projects')
    .config(routesConfig);

function routesConfig($stateProvider) {
    $stateProvider
        .state('projects', {
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
            },
            resolve: {
                currentProject: updateContext
            }
        })
        .state('projects.explorer', {
            url: '/:projectName/:tagId',
            views: {
                'projects' : {
                    templateUrl: 'projects/projectExplorer/projectExplorer.html',
                    controller: 'ProjectExplorerController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                currentProject: updateContext
            }
        })
        .state('projects.explorer.content', {
            url: '/content/:uuid',
            views: {
                'projects@projects' : {
                    templateUrl: 'projects/contentEditor/contentEditor.html',
                    controller: 'ContentEditorController',
                    controllerAs: 'vm'
                }
            }
        });
}

/**
 * Update the context service with the current project. Used in the "resolve" property of the
 * state defs so that it will get invoked by any child states of a project on page load.
 *
 * @param $stateParams
 * @param dataService
 * @param contextService
 */
function updateContext($stateParams, dataService, contextService) {
    var projectName = $stateParams.projectName || '',
        tagId = $stateParams.tagId,
        result;

    if (projectName !== '') {
        result = dataService.getProjectId(projectName)
            .then(function (projectId) {
                contextService.setProject(projectName, projectId);
                contextService.setTag('', tagId);
            });
    } else {
        result = contextService.setProject('', '');
        contextService.setTag('', '');
    }

    return result;
}