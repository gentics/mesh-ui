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

            .state('admin.groups', {
                abstract: true
            })
            .state('admin.groups.list', {
                url: '/groups',
                views: {
                    'main@': {
                        templateUrl: 'admin/groups/list/groupList.html',
                        controller: 'GroupListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.groups.detail', {
                url: '/groups/:uuid',
                views: {
                    'main@': {
                        templateUrl: 'admin/groups/detail/groupDetail.html',
                        controller: 'GroupDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.groups.create', {
                url: '/groups/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/groups/detail/groupDetail.html',
                        controller: 'GroupDetailController',
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
                abstract: true
            })
            .state('admin.schemas.list', {
                url: '/schemas',
                views: {
                    'main@': {
                        templateUrl: 'admin/schemas/list/schemaList.html',
                        controller: 'SchemaListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.schemas.detail', {
                url: '/schemas/:uuid',
                views: {
                    'main@': {
                        templateUrl: 'admin/schemas/detail/schemaDetail.html',
                        controller: 'SchemaDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.schemas.create', {
                url: '/schemas/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/schemas/detail/schemaDetail.html',
                        controller: 'SchemaDetailController',
                        controllerAs: 'vm'
                    }
                }
            })

            .state('admin.microschemas', {
                abstract: true
            })
            .state('admin.microschemas.list', {
                url: '/microschemas',
                views: {
                    'main@': {
                        templateUrl: 'admin/microschemas/list/microschemaList.html',
                        controller: 'MicroschemaListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.microschemas.detail', {
                url: '/microschemas/:uuid',
                views: {
                    'main@': {
                        templateUrl: 'admin/microschemas/detail/microschemaDetail.html',
                        controller: 'MicroschemaDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.microschemas.create', {
                url: '/microschemas/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/microschemas/detail/microschemaDetail.html',
                        controller: 'MicroschemaDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            
            .state('admin.tags', {
                abstract: true
            })
            .state('admin.tags.list', {
                url: '/tags',
                views: {
                    'main@': {
                        templateUrl: 'admin/tags/list/tagList.html',
                        controller: 'TagListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.tags.detail', {
                url: '/tags/:uuid',
                views: {
                    'main@': {
                        templateUrl: 'admin/tags/detail/tagDetail.html',
                        controller: 'TagDetailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('admin.tags.create', {
                url: '/tags/new',
                views: {
                    'main@': {
                        templateUrl: 'admin/tags/detail/tagDetail.html',
                        controller: 'TagDetailController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
}