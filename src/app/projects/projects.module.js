angular.module('caiLunAdminUi.projects', [
    'caiLunAdminUi.common'
])
    .run(projectsRunBlock);

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