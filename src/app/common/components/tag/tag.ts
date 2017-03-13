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
                    const tagFamilyName = typeof scope.source.tagFamily === 'string' ? scope.source.tagFamily : scope.source.tagFamily.name;
                    return mu.stringToColor(tagFamilyName);
                };
                scope.close = (event) => {
                    scope.onClose({ $event: event });
                };
            }
        };
    }

    angular.module('meshAdminUi.common')
        .directive('tag', tagDirective);
}