module meshAdminUi {

    declare var Aloha: any;
    declare var meshConfig: any;

    /**
     * This is the Aloha Editor implementation.
     */
    function htmlControlDirective(i18nService: I18nService,
                                 nodeSelector: NodeSelector,
                                 editorService: EditorService,
                                 contextService: ContextService,
                                 dataService: DataService) {

        // an array of functions that will be called when Aloha has loaded.
        let callbacks = [];
        let alohaPlugins = [];
        const defaultAlohaPlugins = [
            'common/ui',
            'common/format',
            'common/table',
            'common/highlighteditables',
            'common/list'
        ];
        // we store a reference to the toolbar element as it is re-used by all
        // editable instances in the app, so we only need to get it once.
        let alohaToolbar: HTMLElement;

        if (meshConfig.alohaPlugins && meshConfig.alohaPlugins instanceof Array && 0 < meshConfig.alohaPlugins.length) {
            alohaPlugins = meshConfig.alohaPlugins;
        } else {
            alohaPlugins = defaultAlohaPlugins;
        }
        alohaPlugins.push('mesh/mesh-link');

        class HtmlControlController {

            private fieldModel: INodeFieldModel;
            private htmlField: HTMLElement;
            private isFocused: boolean;
            private lastContent: string;
            private toolbarContainer: HTMLElement;
            private alohaToolbar: HTMLElement;

            static $inject = ['$scope', '$element'];
            constructor(private $scope: ng.IScope,
                        private $element: ng.IAugmentedJQuery) {

                /**
                 * We need a way to let the control know when the inner htmlField (content editable div)
                 * is focused. We have no direct access to that information, so we need to set up
                 * event listeners on the native "focus" and "blur" events and use them to update
                 * the scope.
                 */
                this.isFocused = false;
                this.htmlField = <HTMLElement>$element[0].querySelector('.htmlField');
                this.toolbarContainer = <HTMLElement>this.$element[0].querySelector('.toolbar-container');
                this.lastContent = this.fieldModel.value;

                if (Aloha.ready) {
                    Aloha.ready(() => this.registerBindings());
                } else {
                    callbacks.push(() => this.registerBindings());
                }

                // initialize the content.
                this.syncView();
            }

            /**
             * Convert the path array into a string for use as a unique ID.
             */
            public getPathName(): string {
                return this.fieldModel.path.join('_');
            }

            /**
             * Pull out the Aloha toolbar from the top level of the DOM, and put it above the html input area so
             * we can style it to be the correct width.
             */
            private getAlohaToolbarElement() {
                if (!alohaToolbar) {
                    alohaToolbar = <HTMLElement>document.querySelector('.aloha-ui-toolbar');
                    alohaToolbar.remove();
                }
                this.toolbarContainer.appendChild(alohaToolbar);
            }

            private registerBindings() {
                let $ = Aloha.jQuery;
                let $editorPane = $('.editor-pane-container');
                let $toolbarContainer = $(this.toolbarContainer);

                /**
                 * This function controls how the Aloha toolbar gets positioned. It can be either stuck to the top
                 * edge of the editable area, or if the editable area is long and "goes off the top" of the editorPane,
                 * the Aloha toolbar then floats at the top. If the editable region is totally off the screen, we fade
                 * out the toolbar.
                 */
                const positionToolbarContainer = () => {
                    let containerHeight = 95;
                    let wipTabHeight = 33;
                    let labelHeight = (<HTMLElement>this.htmlField.previousElementSibling).offsetHeight + 1;
                    let $editable: JQuery = $(this.htmlField);
                    let controlOffsetTop = $editable.closest('.html-container')[0].getBoundingClientRect().top;
                    let paneTop = $editorPane[0].getBoundingClientRect().top;
                    let editableBottom = $editable[0].getBoundingClientRect().bottom;

                    let editableIsObscured = $editable.offset().top - containerHeight < paneTop;
                    let editableIsOffScreen = editableBottom < paneTop + containerHeight;

                    $toolbarContainer.css({ width: $editable.width() });

                    if (editableIsOffScreen) {
                        // toolbar is stuck to the bottom of the text area
                        $toolbarContainer.addClass('hidden');
                    } else if (editableIsObscured) {
                        // toolbar is "floating"
                        $toolbarContainer.css({ top: wipTabHeight });
                        $toolbarContainer.removeClass('hidden');
                    } else {
                        // toolbar is stuck to the top of the text area
                        $toolbarContainer.css({ top: controlOffsetTop - paneTop - containerHeight + wipTabHeight + labelHeight });
                        $toolbarContainer.removeClass('hidden');
                    }
                };

                const alohaActivated = (jQueryEvent, alohaEditable) => {
                    if (this.eventTargetIsThisElement(alohaEditable)) {
                        this.getAlohaToolbarElement();
                        positionToolbarContainer();
                        $editorPane.on('scroll', positionToolbarContainer);
                        $(window).on('resize', positionToolbarContainer);
                        alohaToolbar.classList.remove('hidden');
                        this.$scope.$applyAsync(() => {
                            this.isFocused = true;
                            if (this.toolbarContainer) {
                                this.toolbarContainer.classList.add('open');
                            }
                        });
                    }
                };

                const alohaDeactivated = (jQueryEvent, alohaEditable) => {
                    if (alohaEditable !== undefined && this.eventTargetIsThisElement(alohaEditable)) {
                        $editorPane.off('scroll', positionToolbarContainer);
                        $(window).off('resize', positionToolbarContainer);
                        alohaToolbar.classList.add('hidden');
                        alohaToolbar.remove();
                        this.$scope.$apply(() => {
                            // handle the highlighting of the element
                            this.isFocused = false;
                            if (this.toolbarContainer) {
                                this.toolbarContainer.classList.remove('open');
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
                };

                $(this.htmlField).aloha();
                $(Aloha).bind('aloha-editable-activated', alohaActivated);
                $(Aloha).bind('aloha-editable-deactivated', alohaDeactivated);

                /**
                 * Model -> data binding
                 */
                this.$scope.$watch(() => this.fieldModel.value, (val) => {
                    if (typeof val !== 'undefined') {
                        this.syncView();
                    }
                });

                this.$scope.$on('$destroy', () => {
                    $(Aloha).unbind('aloha-editable-activated', alohaActivated);
                    $(Aloha).unbind('aloha-editable-deactivated', alohaDeactivated);
                    $(this.htmlField).mahalo();
                });
            }

            private eventTargetIsThisElement(alohaEditable): boolean {
                return this.htmlField.getAttribute('id') === alohaEditable.editable.getId();
            }

            private syncView() {
                if (this.fieldModel.value) {
                    this.htmlField.innerHTML = this.fieldModel.value;
                }
            }
        }

        function htmlControlCompileFn() {
            if (!window['Aloha']) {
                let activeSettings;
                const defaultAlohaSettings = {
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
                        }
                    },
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

                const requiredAlohaSettings= {
                    "sidebar": {
                        "disabled": true
                    },
                    "floatingmenu": {
                        draggable: false
                    },
                    "plugins" : {
                        "mesh-link": {
                            "selectNodeClick": () => {
                                return nodeSelector.open();
                            },
                            "resolveNodeName": (uuid: string): ng.IPromise<INode> => {
                                return dataService.getNode(contextService.getProject().name, uuid);
                            },
                            "previewNodeClick": (uuid: string) => {
                                editorService.open(uuid);
                            },
                            "getLanguageCode": () => i18nService.getCurrentLang().code
                        }
                    },
                    "i18n": {
                        "current": 'en'
                    },
                    "locale": 'en'
                };


                if (meshConfig.alohaSettings && 0 < Object.keys(meshConfig.alohaSettings).length) {
                    activeSettings = angular.merge({}, meshConfig.alohaSettings, requiredAlohaSettings);
                } else {
                    activeSettings = angular.merge({}, defaultAlohaSettings, requiredAlohaSettings);
                }
                // configure Aloha editor
                window['Aloha'] = {};
                window['Aloha'].settings = activeSettings;

                loadScript('assets/vendor/aloha-editor/lib/aloha-full.js', initAloha);
            }

            // satisfy the TypeScript compiler.
            return {};
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
            s.setAttribute('data-aloha-plugins', alohaPlugins.join(','));
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
            compile: htmlControlCompileFn,
            templateUrl: 'projects/components/formBuilder/standardControls/htmlControl.html',
            controller: HtmlControlController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                fieldModel: '='
            }
        };
    }

    angular.module('meshAdminUi.projects.formBuilder')
        .directive('mhHtmlControl', htmlControlDirective);
}