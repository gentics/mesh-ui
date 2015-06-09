angular.module('meshAdminUi.projects.formBuilder')
    .directive('mhStringWidget', stringWidgetDirective)
    .directive('mhHtmlWidget', htmlWidgetDirective)
    .directive('mhNumberWidget', numberWidgetDirective)
    .directive('mhBooleanWidget', booleanWidgetDirective)
    .directive('mhDateWidget', dateWidgetDirective)
    .directive('mhSelectWidget', selectWidgetDirective)
    .directive('mhNodeWidget', nodeWidgetDirective)
    .directive('mhListWidget', listWidgetDirective);

/**
 * Input for string field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function stringWidgetDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/standardWidgets/stringWidget.html',
        scope: true
    };
}

/**
 * Input for html field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function htmlWidgetDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/standardWidgets/htmlWidget.html',
        scope: true
    };
}

/**
 * Input for number field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function numberWidgetDirective() {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/standardWidgets/numberWidget.html',
        scope: true
    };
}

/**
 * Input for number field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function dateWidgetDirective() {

    /**
     * Since the input[type="date"] directive requires a Date object, we need to convert the
     * timestamp into a Date object and bind to that.
     * @param {ng.IScope} scope
     */
    function dateWidgetLinkFn(scope) {
        if (0 < scope.model[scope.path]) {
            scope.date = new Date(scope.model[scope.path] * 1000);
        } else {
            scope.date = new Date();
        }

        scope.$watch('date', function(newVal) {
            if (newVal) {
                scope.model[scope.path] = newVal.getTime() / 1000;
            }
        });
    }

    return {
        restrict: 'E',
        replace: true,
        link: dateWidgetLinkFn,
        templateUrl: 'projects/components/formBuilder/standardWidgets/dateWidget.html',
        scope: true
    };
}

/**
 * Input for boolean field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function booleanWidgetDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/standardWidgets/booleanWidget.html',
        scope: true
    };
}

/**
 * Input for select field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function selectWidgetDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/standardWidgets/selectWidget.html',
        scope: true
    };
}

/**
 * Input for node field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function nodeWidgetDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/standardWidgets/nodeWidget.html',
        scope: true
    };
}

/**
 * Input for list field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function listWidgetDirective(dataService) {

    function listWidgetLinkFn(scope) {
        scope.listTypeField = angular.copy(scope.field);
        scope.listTypeField.type = scope.field.listType;

        scope.addItem = function() {
            scope.model[scope.path].push(null);
        };

        scope.addWidget = function(microschemaName) {
            dataService.getMicroschema(microschemaName)
                .then(createEmptyMicroschemaObject)
                .then(function(newMicroschemaObject) {
                    scope.model[scope.path].push(newMicroschemaObject);
                });
        };

        scope.removeItem = function(index) {
            scope.model[scope.path].splice(index, 1);
        };
    }

    function createEmptyMicroschemaObject(microschema) {
        var newMicroschemaObject = {
            "microschema": {
                "name": microschema.name,
                "uuid": microschema.uuid
            },
            "fields": {}
        };

        microschema.fields.forEach(function(fieldObject) {
            newMicroschemaObject.fields[fieldObject.name] = getDefaultValue(fieldObject);
        });

        return newMicroschemaObject;
    }

    function getDefaultValue(fieldObject) {
        var defaultValue = null;

        if (typeof fieldObject.defaultValue !== 'undefined') {
            defaultValue = fieldObject.defaultValue;

        } else if (fieldObject.type === 'number') {

            if (typeof fieldObject.min !== 'undefined') {
                if (typeof fieldObject.max !== 'undefined') {
                    defaultValue = Math.round((fieldObject.min + fieldObject.max) / 2);
                } else {
                    defaultValue = fieldObject.min;
                }
            } else {
                defaultValue = 0;
            }
        } else if (fieldObject.type === 'string' || fieldObject.type === 'html') {
            defaultValue = '';
        } else if (fieldObject.type === 'boolean') {
            defaultValue = false;
        } else if (fieldObject.type === 'date') {
            defaultValue = Math.floor(Date.now() / 1000);
        } else if (fieldObject.type === 'select') {
            defaultValue = fieldObject.options[0] || "";
        } else if (fieldObject.type === 'list') {
            defaultValue = [];
        }

        return defaultValue;
    }

    return {
        restrict: 'E',
        replace: true,
        link: listWidgetLinkFn,
        templateUrl: 'projects/components/formBuilder/standardWidgets/listWidget.html',
        scope: true
    };
}
