/**
 * Root module for the app.
 */
angular.module('caiLunAdminUi', [

    // app sub-modules
    'caiLunAdminUi.common',
    'caiLunAdminUi.login',
    'caiLunAdminUi.projects',

    // third-party modules
    'ui.router',
    'ngMaterial',
    'ngCookies',
    'angularUtils.directives.dirPagination'
]);