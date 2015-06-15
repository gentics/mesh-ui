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

    /**
     * We need a way to let the widget know when the inner htmlField (content editable div)
     * is focused. We have no direct access to that information, so we need to set up
     * event listeners on the native "focus" and "blur" events and use them to update
     * the scope.
     *
     * @param scope
     * @param element
     */
    function htmlWidgetLinkFn(scope, element) {
        var htmlField = element[0].querySelector('.htmlField');
        scope.isFocused = false;

        htmlField.addEventListener('focus', function() {
            scope.$apply(function() {
                scope.isFocused = true;
            });
        });
        htmlField.addEventListener('blur', function() {
            scope.$apply(function() {
                scope.isFocused = false;
            });
        });

    }

    return {
        restrict: 'E',
        link: htmlWidgetLinkFn,
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
        templateUrl: 'projects/components/formBuilder/standardWidgets/selectWidget.html',
        scope: true
    };
}

/**
 * Input for node field types
 *
 * @param {ng.material.MDDialogService} $mdDialog
 * @returns {ng.IDirective} Directive definition object
 */
function nodeWidgetDirective($mdDialog) {

    function nodeWidgetController() {
        var vm = this;

        vm.showDialog = showDialog;

        function showDialog() {
            $mdDialog.show({
                templateUrl: 'projects/components/formBuilder/standardWidgets/nodeWidgetSelectDialog.html',
                controller: nodeSelectDialogController,
                controllerAs: 'vm'
            });
        }
    }

    /**
     *
     * @param {ng.material.MDDialogService} $mdDialog
     */
    function nodeSelectDialogController($mdDialog) {
        var vm = this;
        vm.select = select;
        vm.cancel = cancel;

        function select() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }

    return {
        restrict: 'E',
        controller: nodeWidgetController,
        controllerAs: 'vm',
        templateUrl: 'projects/components/formBuilder/standardWidgets/nodeWidget.html',
        scope: true
    };
}

/**
 * Input for list field types
 *
 * @returns {ng.IDirective} Directive definition object
 */
function listWidgetDirective(dataService, widgetHighlighterService) {

    function listWidgetLinkFn(scope) {
        var dragStartIndex;

        scope.listTypeField = angular.copy(scope.field);
        scope.listTypeField.type = scope.field.listType;

        scope.tracker = tracker;
        scope.addItem = addItem;
        scope.addWidget = addWidget;
        scope.removeItem = removeItem;
        scope.startDrag = startDrag;
        scope.endDrag = endDrag;

        /**
         * Tracking function to be used in the ng-repeat of the list items. Primitive types should
         * be tracked by $index, whereas microschemas need to be tracked by reference to the
         * object itself in order for sorting to work correctly.
         *
         * @param item
         * @param $id
         * @param $index
         * @returns {*}
         */
        function tracker(item, $id, $index) {
            return scope.listTypeField.type === 'microschema' ? $id(item) : $index;
        }

        /**
         * Add a new, empty microschema widget to the list.
         *
         * @param {string} microschemaName
         */
        function addWidget(microschemaName) {
            dataService.getMicroschema(microschemaName)
                .then(createEmptyMicroschemaObject)
                .then(function(newMicroschemaObject) {
                    scope.model[scope.path].push(newMicroschemaObject);
                    reHighlight();
                });
        }

        /**
         * Add a new primitive-type item to the list
         */
        function addItem() {
            var defaultValue = getDefaultValue(scope.listTypeField);
            scope.model[scope.path].push(defaultValue);
            reHighlight();
        }

        /**
         * Remove the item at index from the list
         * @param index
         */
        function removeItem(index) {
            scope.model[scope.path].splice(index, 1);
            reHighlight();
        }

        /**
         * Record the index of the item that is being dragged.
         * @param {number} index
         */
        function startDrag(index) {
            dragStartIndex = index;
        }

        /**
         * Remove the original dragged item from the list.
         * @param {Object} item
         * @param {number} dragEndIndex
         * @param {Array<Object>} list
         * @returns {*}
         */
        function endDrag(item, dragEndIndex, list) {
            var indexToSplice;

            if (dragEndIndex < dragStartIndex) {
                indexToSplice = dragStartIndex + 1;
            } else {
                indexToSplice = dragStartIndex;
            }

            list.splice(dragEndIndex, 0, item); // add the new position
            list.splice(indexToSplice, 1); // remove the old position
            scope.formBuilder.modified = true;
        }

        /**
         * Re-apply the widget highlighting, since the height of the list
         * would have changed after adding or removing an item. The timeout is there to allow the
         * new dimensions to take effect (i.e. the DOM to update) before re-calculating the highlight height.
         */
        function reHighlight() {
            setTimeout(function() {
                widgetHighlighterService.highlight();
            }, 500);
        }
    }

    /**
     * Create an empty microschema instance, populated with default values.
     * @param microschema
     * @returns {{microschema: {name: string, uuid: string}, fields: {}}}
     */
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

    /**
     * Returns the correct default value for a field definition object.
     *
     * @param fieldObject
     * @returns {*}
     */
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
        } else if (fieldObject.type === 'node') {
            defaultValue = {};
        }

        return defaultValue;
    }

    return {
        restrict: 'E',
        link: listWidgetLinkFn,
        templateUrl: 'projects/components/formBuilder/standardWidgets/listWidget.html',
        scope: true
    };
}
