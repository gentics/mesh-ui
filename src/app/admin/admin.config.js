angular.module('meshAdminUi.admin')
    .config(routesConfig);

function routesConfig($stateProvider) {
    $stateProvider
        .state('admin', {
            url: '/admin',
            abstract: true,
            data: {
                isAdminState: true
            }
        })
        .state('admin.users', {
            url: '/users',
            views: {
                'main@': {
                    templateUrl: 'admin/users/users.html'
                }
            }
        })
        .state('admin.projects', {
           abstract: true
        })
        .state('admin.projects.list', {
            url: '/projects',
            views: {
                'main@': {
                    templateUrl: 'admin/projects/list/projectList.html',
                    controller: 'ProjectListController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('admin.projects.detail', {
            url: '/projects/:uuid',
            views: {
                'main@': {
                    templateUrl: 'admin/projects/detail/projectDetail.html'
                }
            }
        })
        .state('admin.schemas', {
            url: '/schemas',
            views: {
                'main@': {
                    templateUrl: 'admin/schemas/schemas.html'
                }
            }
        });
}