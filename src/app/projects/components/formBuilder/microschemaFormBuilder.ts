module meshAdminUi {

    /**
     * Directive that takes a microschema { name, uuid } and the fields object for it,
     * and either dispatches to a custom control (if one exists) or builds the form
     * for it from the standard set of controls.
     */
    function microschemaFormBuilderDirective($injector, $compile, dataService) {

        const defaultTemplate = '<div>' +
            '<label class="micronode-label">{{:: fieldModel.label || fieldModel.name  }}</label>' +
            '<div class="micronode-container editor-control">' +
            '<div ng-repeat="field in micronodeFieldModels">' +
            '<control-proxy field-model="field"></control-proxy>' +
            '</div>' +
            '</div></div>';

        function microschemaProxyLinkFn(scope, element) {
            let fieldModel: INodeFieldModel = scope.fieldModel;
            let activeMicroschemaName = getActiveMicroschema(fieldModel);
            const renderMicroschema = (microschema: IMicroschema) => {
                let template = defaultTemplate;

                if (customControlExistsFor(microschema.name)) {
                    template = getCustomControlTemplate(microschema.name);
                } else {
                    template = defaultTemplate;
                }
                let nodeFields = fieldModel.value || createEmptyMicronodeField(microschema.name);

                scope.fields = {};
                scope.micronodeFieldModels = microschema.fields.map((field: ISchemaFieldDefinition) => {
                    let fm = fieldModel.createChild(nodeFields, field, fieldModel.path.concat('fields'));
                    scope.fields[field.name] = fm;
                    return fm;
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
         * Creates an empty field value for a micronode.
         */
        function createEmptyMicronodeField(microschemaName: string) {
            return {
                microschema: {
                    name: microschemaName
                },
                fields: {}
            };
        }

        /**
         * Creates a wrapper template for the custom control for the microschema.
         */
        function getCustomControlTemplate(microschemaName: string): string {
            var normalizedName = 'custom-control-' + microschemaName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
                template = `<${normalizedName}></${normalizedName}>`;

            return `<div class="microschema-container editor-control ${normalizedName}">` +
                '<label class="microschema-label">{{:: field.label || field.name  }}</label>' +
                template +
                '</div>';
        }

        /**
         * Returns true if the AngularJS $injector has a custom directive registered for the given
         * microschema name.
         */
        function customControlExistsFor(controlName: string): boolean {
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