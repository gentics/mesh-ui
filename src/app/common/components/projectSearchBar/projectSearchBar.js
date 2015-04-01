function projectSearchBarDirective() {

    function projectSearchBarLinkFn(scope) {
        // hard-coded values for now
        // TODO: replace with call to a backend service to get this data

        scope.projects = ['Project One', 'Project Two'];
        scope.currentContext = "";
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/projectSearchBar/projectSearchBar.html',
        link: projectSearchBarLinkFn
    };
}

angular.module('caiLunAdminUi.common')
    .directive('projectSearchBar', projectSearchBarDirective);