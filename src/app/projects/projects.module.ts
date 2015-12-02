// TODO: rename the whole "projects" section to something like "editor" to reflect the logical separation between explorer/admin areas
angular.module('meshAdminUi.projects', [
    'meshAdminUi.projects.formBuilder',
    'meshAdminUi.projects.imageEditor',
    'meshAdminUi.common',
    'ui.router'
]);