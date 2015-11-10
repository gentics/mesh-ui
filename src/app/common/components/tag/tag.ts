module meshAdminUi {


    function tagDirective(mu: MeshUtils) {
        return {
            restrict: 'E',
            templateUrl: 'common/components/tag/tag.html',
            scope: {
                source: '=',
                showClose: '=',
                onClose: '&'
            },
            link: (scope) => {
                scope.tagColor = () => {
                    return mu.stringToColor(scope.source.tagFamily.name);
                }
            }
        };
    }

    angular.module('meshAdminUi.common')
        .directive('tag', tagDirective);
}