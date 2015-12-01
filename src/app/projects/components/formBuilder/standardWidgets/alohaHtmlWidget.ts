module meshAdminUi {

    declare var Aloha: any;

    /**
     * This is the Aloha Editor implementation.
     */
    function htmlWidgetDirective(i18nService: I18nService,
                                 nodeSelector: NodeSelector,
                                 editorService: EditorService,
                                 contextService: ContextService,
                                 dataService: DataService) {

        // an array of functions that will be called when Aloha has loaded.
        let callbacks = [];
        const activeAlohaPlugins = [
            'common/ui',
            'common/format',
            'common/table',
            'common/highlighteditables',
            'common/list',
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
                let $ = Aloha.jQuery;
                let $editorPane = $('.editor-pane-container');
                let $toolbarContainer = $('.toolbar-container');

                const positionToolbar = () => {
                    let containerHeight = 95;
                    let $editable: JQuery = $('.aloha-editable');
                    let paneTop = $editorPane[0].getBoundingClientRect().top;

                    $toolbarContainer.css({ width: $editable.width() });

                    if ($editable.offset().top - containerHeight < paneTop) {
                        // float it
                        $toolbarContainer.css({ top: paneTop });
                    } else {
                        $toolbarContainer.css({ top: $editable.offset().top - containerHeight - 1 });
                    }
                };

                Aloha.bind('aloha-editable-activated', (jQueryEvent, alohaEditable) => {
                    positionToolbar();
                    $editorPane.on('scroll', positionToolbar);
                    $(window).on('resize', positionToolbar);

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

                    $editorPane.off('scroll', positionToolbar);
                    $(window).off('resize', positionToolbar);

                    if (this.eventTargetIsThisElement(alohaEditable)) {
                        this.alohaToolbar.classList.add('hidden');
                        this.$scope.$apply(() => {
                            // handle the highlighting of the element
                            this.isFocused = false;
                            if (this.toolbarContainer) {
                                this.toolbarContainer.classList.remove('open');
                                setTimeout(() => this.widgetHighlighterService.highlight(), 0);
                            }
                            /**
                             * View -> Model data binding
                             */
                            let currentContent = alohaEditable.editable.getContents();
                            if (currentContent !== this.lastContent) {
                                this.fieldModel.update(currentContent);
                                this.lastContent = currentContent;
                            }
                        });
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
                        "list": {
                            "templates": {
                                "ul": {
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
                            },
                            "previewNodeClick": (uuid: string) => {
                                editorService.open(uuid);
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
                            "components": ["selectNode", "selectedNode", "editLink", "removeLink"]
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

    angular.module('meshAdminUi.projects.formBuilder')
           .directive('mhHtmlWidget', htmlWidgetDirective);
}