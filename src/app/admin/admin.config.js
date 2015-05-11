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
            url: '/projects',
            views: {
                'main@': {
                    templateUrl: 'admin/projects/projects.html'
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