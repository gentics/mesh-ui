angular.module('meshAdminUi.projects.formBuilder')
    .directive('microschemaFormBuilder', microschemaFormBuilderDirective);

/**
 * Directive that takes a microschema { name, uuid } and the fields object for it,
 * and either dispatches to a custom widget (if one exists) or builds the form
 * for it from the standard set of widgets.
 */
function microschemaFormBuilderDirective($injector, $templateCache, $compile, dataService) {

    var defaultTemplate = '<div class="microschema-container">{{:: field.name }} (microschema: {{:: microschemaName }})<div ng-repeat="field in vm.fields">' +
        '<widget-proxy field="field"></widget-proxy>' +
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

            scope.vm = {
                model: model.fields,
                fields: microschema.fields,
                canUpdate: scope.$parent.formBuilder.canUpdate
            };

            var compiledDom = $compile(template)(scope);
            element.replaceWith(compiledDom);
        }
    }

    function getCustomWidgetTemplate(microschemaName) {
        var template = '<' + microschemaName + '-widget></' + microschemaName + '-widget>';
        /*var directive = $injector.get(microschemaName + 'WidgetDirective')[0];
        template =  directive.template || $templateCache.get(directive.templateUrl);*/
        return '<div class="microschema-container">{{:: field.name }} (microschema: {{:: microschemaName }})' + template + '</div>';
    }

    function customWidgetExistsFor(microschemaName) {
        var directiveName = microschemaName + 'WidgetDirective';
        return $injector.has(directiveName);
    }



    return {
        restrict: 'EA',
        link: microschemaProxyLinkFn
    };
}