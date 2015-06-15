angular.module('meshAdminUi.projects.formBuilder')
    .directive('microschemaFormBuilder', microschemaFormBuilderDirective);

/**
 * Directive that takes a microschema { name, uuid } and the fields object for it,
 * and either dispatches to a custom widget (if one exists) or builds the form
 * for it from the standard set of widgets.
 */
function microschemaFormBuilderDirective($injector, $compile, dataService) {

    var defaultTemplate = '<div class="microschema-container editor-widget">' +
                              '<label class="microschema-label">{{:: field.label || field.name  }}</label>' +
                              '<div ng-repeat="field in microschemaFields">' +
                              '<widget-proxy field="field" model="microschemaModel" path="field.name"></widget-proxy>' +
                          '</div></div>';

    function microschemaProxyLinkFn(scope, element) {
        var model = scope.model[scope.path];
        scope.microschemaName = model.microschema.name;


        dataService.getMicroschema(model.microschema.name).then(renderMicroschema);

        function renderMicroschema(microschema) {
            var template;

            if (customWidgetExistsFor(model.microschema.name)) {
               template = getCustomWidgetTemplate(model.microschema.name);
            } else {
                template = defaultTemplate;
            }

            scope.microschemaFields = microschema.fields;
            scope.microschemaModel = model.fields;

            var compiledDom = $compile(template)(scope);
            element.append(compiledDom);
        }
    }

    function getCustomWidgetTemplate(microschemaName) {
        var normalizedName =  microschemaName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
            template = '<' + normalizedName + '-widget></' + microschemaName + '-widget>';

        return '<div class="microschema-container editor-widget">' +
                    '<label class="microschema-label">{{:: field.label || field.name  }}</label>' +
                    template +
               '</div>';
    }

    function customWidgetExistsFor(microschemaName) {
        var directiveName = microschemaName + 'WidgetDirective';
        return $injector.has(directiveName);
    }

    return {
        restrict: 'EA',
        link: microschemaProxyLinkFn,
        scope: true
    };
}