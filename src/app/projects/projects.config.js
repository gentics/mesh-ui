angular.module('meshAdminUi.projects')
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
                parentNode: updateContext
            }
        })
        .state('projects.explorer', {
            url: '/:projectName/:nodeId',
            views: {
                'projects' : {
                    templateUrl: 'projects/projectExplorer/projectExplorer.html',
                    controller: 'ProjectExplorerController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                parentNode: updateContext
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
        })
        .state('projects.explorer.createContent', {
            url: '/content/new?schemaId',
            views: {
                'projects@projects' : {
                    templateUrl: 'projects/contentEditor/contentEditor.html',
                    controller: 'ContentEditorController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('projects.explorer.tag', {
            url: '/tag/:uuid',
            views: {
                'projects@projects' : {
                    templateUrl: 'projects/tagEditor/tagEditor.html',
                    controller: 'TagEditorController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('projects.explorer.createTag', {
            url: '/tag/new?schemaId',
            views: {
                'projects@projects' : {
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
 *
 * @param $q
 * @param $stateParams
 * @param dataService
 * @param contextService
 */
function updateContext($q, $stateParams, dataService, contextService) {
    var projectName = $stateParams.projectName || '',
        nodeId = $stateParams.nodeId,
        result;

    if (projectName !== '') {
        var qProject = dataService.getProjectId(projectName),
            qNode = dataService.getNode(projectName, nodeId);

        result = $q.all([qProject, qNode])
            .then(function(result) {
                var projectId = result[0],
                    node = result[1];
                contextService.setProject(projectName, projectId);
                contextService.setParentNode(node.segmentName, nodeId);
                return node;
            });
    } else {
        contextService.setProject('', '');
        contextService.setParentNode('');
    }

    return result;
}