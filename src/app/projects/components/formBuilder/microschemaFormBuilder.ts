module meshAdminUi {

    /**
     * Directive that takes a microschema { name, uuid } and the fields object for it,
     * and either dispatches to a custom widget (if one exists) or builds the form
     * for it from the standard set of widgets.
     */
    function microschemaFormBuilderDirective($injector, $compile, dataService, formBuilderService) {

        const defaultTemplate = '<div>' +
            '<label class="micronode-label">{{:: fieldModel.label || fieldModel.name  }}</label>' +
            '<div class="micronode-container editor-widget">' +
            '<div ng-repeat="field in micronodeFieldModels">' +
            '<widget-proxy field-model="field"></widget-proxy>' +
            '</div>' +
            '</div></div>';

        function microschemaProxyLinkFn(scope, element) {
            let fieldModel: INodeFieldModel = scope.fieldModel;
            let activeMicroschemaName = getActiveMicroschema(fieldModel);
            const renderMicroschema = (microschema: IMicroschema) => {
                var template = defaultTemplate;

                if (customWidgetExistsFor(fieldModel.value.microschema.name)) {
                    template = getCustomWidgetTemplate(fieldModel.value.microschema.name);
                } else {
                    template = defaultTemplate;
                }
                let nodeFields = fieldModel.value || createEmptyMicronodeField(microschema.name);

                scope.micronodeFieldModels = microschema.fields.map((field: ISchemaFieldDefinition) => {
                    return fieldModel.createChild(nodeFields, field, fieldModel.path.concat('fields'));
                });

                var compiledDom = $compile(template)(scope);
                element.append(compiledDom);
            };

            scope.microschemaName = activeMicroschemaName;
            dataService.getMicroschemaByName(activeMicroschemaName).then(renderMicroschema);
        }

        /**
         * Returns the currently-used microschema when a value is set. If no value is set but only one
         * type is allowed, return that.
         */
        function getActiveMicroschema(fieldModel: INodeFieldModel): string {
            if (fieldModel.value) {
                return fieldModel.value.microschema.name;
            }
            return fieldModel.allow[0];
        }

        /**
         *
         */
        function createEmptyMicronodeField(microschemaName: string) {
            return {
                microschema: {
                    name: microschemaName
                },
                fields: {}
            };
        }

        function getCustomWidgetTemplate(microschemaName) {
            var normalizedName = 'custom-control-' + microschemaName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
                template = `<${normalizedName}></${normalizedName}>`;

            return '<div class="microschema-container editor-widget">' +
                '<label class="microschema-label">{{:: field.label || field.name  }}</label>' +
                template +
                '</div>';
        }

        function customWidgetExistsFor(controlName) {
            const capitalizeFirst = (str) => {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            var directiveName = 'customControl' + capitalizeFirst(controlName) + 'Directive';
            return $injector.has(directiveName);
        }

        return {
            restrict: 'E',
            link: microschemaProxyLinkFn,
            scope: {
                fieldModel: '='
            }
        };
    }

    angular.module('meshAdminUi.projects.formBuilder')
        .directive('microschemaFormBuilder', microschemaFormBuilderDirective);

}