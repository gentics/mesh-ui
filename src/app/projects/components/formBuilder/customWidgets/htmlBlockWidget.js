angular.module('meshAdminUi.projects.formBuilder')
    .directive('htmlBlockWidget', htmlBlockWidgetDirective);

/**
 * Custom input widget for geolocation microschema. Just a demo.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function htmlBlockWidgetDirective() {

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="html-container editor-widget">' +
                    '<div medium-editor class="htmlField" ng-model="microschemaModel.content" ng-change="formBuilder.modified = true" ng-readonly="!formBuilder.canUpdate()"></div>' +
                  '</div>',
        scope: true
    };
}