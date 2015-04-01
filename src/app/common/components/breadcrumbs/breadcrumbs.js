function breadcrumbsDirective() {

    function breadcrumbsLinkFn(scope) {
        // hard-coded values for now
    }

    return {
        restrict: 'E',
        templateUrl: 'common/components/breadcrumbs/breadcrumbs.html',
        link: breadcrumbsLinkFn
    };
}

angular.module('caiLunAdminUi.common')
    .directive('breadcrumbs', breadcrumbsDirective);