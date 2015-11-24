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

    declare var Aloha: any;

    /**
     * This is the Aloha Editor implementation.
     */
    function htmlWidgetDirective(i18nService: I18nService,
                                 nodeSelector: NodeSelector,
                                 contextService: ContextService,
                                 dataService: DataService) {

        // an array of functions that will be called when Aloha has loaded.
        let callbacks = [];
        const activeAlohaPlugins = [
            'common/ui',
            'common/format',
            'common/table',
            'common/highlighteditables',
            'mesh/mesh-link'
        ];

        class HtmlWidgetController {

            private fieldModel: INodeFieldModel;
            private htmlField: HTMLElement;
            private isFocused: boolean;
            private lastContent: string;
            private toolbarContainer: HTMLElement;
            private alohaToolbar: HTMLElement;

            constructor(private $scope: ng.IScope,
                        private $element: ng.IAugmentedJQuery,
                        private widgetHighlighterService: WidgetHighlighterService) {

                /**
                 * We need a way to let the widget know when the inner htmlField (content editable div)
                 * is focused. We have no direct access to that information, so we need to set up
                 * event listeners on the native "focus" and "blur" events and use them to update
                 * the scope.
                 */
                this.isFocused = false;
                this.htmlField = <HTMLElement>$element[0].querySelector('.htmlField');
                this.toolbarContainer = <HTMLElement>this.$element[0].querySelector('.toolbar-container');
                this.lastContent = this.fieldModel.value;

                if (Aloha.ready) {
                    this.registerBindings();
                } else {
                    callbacks.push(() => this.registerBindings());
                }

                // initialize the content.
                this.syncView();
            }

            /**
             * Pull out the Aloha toolbar from the top level of the DOM, and put it above the html input area so
             * we can style it to be the correct width.
             */
            private repositionToolbar() {
                this.alohaToolbar = <HTMLElement>document.querySelector('.aloha-ui-toolbar');
                this.alohaToolbar.remove();
                this.toolbarContainer.appendChild(this.alohaToolbar);
            }

            private registerBindings() {
                var $ = Aloha.jQuery;

                /**
                 * View -> Model data binding
                 */
                Aloha.bind('aloha-smart-content-changed', (jQueryEvent, alohaEditable) => {
                    if (this.eventTargetIsThisElement(alohaEditable)) {
                        let currentContent = alohaEditable.editable.getContents();
                        if (currentContent !== this.lastContent) {
                            this.$scope.$apply(() => {
                                this.fieldModel.update(currentContent);
                                this.lastContent = currentContent;
                            });
                        }
                    }
                });

                /**
                 * Model -> data binding
                 */
                this.$scope.$watch(() => this.fieldModel.value, (val) => {
                    if (typeof val !== 'undefined') {
                        this.syncView();
                    }
                });

                Aloha.bind('aloha-editable-activated', (jQueryEvent, alohaEditable) => {
                    if (this.eventTargetIsThisElement(alohaEditable)) {
                        this.repositionToolbar();
                        this.alohaToolbar.classList.remove('hidden');
                        this.$scope.$applyAsync(() => {
                            this.isFocused = true;
                            if (this.toolbarContainer) {
                                this.toolbarContainer.classList.add('open');
                                setTimeout(() => this.widgetHighlighterService.highlight(), 0);
                            }
                        });
                    }
                });

                Aloha.bind('aloha-editable-deactivated', (jQueryEvent, alohaEditable) => {
                    if (this.eventTargetIsThisElement(alohaEditable)) {
                        this.alohaToolbar.classList.add('hidden');
                        this.$scope.$apply(() => {
                            this.isFocused = false;
                            if (this.toolbarContainer) {
                                this.toolbarContainer.classList.remove('open');
                                setTimeout(() => this.widgetHighlighterService.highlight(), 0);
                            }
                        });
                    }
                });

                Aloha.ready(() => {
                    $('.htmlField').aloha();
                });
            }

            private eventTargetIsThisElement(alohaEditable) {
                return this.htmlField.getAttribute('id') === alohaEditable.editable.getId();
            }

            private syncView() {
                this.htmlField.innerHTML = this.fieldModel.value;
            }
        }

        function htmlWidgetCompileFn() {
            if (!window['Aloha']) {
                // configure Aloha editor
                window['Aloha'] = {};
                window['Aloha'].settings = {
                    "sidebar": {
                        "disabled": true
                    },
                    "floatingmenu": {
                        draggable: false
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
                        },
                        "mesh-link": {
                            "selectNodeClick": () => {
                                return nodeSelector.open();
                            },
                            "resolveNodeName": (uuid: string): ng.IPromise<INode> => {
                                return dataService.getNode(contextService.getProject().name, uuid);
                            }
                        }
                    },
                    "i18n": {
                        "current": i18nService.getCurrentLang().code
                    },
                    "locale": i18nService.getCurrentLang().code,
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
                            "components": ["editLink", "removeLink", "selectNode", "selectedNode"]
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

                loadScript('assets/vendor/aloha-editor/lib/aloha-full.js', initAloha);
            }
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
            controller: HtmlWidgetController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                fieldModel: '='
            }
        };
    }

    /**
     * Input for number field types
     */
    function numberWidgetDirective() {
        return makeStandardWidgetDDO('number');
    }

    declare var moment: moment.MomentStatic;


    /**
     * Since the input[type="date"] directive requires a Date object, we need to convert the
     * timestamp into a Date object and bind to that.
     */
    class DateWidgetController {

        public fieldModel: INodeFieldModel;
        public value: Date;
        private valueMoment: moment.Moment;
        public focussed: string = '';
        public time = { h: null, m: null, s: null};


        constructor(private $scope: any, private $element: any) {

            // this flag prevents the update callback from firing as soon as the
            // widget loads and performs a mutation of the value to a Date object.
            let initialDateConversionDone = false;

            if (0 < this.fieldModel.value) {
                this.valueMoment = moment.unix(this.fieldModel.value);
            } else {
                this.valueMoment = moment();
            }
            this.value = this.valueMoment.toDate();
            this.setTimeFields(this.valueMoment);

            $scope.$watch(() => this.value.valueOf(), newVal => {
                if (newVal) {
                    if (initialDateConversionDone){
                        this.valueMoment = moment(newVal);
                        this.fieldModel.update(this.valueMoment.unix());
                        this.setTimeFields(this.valueMoment);
                    } else {
                        initialDateConversionDone = true;
                    }
                }
            });
        }

        private setTimeFields(currentMoment: moment.Moment) {
            this.time = {
                h: currentMoment.format('HH'),
                m: currentMoment.format('mm'),
                s: currentMoment.format('ss')
            };
        }

        public keydown(event: any) {
            var input = <HTMLInputElement>event.target,
                key = {
                    leftArrow: 37,
                    rightArrow: 39,
                    upArrow: 38,
                    downArrow: 40
                },
                char = String.fromCharCode(event.which),
                isNumeric = /[0-9]/.test(char),
                isAlpha = /[a-zA-Z]/.test(char);

            if (isAlpha) {
                event.preventDefault();
                return;
            }

            if (event.which === key.upArrow) {
                this.increment(input);
                event.preventDefault();
            } else if (event.which === key.downArrow) {
                this.decrement(input);
                event.preventDefault();
            }

            if (input.selectionStart === input.value.length && event.which === key.rightArrow) {
                this.focusNext(input);
            }

            if (input.selectionEnd === 0 && event.which === key.leftArrow) {
                this.focusPrev(input);
            }

            if (input.selectionStart === 1) {
                if (input.value.length === 1 && isNumeric) {
                    this.focusNext(input);
                }
            }

        }

        private updateValue(input: HTMLInputElement) {
            let method;
            if (input.classList.contains('hour')) {
                method = "hour";
            } else if (input.classList.contains('minute')) {
                method = "minute";
            } else {
                method = "second";
            }
            this.valueMoment[method](input.value);
            this.value = this.valueMoment.toDate();
        }

        private increment(input: HTMLInputElement) {
            this.valueMoment.add(this.getIncrementAmount(input), 's');
            this.value = this.valueMoment.toDate();
        }

        private decrement(input: HTMLInputElement) {
            this.valueMoment.subtract(this.getIncrementAmount(input), 's');
            this.value = this.valueMoment.toDate();
        }

        private getIncrementAmount(input: HTMLInputElement) {
            var factors = {
                hour: 3600,
                minute: 60,
                second: 1
            };
            return factors[input.classList[0]];
        }

        public focusFirst(event) {
            if (event.target.classList.contains('time-picker')) {
                let input = <HTMLInputElement>this.$element[0].querySelectorAll('.time-picker input')[0];
                input.focus();
            }
        }

        public focus(event, focusTarget) {
            this.$element[0].querySelector('.time-picker').classList.add('focus');
            this.focussed = focusTarget;
            event.preventDefault();
        }

        public blur(event) {
            this.$element[0].querySelector('.time-picker').classList.remove('focus');
            this.updateValue(event.target);
        }

        private focusNext(input) {
            let nextElement = <HTMLInputElement>angular.element(input).next()[0];
            if (nextElement && nextElement.tagName === 'INPUT') {
                setTimeout(() => {
                    nextElement.focus();
                    nextElement.select();
                }, 0);
            }
        }

        private focusPrev(input) {
            function prev(element): HTMLInputElement {
                var elm = element.previousSibling;
                while (elm != null && elm.nodeType !== 1) {
                    elm = elm.previousSibling;
                }
                return elm && elm.tagName === 'INPUT' ? elm : undefined;
            }

            let previousElement = prev(input);
            if (previousElement) {
                setTimeout(() => {
                    previousElement.focus()
                    previousElement.select();
                }, 0);
            }
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

    class NodeWidgetController  {

        public fieldModel: INodeFieldModel;
        public value: any;

        constructor(private nodeSelector: NodeSelector) {
        }

        public showDialog(event: ng.IAngularEvent) {
            //let displayMode = this.fieldModel.value && this.fieldModel.value.hasOwnProperty('binaryProperties') ? 'grid' : 'list';
            // TODO: smarter way of deciding whether to use the grid or list view.
            let displayMode = 'grid';
            var options = {
                displayMode: displayMode,
                allow: this.fieldModel.allow || []
            };
            event.preventDefault();
            this.nodeSelector.open(options)
                .then(nodes => {
                    let newVal = this.maskNode(nodes[0]);
                    this.fieldModel.value = newVal;
                    this.fieldModel.update(newVal);
                });
        }

        private maskNode(node: INode) {
            /* return {
             uuid: node.uuid,
             displayField: node.displayField,
             fields: node.fields
             };*/
            // TODO: figure out the reason for this method, and delete if possible.
            return node;
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
        .directive('mhHtmlWidget', htmlWidgetDirective)
        .directive('mhNumberWidget', numberWidgetDirective)
        .directive('mhBooleanWidget', booleanWidgetDirective)
        .directive('mhDateWidget', dateWidgetDirective)
        .directive('mhSelectWidget', selectWidgetDirective)
        .directive('mhNodeWidget', nodeWidgetDirective)
        .directive('mhListWidget', listWidgetDirective);
}