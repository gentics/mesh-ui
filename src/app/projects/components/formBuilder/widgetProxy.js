angular.module('meshAdminUi.projects.formBuilder')
    .directive('widgetProxy', widgetProxyDirective)
    .directive('widgetHighlighter', widgetHighlighterDirective)
    .factory('widgetHighlighterService', widgetHighlighterService);

/**
 * This directive is used to dynamically populate the content editing form with the correct
 * type of input to match the schema fields. E.g. a field of type "string" should render as
 * a text input, whereas a field of type "date" should be a date picker, etc.
 *
 * Each of the standard components for the various field types can be found in the "standardWidgets" folder.
 * This proxy will delegate to the correct standard widget based on the "field" attribute that is passed in.
 *
 * @param {ng.ICompileService} $compile
 * @param {widgetHighlighterService} widgetHighlighterService
 */
function widgetProxyDirective($compile, widgetHighlighterService) {

    /**
     *
     * @param {Object} scope
     * @param element
     * @param attrs
     * @param {formBuilderController} formBuilderController
     */
    function widgetProxyLinkFn(scope, element, attrs, formBuilderController) {
        var template,
            flexAttrs = 'flex',
            isTopElement = element.parent()[0].tagName === 'FORM';

        scope.formBuilder = formBuilderController;

        if (isTopElement) {
            flexAttrs = getFlexAttributes(scope.field.type);
        }

        if (scope.field.type === 'microschema') {
            // Pass microschema name through the custom widgets to check for a match.
            template = '<microschema-form-builder ' + flexAttrs + ' class="widget-container" ></microschema-form-builder>';
        } else {
            var directiveName = 'mh-' + scope.field.type + '-widget';
            template = '<' + directiveName + ' ' + flexAttrs + ' class="widget-container" ></' + directiveName + '>';
        }

        var compiledDom = $compile(template)(scope);
        element.replaceWith(compiledDom);

        if (isTopElement) {
            compiledDom.on('mouseenter', function () {
                widgetHighlighterService.highlight(compiledDom[0]);
            });
            compiledDom.on('mouseleave', function () {
                widgetHighlighterService.hide();
            });
        }

    }

    /**
     * Different field types have different flex attributes to set how wide they will appear in the form.
     * @param {string} type
     * @returns {*}
     */
    function getFlexAttributes(type) {
        var flexAttrs;

        switch (type) {
            case 'html':
            case 'list':
            case 'microschema':
                flexAttrs = 'flex="100"';
                break;
            case 'number':
            case 'boolean':
            case 'date':
                flexAttrs = 'flex-sm="50" flex-gt-sm="33" flex-gt-lg="20"';
                break;
            case 'string':
                flexAttrs = 'flex="100"';
                break;
            default:
                flexAttrs = '';
        }

        return flexAttrs;
    }

    return {
        restrict: 'EA',
        require: '^formBuilder',
        link: widgetProxyLinkFn,
        scope: {
            model: '=',
            path: '=',
            field: '='
        }
    };
}

/**
 * This service keeps a track of the currently-active (i.e. hovered or clicked) form widget. It allows
 * other components to register callbacks which will be invoked any time the highlight() or hide() methods
 * are called. This is intended for use by the widgetHighlighterDirective, which does the actual
 * DOM manipulation of the highlighter div.
 *
 * @returns {{highlight: highlight, hide: hide, registerChangeHandler: registerChangeHandler}}
 */
function widgetHighlighterService() {
    var currentElement,
        top,
        left,
        height,
        opacity,
        changeHandlers = [];

    return {
        highlight: highlight,
        hide: hide,
        registerChangeHandler: registerChangeHandler
    };

    /**
     * Records the dimensions of the highlighted widget and sets opacity value to 1.
     *
     * @param {HTMLElement} element
     */
    function highlight(element) {
        currentElement = element || currentElement;
        if (currentElement) {
            top = currentElement.offsetTop;
            left = currentElement.parentNode.offsetLeft;
            height = currentElement.offsetHeight;
            opacity = 1;
        }
        invokeChangeHandlers();
    }

    /**
     * Sets the opacity value to 0.
     */
    function hide() {
        opacity = 0;
        invokeChangeHandlers();
    }

    /**
     * Allows registration of callbacks which will be invoked any time a widget is highlighted or hidden.
     *
     * @param {Function} fn
     */
    function registerChangeHandler(fn) {
        changeHandlers.push(fn);
    }

    /**
     * Invokes any callbacks previously registered with registerChangeHandler();
     */
    function invokeChangeHandlers() {
        changeHandlers.forEach(function(fn) {
            fn({
                top: top,
                left: left,
                height: height,
                opacity: opacity
            });
        });
    }
}

/**
 * This directive generates the colored highlight bar that appears to the left of the widget form.
 * @param {widgetHighlighterService} widgetHighlighterService
 * @returns {{restrict: string, link: widgetHighlighterLinkFn, replace: boolean, template: string}}
 */
function widgetHighlighterDirective(widgetHighlighterService) {

    var leftMargin = 8;

    function widgetHighlighterLinkFn(scope, element) {
        widgetHighlighterService.registerChangeHandler(function(pos) {
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