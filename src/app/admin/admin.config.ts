module meshAdminUi {

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
                abstract: true
            })
            .state('admin.users.list', {
                url: '/users',
                views: {
                    'main@': {
                        templateUrl: 'admin/users/list/userList.html',
                        controller: 'UserListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.users.detail', {
                url: '/users/:uuid',
                views: {
                    'main@': {
                        templateUrl: 'admin/users/detail/userDetail.html',
                        controller: 'UserDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.users.create', {
                url: '/users/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/users/detail/userDetail.html',
                        controller: 'UserDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.roles', {
                abstract: true
            })
            .state('admin.roles.list', {
                url: '/roles',
                views: {
                    'main@': {
                        templateUrl: 'admin/roles/list/roleList.html',
                        controller: 'RoleListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.roles.detail', {
                url: '/roles/:uuid',
                views: {
                    'main@': {
                        templateUrl: 'admin/roles/detail/roleDetail.html',
                        controller: 'RoleDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.roles.create', {
                url: '/roles/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/roles/detail/roleDetail.html',
                        controller: 'RoleDetailController',
                        controllerAs: 'vm'
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
                        templateUrl: 'admin/projects/detail/projectDetail.html',
                        controller: 'ProjectDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.projects.create', {
                url: '/projects/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/projects/detail/projectDetail.html',
                        controller: 'ProjectDetailController',
                        controllerAs: 'vm'
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
}