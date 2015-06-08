angular.module('meshAdminUi.projects.formBuilder')
    .directive('widgetProxy', widgetProxyDirective);

/**
 * using the pattern outlined here http://stackoverflow.com/a/20686132/772859
 * to dynamically include the correct directive for the field type.
 */
function widgetProxyDirective($injector, $compile, $templateCache) {

    function widgetProxyLinkFn(scope, element) {
        if (scope.field.type !== 'microschema') {
            var directive = $injector.get('mh' + capitalize(scope.field.type) + 'WidgetDirective')[0];
            var template = directive.template || $templateCache.get(directive.templateUrl);
            var compiledDom = $compile(template)(scope.$parent);
            element.replaceWith(compiledDom);
        } else {
            // Pass microschema name through the custom widgets to check for a match.
            var a = 1;
        }
    }

    /**
     * Capitalize the first letter of the string.
     * @param {string} string
     * @returns {string}
     */
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    return {
        restrict: 'EA',
        link: widgetProxyLinkFn,
        scope: {
            field: '='
        }
    };
}