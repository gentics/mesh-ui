angular.module('meshAdminUi.projects.formBuilder')
    .directive('microschemaFormBuilder', microschemaFormBuilderDirective);

/**
 * Directive that takes a microschema { name, uui } and the fields object for it,
 * and either dispatches to a custom widget (if one exists) or builds the form
 * for it from the standard set of widgets.
 */
function microschemaFormBuilderDirective($compile, dataService) {

    var defaultTemplate = '<div class="microschema-container">{{:: field.name }} (microschema: {{:: microschemaName }})<div ng-repeat="field in vm.fields">' +
                            '<widget-proxy field="field"></widget-proxy>' +
                          '</div></div>';

    function microschemaProxyLinkFn(scope, element) {
        var model = scope.$parent.vm.model[scope.field.name];
        scope.microschemaName = model.microschema.name;

        dataService.getMicroschema(model.microschema.name)
            .then(function(data) {
                scope.vm = {
                    model: model.fields,
                    fields: data.fields
                };

                var compiledDom = $compile(defaultTemplate)(scope);
                element.replaceWith(compiledDom);
            });
    }

    return {
        restrict: 'EA',
        link: microschemaProxyLinkFn
    };
}