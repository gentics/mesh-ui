module meshAdminUi {


    /**
     * This directive is used to dynamically populate the content editing form with the correct
     * type of input to match the schema fields. E.g. a field of type "string" should render as
     * a text input, whereas a field of type "date" should be a date picker, etc.
     *
     * Each of the standard components for the various field types can be found in the "standardWidgets" folder.
     * This proxy will delegate to the correct standard widget based on the "field" attribute that is passed in.
     */
    function widgetProxyDirective(widgetHighlighterService) {

        /**
         *
         */
        function widgetProxyLinkFn(scope, element) {
            let isTopElement = element.parent()[0].tagName === 'FORM';


            if (isTopElement) {
                scope.flexAttrs = getFlexAttributes(scope.fieldModel.type);
            }

            scope.mouseEnter = () => {
                if (isTopElement) {
                    widgetHighlighterService.highlight(element[0]);
                }
            };
            scope.mouseLeave = () => {
                if (isTopElement) {
                    widgetHighlighterService.hide();
                }
            };
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
                    //flexAttrs = 'flex="100"';
                    break;
                case 'number':
                case 'boolean':
                case 'date':
                    //flexAttrs = 'flex-sm="50" flex-gt-sm="33" flex-gt-lg="20"';
                    flexAttrs.sm = 50;
                    flexAttrs.gtSm = 33;
                    flexAttrs.gtLg = 20;
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
            link: widgetProxyLinkFn,
            replace: true,
            templateUrl: 'projects/components/formBuilder/widgetProxy.html',
            scope: {
                fieldModel: '='
            }
        };
    }

    /**
     * This service keeps a track of the currently-active (i.e. hovered or clicked) form widget. It allows
     * other components to register callbacks which will be invoked any time the highlight() or hide() methods
     * are called. This is intended for use by the widgetHighlighterDirective, which does the actual
     * DOM manipulation of the highlighter div.
     */
    export class WidgetHighlighterService {
        private currentElement: HTMLElement;
        private top;
        private left;
        private height;
        private opacity;
        private changeHandlers: Function[] = [];


        /**
         * Records the dimensions of the highlighted widget and sets opacity value to 1.
         */
        public highlight(element?: HTMLElement) {
            this.currentElement = element || this.currentElement;
            let parentNode = <HTMLElement>this.currentElement.parentNode;
            if (this.currentElement) {
                this.top = this.currentElement.offsetTop;
                this.left = parentNode.offsetLeft;
                this.height = this.currentElement.offsetHeight;
                this.opacity = 1;
            }
            this.invokeChangeHandlers();
        }

        /**
         * Sets the opacity value to 0.
         */
        public hide() {
            this.opacity = 0;
            this.invokeChangeHandlers();
        }

        /**
         * Allows registration of callbacks which will be invoked any time a widget is highlighted or hidden.
         *
         * @param {Function} fn
         */
        public registerChangeHandler(fn) {
            this.changeHandlers.push(fn);
        }

        /**
         * Invokes any callbacks previously registered with registerChangeHandler();
         */
        private invokeChangeHandlers() {
            this.changeHandlers.forEach(function (fn) {
                fn({
                    top: this.top,
                    left: this.left,
                    height: this.height,
                    opacity: this.opacity
                });
            });
        }
    }

    /**
     * This directive generates the colored highlight bar that appears to the left of the widget form.
     * @param {WidgetHighlighterService} widgetHighlighterService
     * @returns {{restrict: string, link: widgetHighlighterLinkFn, replace: boolean, template: string}}
     */
    function widgetHighlighterDirective(widgetHighlighterService) {

        var leftMargin = 8;

        function widgetHighlighterLinkFn(scope, element) {
            widgetHighlighterService.registerChangeHandler(function (pos) {
                element.css({
                    height: pos.height + 'px',
                    top: pos.top + 'px',
                    left: (pos.left - leftMargin) + 'px',
                    opacity: pos.opacity
                });
            });
        }

        return {
            restrict: 'E',
            link: widgetHighlighterLinkFn,
            replace: true,
            template: '<div class="widget-highlighter"></div>'
        };
    }

    angular.module('meshAdminUi.projects.formBuilder')
          .directive('widgetProxy', widgetProxyDirective)
          .directive('widgetHighlighter', widgetHighlighterDirective)
          .service('widgetHighlighterService', WidgetHighlighterService);

}