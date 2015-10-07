module meshAdminUi {

    declare var Aloha: any;

    class StandardWidgetController {

        public fieldModel: INodeFieldModel;
        public value: any;

        constructor($scope: ng.IScope) {
            $scope.$watch(() => this.fieldModel.value, val => {
                this.value = angular.copy(val);
            });
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
     */
    function stringWidgetDirective() {
        return makeStandardWidgetDDO('string');
    }

    /**
     * Input for html field types
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
     */
    function numberWidgetDirective() {
        return makeStandardWidgetDDO('number');
    }


    /**
     * Since the input[type="date"] directive requires a Date object, we need to convert the
     * timestamp into a Date object and bind to that.
     */
    class DateWidgetController {

        public fieldModel: INodeFieldModel;
        public value: any;

        constructor($scope: ng.IScope) {

            if (0 < this.fieldModel.value) {
                this.value= new Date(this.fieldModel.value * 1000);
            } else {
                this.value = new Date();
            }

            $scope.$watch(() => this.value, newVal => {
                if (newVal && newVal instanceof Date) {
                    this.fieldModel.update(newVal.getTime() / 1000);
                }
            });
        }
    }

    /**
     * Input for number field types
     */
    function dateWidgetDirective() {
        return makeStandardWidgetDDO('date', DateWidgetController);
    }

    /**
     * Input for boolean field types
     */
    function booleanWidgetDirective() {
        return makeStandardWidgetDDO('boolean');
    }

    /**
     * Input for select field types
     */
    function selectWidgetDirective() {
        return makeStandardWidgetDDO('select');
    }

    class NodeWidgetController extends StandardWidgetController {

        constructor($scope: ng.IScope, private nodeSelector: NodeSelector) {
            super($scope);
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


    class ListWidgetController extends StandardWidgetController {


        private dragStartIndex: number;
        private listFieldModels: INodeFieldModel[] = [];

        constructor(private $scope: ng.IScope,
                    private $element: ng.IAugmentedJQuery,
                    private dataService: DataService,
                    private widgetHighlighterService: WidgetHighlighterService,
                    private mu: MeshUtils) {
            super($scope);

            $scope.$watchCollection(() => this.fieldModel.value, list => {
                this.updateListFieldModels(list);
            });
        }

        private updateListFieldModels(list) {
            if (typeof list !== 'undefined') {
                let type = this.fieldModel.listType;

                this.listFieldModels.length = list.length;
                list.forEach((value: any, i: number) => {
                    if (this.listFieldModels[i]) {
                        this.listFieldModels[i].value = value;
                    } else {
                        this.listFieldModels[i] = this.createListItemFieldModel(type, value, i);
                    }
                });
            }
        }

        /**
         * Each item in the list needs its own NodeFieldModel object which can then be passed into the
         * widgetProxy and generate the sub-widgets.
         */
        private createListItemFieldModel(type: string, value: any, index: number): INodeFieldModel {
            let path = angular.copy(this.fieldModel.path),
                model: INodeFieldModel = <INodeFieldModel>{};

            path.push(index);
            model.id = this.mu.generateGuid();
            model.type = type;
            model.value = value;
            model.path = path;
            model.canUpdate = this.fieldModel.canUpdate;
            model.isDisplayField = false;
            model.update = this.fieldModel.updateFnFactory(path);
            return model;
        }

        /**
         * Tracking function to be used in the ng-repeat of the list items. Primitive types should
         * be tracked by $index, whereas microschemas need to be tracked by reference to the
         * object itself in order for sorting to work correctly.
         */
        public tracker(item: INodeFieldModel, $id: Function, $index: number): any {
            return item.id;
        }

        /**
         * Add a new, empty microschema widget to the list.
         */
        public addWidget(microschemaName: string) {
            this.dataService.getMicroschema(microschemaName)
                .then(microschema => this.createEmptyMicroschemaObject(microschema))
                .then(newMicroschemaObject => {
                    this.fieldModel.value.push(newMicroschemaObject);
                    this.fieldModel.update(this.fieldModel.value);
                    this.reHighlight();
                });
        }

        /**
         * Add a new primitive-type item to the list
         */
        public addItem() {
            var defaultValue = this.getDefaultValue(this.fieldModel.type);
            this.fieldModel.value.push(defaultValue);
            this.fieldModel.update(this.fieldModel.value);
            this.reHighlight();
        }

        /**
         * Remove the item at index from the list
         */
        public removeItem(index: number) {
            this.fieldModel.value.splice(index, 1);
            this.fieldModel.update(this.fieldModel.value);
            this.reHighlight();
        }

        /**
         * Record the index of the item that is being dragged.
         */
        public startDrag(index: number) {
            this.dragStartIndex = index;
        }

        /**
         * Remove the original dragged item from the list.
         */
        public endDrag(item: INodeFieldModel, dragEndIndex: number, list: any[]) {
            var indexToSplice;

            if (dragEndIndex < this.dragStartIndex) {
                indexToSplice = this.dragStartIndex + 1;
            } else {
                indexToSplice = this.dragStartIndex;
            }

            list.splice(dragEndIndex, 0, item.value); // add the new position
            list.splice(indexToSplice, 1); // remove the old position
            this.fieldModel.update(this.fieldModel.value);
        }

        /**
         * Re-apply the widget highlighting, since the height of the list
         * would have changed after adding or removing an item. The timeout is there to allow the
         * new dimensions to take effect (i.e. the DOM to update) before re-calculating the highlight height.
         */
        private reHighlight() {
            setTimeout(() => {
                this.widgetHighlighterService.highlight(this.$element.children()[0]);
            }, 500);
        }

        /**
         * Create an empty microschema instance, populated with default values.
         */
        private createEmptyMicroschemaObject(microschema) {
            var newMicroschemaObject = {
                "microschema": {
                    "name": microschema.name,
                    "uuid": microschema.uuid
                },
                "fields": {}
            };

            microschema.fields.forEach(function (fieldObject) {
                newMicroschemaObject.fields[fieldObject.name] = this.getDefaultValue(fieldObject);
            });

            return newMicroschemaObject;
        }

        /**
         * Returns the correct default value for a field definition object.
         */
        private getDefaultValue(fieldObject): any {
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
    }

    /**
     * Input for list field types
     */
    function listWidgetDirective() {
        return makeStandardWidgetDDO('list', ListWidgetController);
    }

    angular.module('meshAdminUi.projects.formBuilder')
        .directive('mhStringWidget', stringWidgetDirective)
        // TODO: update the aloha-based HTML input to work with the new API
        .directive('mhHtmlWidget', stringWidgetDirective)
        .directive('mhNumberWidget', numberWidgetDirective)
        .directive('mhBooleanWidget', booleanWidgetDirective)
        .directive('mhDateWidget', dateWidgetDirective)
        .directive('mhSelectWidget', selectWidgetDirective)
        .directive('mhNodeWidget', nodeWidgetDirective)
        .directive('mhListWidget', listWidgetDirective);
}