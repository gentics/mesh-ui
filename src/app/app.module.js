/**
 * Root module for the app.
 */
angular.module('meshAdminUi', [

    'meshAdminUi.templates',

    // app sub-modules
    'meshAdminUi.common',
    'meshAdminUi.login',
    'meshAdminUi.projects',
    'meshAdminUi.admin',

    // third-party modules
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'angularUtils.directives.dirPagination',
    'angular-loading-bar'
]);