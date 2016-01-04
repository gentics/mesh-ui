module meshAdminUi {


    /**
     * This directive is used to dynamically populate the content editing form with the correct
     * type of input to match the schema fields. E.g. a field of type "string" should render as
     * a text input, whereas a field of type "date" should be a date picker, etc.
     *
     * Each of the standard components for the various field types can be found in the "standardControls" folder.
     * This proxy will delegate to the correct standard control based on the "field" attribute that is passed in.
     */
    function controlProxyDirective() {

        function controlProxyLinkFn(scope, element: JQuery) {
            let isTopElement = element.parent()[0].tagName === 'FORM';

            if (isTopElement) {
                scope.flexAttrs = getFlexAttributes(scope.fieldModel.type);
            }
        }

        /**
         * Different field types have different flex attributes to set how wide they will appear in the form.
         * @param {string} type
         * @returns {*}
         */
        function getFlexAttributes(type) {
            var flexAttrs = {
                sm: 100,
                gtSm: 100,
                gtLg: 100
            };

            switch (type) {
                case 'html':
                case 'list':
                case 'microschema':
                case 'date':
                    //flexAttrs = 'flex="100"';
                    break;
                case 'number':
                case 'boolean':
                    //flexAttrs = 'flex-sm="50" flex-gt-sm="33" flex-gt-lg="20"';
                    flexAttrs.sm = 50;
                    flexAttrs.gtSm = 33;
                    flexAttrs.gtLg = 25;
                    break;
                case 'string':
                    //flexAttrs = 'flex="100"';
                    break;
                default:
                //flexAttrs = '';
            }

            return flexAttrs;
        }

        return {
            restrict: 'EA',
            link: controlProxyLinkFn,
            replace: true,
            templateUrl: 'projects/components/formBuilder/controlProxy.html',
            scope: {
                fieldModel: '='
            }
        };
    }

    angular.module('meshAdminUi.projects.formBuilder')
          .directive('controlProxy', controlProxyDirective);

}