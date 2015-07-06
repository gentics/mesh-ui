describe('formBuilder Module', function() {

    var $compile,
        $scope,
        $timeout,
        containingElement;

    beforeEach(module('meshAdminUi.projects.formBuilder'));
    beforeEach(module('meshAdminUi.common'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('meshAdminUi.templates'));

    beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        $scope = $rootScope.$new();
        containingElement = document.createElement('div');
    }));

    function compileElement(fields, model) {
        var html;
        $scope.fields = fields;
        $scope.model = model;
        $scope.perms = ["read", "create", "update", "delete"];
        $scope.state = {
            modified: false
        };

        html = '<form-builder model="model" fields="fields" modified-flag="state.modified" perms="perms"></form-builder>';

        angular.element(containingElement).append($compile(html)($scope));
        $scope.$apply();
    }

    describe('common input properties', function() {

        beforeEach(function() {
            var fields = [{
                "name": "myInput",
                "label": "An Input Field",
                "type": "string"
            }];

            var model = {
                "myInput": "foo"
            };

            compileElement(fields, model);
        });

        it('should populate with correct value', function() {
            expect(containingElement.querySelector('input[type="text"]').value).toEqual('foo');
        });

        it('should populate with correct label', function() {
            expect(containingElement.querySelector('label').innerHTML).toEqual('An Input Field');
        });

        it('should set modified flat when modified', function() {
            var input = angular.element(containingElement.querySelector('input[type="text"]'));

            expect($scope.state.modified).toEqual(false);
            $scope.$apply(function() {
                input.val('bar');
                input.triggerHandler('change');
            });
            expect($scope.state.modified).toEqual(true);
        });
    });

    it('should generate a html type field', function() {
        var fields = [{
            "name": "html",
            "label": "HTML Type",
            "type": "html"
        }];

        var model = {
            "html": "<p>hello</p>"
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('.htmlField').innerHTML).toEqual('<p>hello</p>');
    });

    it('should generate a number type field', function() {
        var fields = [{
            "name": "number",
            "label": "Number Type",
            "type": "number"
        }];

        var model = {
            "number": 42
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('input[type="number"]').value).toEqual('42');
    });

    it('should generate a boolean type field', function() {
        var fields = [{
            "name": "boolean",
            "label": "Boolean Type",
            "type": "boolean"
        }];

        var model = {
            "boolean": true
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('md-checkbox').classList).toContain('md-checked');
    });

    it('should generate a date type field', function() {
        var timestamp = 1433336633;
        var fields = [{
            "name": "date",
            "label": "Date Type",
            "type": "date"
        }];

        var model = {
            "date": timestamp
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('input[type="date"]').value).toEqual(getDateString(timestamp));

    });

    it('should generate a select type field', function() {
        var fields = [{
            "name": "select",
            "label": "Select Type",
            "type": "select",
            "options": ["foo", "bar", "baz"]
        }];

        var model = {
            "select": "bar"
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('md-select').innerHTML).toContain('bar');
    });

    it('should generate a list type field', function() {
        var fields = [{
            "name": "list",
            "label": "List Type",
            "type": "list",
            "listType": "string"
        }];

        var model = {
            "list": { items: ["do", "re", "mi"] }
        };

        compileElement(fields, model);
        expect(containingElement.querySelectorAll('ul li').length).toEqual(3);
        expect(containingElement.querySelectorAll('ul li')[1].innerHTML).toContain('re');
    });

    describe('list functions', function() {
        var listContainer,
            listScope;

        function compileListField(fields, model) {
            fields = fields || [{
                "name": "list",
                "label": "List Type",
                "type": "list",
                "listType": "string"
            }];

            model = model || {
                "list": { items: ["do", "re", "mi"] }
            };

            compileElement(fields, model);

            listContainer = containingElement.querySelector('.list-container'),
                listScope = angular.element(listContainer).scope();
        }

        it('addItem() should add a new item', function() {
            compileListField();
            listScope.addItem();

            expect($scope.model.list.items.length).toEqual(4);
            expect($scope.model.list.items[3]).toEqual('');
        });

        it('removeItem() should remove an item', function() {
            compileListField();
            listScope.removeItem(0);

            expect($scope.model.list.items).toEqual(['re', 'mi']);
        });

        describe('microschema instance creation with addWidget()', function() {

            var scopeListObject;

            beforeEach(inject(function($q, dataService) {
                // return a mock microschema is dataService.getMicroschema() is called
                spyOn(dataService, "getMicroschema").and.callFake(function() {
                    return $q.when({
                        "name": "testMicroschema",
                        "uuid": "uuid_test_microschema",
                        "fields": [
                            {
                                "name": "title",
                                "label": "Title of Thing",
                                "type": "string",
                                "required": true
                            },
                            {
                                "name": "greeting",
                                "label": "Greeting",
                                "type": "string",
                                "defaultValue": "hello"
                            },
                            {
                                "name": "age",
                                "label": "Age",
                                "type": "number",
                                "min": 18
                            },
                            {
                                "name": "volume",
                                "label": "Volume",
                                "type": "number",
                                "min": 0,
                                "max": 100
                            },
                            {
                                "name": "date",
                                "label": "Today's Date",
                                "type": "date"
                            }
                        ]
                    });
                });
            }));
            beforeEach(function() {
                var fields = [{
                        "name": "list",
                        "label": "List Type",
                        "type": "list",
                        "listType": "microschema",
                        "allow": ["test"]
                    }],
                    model = {
                        "list": {
                            "items": []
                        }
                    };
                compileListField(fields, model);
                listScope.addWidget('test');
                $scope.$apply();
                scopeListObject = $scope.model.list.items[0];
            });

            it('should create "microschema" property', function() {
                expect(scopeListObject.microschema.name).toEqual("testMicroschema");
                expect(scopeListObject.microschema.uuid).toEqual("uuid_test_microschema");
            });

            it('should create correct number of fields', function() {
                expect(Object.keys(scopeListObject.fields)).toEqual(['title', 'greeting', 'age', 'volume', 'date']);
            });

            it('should create empty string when no defaultValue set', function() {
                expect(scopeListObject.fields.title).toEqual('');
            });

            it('should create correct default for field with a defaultValue set', function() {
                expect(scopeListObject.fields.greeting).toEqual('hello');
            });

            it('should create correct default for number with range', function() {
                expect(scopeListObject.fields.volume).toEqual(50);
            });

            it('should create correct default for number with only lower bound', function() {
                expect(scopeListObject.fields.age).toEqual(18);
            });

            it('should create correct default for date', function() {
                // divide by 10 to get around imprecision caused by getting Date.now() slightly after the method is called.
                expect(Math.round(scopeListObject.fields.date / 10)).toEqual(Math.round(Date.now() / 10000));
            });
        });
    });


});

// utilities
function getDateString(timeStampInSeconds) {
    var dateObject = new Date(timeStampInSeconds * 1000);
    return pad(dateObject.getFullYear(), 4) + '-' + pad(dateObject.getMonth() + 1, 2) + '-' + pad(dateObject.getDay(), 2);
}

/**
 * http://stackoverflow.com/a/10073788/772859
 * @param n
 * @param width
 * @param z
 * @returns {string}
 */
function pad(n, width, z) {
    z = z || '0';
    n += '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}