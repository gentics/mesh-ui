angular.module('meshAdminUi.projects.formBuilder')
    .directive('widgetProxy', widgetProxyDirective)
    .directive('widgetHighlighter', widgetHighlighterDirective)
    .factory('widgetHighlighterService', widgetHighlighterService);

/**
 * using the pattern outlined here http://stackoverflow.com/a/20686132/772859
 * to dynamically include the correct directive for the field type.
 */
function widgetProxyDirective($compile, widgetHighlighterService) {

    function widgetProxyLinkFn(scope, element, attrs, formBuilderController) {
        var template,
            flexAttrs,
            parent,
            isTopElement;

        scope.formBuilder = formBuilderController;
        parent = element.parent();
        isTopElement = parent[0].tagName === 'FORM';

        if (isTopElement) {
            flexAttrs = getFlexAttributes(scope.field.type);
        } else {
            flexAttrs = 'flex';
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

function widgetHighlighterService() {
    var top, left, height, opacity, changeHandlers = [];

    function highlight(element) {
        top = element.offsetTop;
        left = element.parentNode.offsetLeft;
        height = element.offsetHeight;
        opacity = 1;
        invokeChangeHandlers();
    }

    function hide() {
        opacity = 0;
        invokeChangeHandlers();
    }

    function registerChangeHandler(fn) {
        changeHandlers.push(fn);
    }

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

    return {
        highlight: highlight,
        hide: hide,
        registerChangeHandler: registerChangeHandler
    };
}

function widgetHighlighterDirective(widgetHighlighterService) {

    function widgetHighlighterLinkFn(scope, element) {
        widgetHighlighterService.registerChangeHandler(function(pos) {
            element.css({
                height: pos.height + 'px',
                top: pos.top + 'px',
                left: (pos.left - 8) + 'px',
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