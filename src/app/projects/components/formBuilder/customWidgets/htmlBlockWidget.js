angular.module('meshAdminUi.projects.formBuilder')
    .directive('htmlBlockWidget', htmlBlockWidgetDirective);

/**
 * Custom input widget for geolocation microschema. Just a demo.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function htmlBlockWidgetDirective() {

    function htmlBlockWidgetLinkFn(scope) {
        scope.model = scope.microschemaModel;
        scope.path = scope.microschemaFields[0].name;
    }

    return {
        restrict: 'E',
        replace: true,
        link: htmlBlockWidgetLinkFn,
        template: '<div class="html-container editor-widget">' +
                    '<mh-html-widget></mh-html-widget>' +
                  '</div>',
        scope: true
    };
}