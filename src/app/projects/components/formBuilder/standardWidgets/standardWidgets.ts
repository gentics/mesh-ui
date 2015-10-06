module meshAdminUi {

    declare var Aloha: any;

    class StandardWidgetController {

        public fieldModel: INodeFieldModel;
        public value: any;

        constructor() {
            console.log('instantiating widget controller');
            this.value = angular.copy(this.fieldModel.value);
        }
    }

    function makeStandardWidgetDDO(type, controller?) {

        console.log('creating widget of type', type);
        controller = controller || StandardWidgetController;
        return {
            restrict: 'E',
            templateUrl: `projects/components/formBuilder/standardWidgets/${type}Widget.html`,
            controller: controller,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                fieldModel: '='
            }
        };
    }

    /**
     * Input for string field types
     *
     * @returns {ng.IDirective} Directive definition object
     */
    function stringWidgetDirective() {
        return makeStandardWidgetDDO('string');
    }

    /**
     * Input for html field types
     *
     * @returns {ng.IDirective} Directive definition object
     */
    function htmlWidgetDirective() {

        var activeAlohaPlugins = [
            'common/ui',
            'common/format',
            'common/table',
            'common/highlighteditables',
            'common/link'
        ];
        // an array of functions that will be called when Aloha has loaded.
        var callbacks = [];

        function htmlWidgetCompileFn() {
            if (!window['Aloha']) {
                // configure Aloha editor
                window['Aloha'] = {};
                window['Aloha'].settings = {
                    "sidebar": {
                        "disabled": true
                    },
                    "plugins": {
                        "formatlesspaste": {
                            "config": {
                                "strippedElements": ["a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "ruby", "rt", "rp", "bdi", "bdo", "ins", "del"],
                                "button": "False",
                                "formatlessPasteOption": "1"
                            }
                        },
                        "block": {
                            "dragdrop": "1",
                            "dropzones": [".dropzone > div"],
                            "config": {
                                "toggleDragdropGlobal": "true"
                            }
                        },
                        "image": {
                            "minHeight": "5",
                            "minWidth": "5",
                            "fixedAspectRatio": "true",
                            "maxHeight": "786",
                            "maxWidth": "1024"
                        },
                        "list": {
                            "templates": {
                                "ul": {
                                    "classes": []
                                },
                                "dl": {
                                    "classes": []
                                },
                                "ol": {
                                    "classes": []
                                }
                            }
                        }
                    },
                    "i18n": {
                        "current": "de"
                    },
                    "locale": "de",
                    "logLevels": {
                        "error": true
                    },
                    "readonly": false,
                    "toolbar": {
                        "tabs": [{
                            "label": "tab.format.label"
                        }, {
                            "label": "tab.insert.label",
                            "components": [["gcnArena"]]
                        }, {
                            "label": "tab.link.label",
                            "components": ["editLink", "removeLink", "linkBrowser", "gcnLinkBrowser", "gcnFileUpload"]
                        }]
                    },
                    "bundles": {
                        "custom": "/custom"
                    },
                    "contentHandler": {
                        "insertHtml": ["gcn-tagcopy", "word", "generic", "block", "formatless"],
                        "getContents": ["blockelement", "basic"],
                        "initEditable": ["blockelement"]
                    },
                    "sanitizeCharacters": {
                        "ï": "i",
                        "î": "i",
                        " ": "_",
                        "ë": "e",
                        "ê": "e",
                        "é": "e",
                        "è": "e",
                        "Ä": "Ae",
                        "ä": "ae",
                        "â": "a",
                        "à": "a",
                        "Ü": "Ue",
                        "ü": "ue",
                        "ß": "ss",
                        "û": "u",
                        "ù": "u",
                        "ö": "oe",
                        "Ö": "Oe",
                        "ô": "o"
                    }
                };

                loadScript('assets/vendor/aloha-editor/lib/aloha-full.min.js', initAloha);
            }

            /**
             * @param scope
             * @param element
             */
            return function htmlWidgetLinkFn(scope, element) {

                var htmlField = element[0].querySelector('.htmlField');

                if (Aloha.ready) {
                    registerBindings();
                } else {
                    callbacks.push(registerBindings);
                }

                /**
                 * We need a way to let the widget know when the inner htmlField (content editable div)
                 * is focused. We have no direct access to that information, so we need to set up
                 * event listeners on the native "focus" and "blur" events and use them to update
                 * the scope.
                 * @type {HTMLElement}
                 */
                scope.isFocused = false;

                // initialize the content.
                syncView();

                function registerBindings() {
                    var $ = Aloha.jQuery;

                    /**
                     * View -> Model data binding
                     */
                    Aloha.bind('aloha-smart-content-changed', function (jQueryEvent, alohaEditable) {
                        if (eventTargetIsThisElement(alohaEditable)) {
                            scope.$apply(function () {
                                scope.model[scope.path] = alohaEditable.editable.getContents();
                                scope.formBuilder.modified = true;
                            });
                        }
                    });

                    /**
                     * Model -> data binding
                     */
                    scope.$watch('model[path]', function (val) {
                        if (typeof val !== 'undefined') {
                            syncView();
                        }
                    });

                    Aloha.bind('aloha-editable-activated', function (jQueryEvent, alohaEditable) {
                        if (eventTargetIsThisElement(alohaEditable)) {
                            scope.$apply(function () {
                                scope.isFocused = true;
                            });
                        }
                    });

                    Aloha.bind('aloha-editable-deactivated', function (jQueryEvent, alohaEditable) {
                        if (eventTargetIsThisElement(alohaEditable)) {
                            scope.$apply(function () {
                                scope.isFocused = false;
                            });
                        }
                    });

                    Aloha.ready(function () {
                        $('.htmlField').aloha();
                    });
                }

                function eventTargetIsThisElement(alohaEditable) {
                    return htmlField.getAttribute('id') === alohaEditable.editable.getId();
                }

                function syncView() {
                    htmlField.innerHTML = scope.model[scope.path];
                }
            };
        }

        /**
         * Create the Aloha editable areas and run any callbacks that have
         * been registered.
         */
        function initAloha() {
            callbacks.forEach(function (fn) {
                fn();
            });
        }

        /**
         * this function will work cross-browser for loading scripts asynchronously
         * Based on http://stackoverflow.com/a/7719185/772859
         */
        function loadScript(src, callback) {
            var s,
                r,
                t;
            r = false;
            s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = src;
            s.setAttribute('data-aloha-plugins', activeAlohaPlugins.join(','));
            s.onload = s.onreadystatechange = function () {
                //console.log( this.readyState ); //uncomment this line to see which ready states are called.
                if (!r && (!this.readyState || this.readyState == 'complete')) {
                    r = true;
                    callback();
                }
            };
            t = document.getElementsByTagName('script')[0];
            t.parentNode.insertBefore(s, t);
        }

        return {
            restrict: 'E',
            compile: htmlWidgetCompileFn,
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
        return makeStandardWidgetDDO('number');
    }


    /**
     * Since the input[type="date"] directive requires a Date object, we need to convert the
     * timestamp into a Date object and bind to that.
     */
    class DateWidgetController extends StandardWidgetController {

        constructor($scope) {
            super();

            if (0 < this.fieldModel.value) {
                this.value= new Date(this.fieldModel.value * 1000);
            } else {
                this.value = new Date();
            }

            $scope.$watch(() => this.value, newVal => {
                if (newVal) {
                    this.fieldModel.update(newVal.getTime() / 1000);
                }
            });
        }
    }

    /**
     * Input for number field types
     *
     * @returns {ng.IDirective} Directive definition object
     */
    function dateWidgetDirective() {
        return makeStandardWidgetDDO('date', DateWidgetController);
    }

    /**
     * Input for boolean field types
     *
     * @returns {ng.IDirective} Directive definition object
     */
    function booleanWidgetDirective() {
        return makeStandardWidgetDDO('boolean');
    }

    /**
     * Input for select field types
     *
     * @returns {ng.IDirective} Directive definition object
     */
    function selectWidgetDirective() {
        return makeStandardWidgetDDO('select');
    }

    class NodeWidgetController extends StandardWidgetController {

        constructor(private nodeSelector: NodeSelector) {
            super();
        }

        public showDialog(event: ng.IAngularEvent) {
            var options = {
                allow: this.fieldModel.allow || []
            };
            event.preventDefault();
            this.nodeSelector.open(options)
                .then(nodes => {
                    this.fieldModel.update(this.maskNode(nodes[0]));
                });
        }

        private maskNode(node: INode) {
            return {
                uuid: node.uuid,
                displayField: node.displayField,
                fields: node.fields
            };
        }
    }

    /**
     * Input for node field types
     */
    function nodeWidgetDirective() {
        return makeStandardWidgetDDO('node', NodeWidgetController);
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
                    .then(function (newMicroschemaObject) {
                        scope.model[scope.path].items.push(newMicroschemaObject);
                        scope.formBuilder.modified = true;
                        reHighlight();
                    });
            }

            /**
             * Add a new primitive-type item to the list
             */
            function addItem() {
                var defaultValue = getDefaultValue(scope.listTypeField);
                scope.model[scope.path].items.push(defaultValue);
                scope.formBuilder.modified = true;
                reHighlight();
            }

            /**
             * Remove the item at index from the list
             * @param index
             */
            function removeItem(index) {
                scope.model[scope.path].items.splice(index, 1);
                scope.formBuilder.modified = true;
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
                setTimeout(function () {
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

            microschema.fields.forEach(function (fieldObject) {
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
                defaultValue = {
                    items: []
                };
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

    angular.module('meshAdminUi.projects.formBuilder')
           .directive('mhStringWidget', stringWidgetDirective)
           .directive('mhHtmlWidget', htmlWidgetDirective)
           .directive('mhNumberWidget', numberWidgetDirective)
           .directive('mhBooleanWidget', booleanWidgetDirective)
           .directive('mhDateWidget', dateWidgetDirective)
           .directive('mhSelectWidget', selectWidgetDirective)
           .directive('mhNodeWidget', nodeWidgetDirective)
           .directive('mhListWidget', listWidgetDirective);
}