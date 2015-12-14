describe('formBuilder Module', function() {

    var $compile,
        $scope,
        $timeout,
        containingElement;

    beforeEach(module('meshAdminUi'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('meshAdminUi.templates'));

    beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        $scope = $rootScope.$new();
        containingElement = document.createElement('div');
    }));

    function compileElement(fields, schemaFields) {
        var html;
        $scope.fields = fields;
        $scope.schemaFields = schemaFields;
        $scope.perms = ["read", "create", "update", "delete"];
        $scope.state = {
            modified: false
        };
        $scope.onChangeCallback = function() {};

        spyOn($scope, 'onChangeCallback');

        html = '<form-builder fields="fields" ' +
            'schema="schemaFields" ' +
            'display-field="vm.schema.displayField" ' +
            'on-change="onChangeCallback()" ' +
            'perms="perms"></form-builder>';

        angular.element(containingElement).append($compile(html)($scope));
        $scope.$apply();
    }

    describe('common input properties', function() {

        beforeEach(function() {
            var schemaFields = [{
                "name": "myInput",
                "label": "An Input Field",
                "type": "string"
            }];

            var fields = {
                "myInput": "foo"
            };

            compileElement(fields, schemaFields);
        });

        it('should populate with correct value', function() {
            expect(containingElement.querySelector('input[type="text"]').value).toEqual('foo');
        });

        it('should populate with correct label', function() {
            expect(containingElement.querySelector('label').innerHTML).toEqual('An Input Field');
        });

        it('should invoke onChange callback when changed', function() {
            var input = angular.element(containingElement.querySelector('input[type="text"]'));

            expect($scope.onChangeCallback).not.toHaveBeenCalled();
            $scope.$apply(function() {
                input.val('bar');
                input.triggerHandler('change');
            });
            expect($scope.onChangeCallback).toHaveBeenCalled();
        });
    });

    it('should generate a html type field', function() {
        var schemaFields = [{
            "name": "html",
            "label": "HTML Type",
            "type": "html"
        }];

        var fields = {
            "html": "<p>hello</p>"
        };

        compileElement(fields, schemaFields);
        expect(containingElement.querySelector('.htmlField').innerHTML).toEqual('<p>hello</p>');
    });

    it('should generate a number type field', function() {
        var schemaFields = [{
            "name": "number",
            "label": "Number Type",
            "type": "number"
        }];

        var fields = {
            "number": 42
        };

        compileElement(fields, schemaFields);
        expect(containingElement.querySelector('input[type="number"]').value).toEqual('42');
    });

    it('should generate a boolean type field', function() {
        var schemaFields = [{
            "name": "boolean",
            "label": "Boolean Type",
            "type": "boolean"
        }];

        var fields = {
            "boolean": true
        };

        compileElement(fields, schemaFields);
        expect(containingElement.querySelector('md-checkbox').classList).toContain('md-checked');
    });

    it('should generate a date type field', function() {
        var timestamp = 1433336633;
        var schemaFields = [{
            "name": "date",
            "label": "Date Type",
            "type": "date"
        }];

        var fields = {
            "date": timestamp
        };

        compileElement(fields, schemaFields);
        expect(containingElement.querySelector('input[type="date"]').value).toEqual(getDateString(timestamp));

    });

    it('should generate a select type field', function() {
        var schemaFields = [{
            "name": "select",
            "label": "Select Type",
            "type": "select",
            "options": ["foo", "bar", "baz"]
        }];

        var fields = {
            "select": "bar"
        };

        compileElement(fields, schemaFields);
        expect(containingElement.querySelector('md-select').innerHTML).toContain('bar');
    });

    it('should generate a list type field', function() {
        var schemaFields = [{
            "name": "list",
            "label": "List Type",
            "type": "list",
            "listType": "string"
        }];

        var fields = {
            "list": ["do", "re", "mi"]
        };

        compileElement(fields, schemaFields);
        expect(containingElement.querySelectorAll('ul li').length).toEqual(3);
        expect(containingElement.querySelectorAll('ul li')[1].innerHTML).toContain('re');
    });

    describe('list functions', function() {
        var listContainer,
            listController;

        function compileListField(fields, schemaFields) {
            schemaFields = schemaFields || [{
                    "name": "list",
                    "label": "List Type",
                    "type": "list",
                    "listType": "string"
                }];

            fields = fields || {
                    "list": ["do", "re", "mi"]
                };

            compileElement(fields, schemaFields);

            listContainer = containingElement.querySelector('.list-container');
            listController = angular.element(listContainer).scope().vm;
        }

        it('addItem() should add a new item', function() {
            compileListField();
            listController.addItem();

            expect($scope.fields.list.length).toEqual(4);
            expect($scope.fields.list[3]).toEqual('');
        });

        it('removeItem() should remove an item', function() {
            compileListField();
            listController.removeItem(0);

            expect($scope.fields.list).toEqual(['re', 'mi']);
        });

        describe('microschema instance creation with addWidget()', function() {

            var scopeListObject;

            beforeEach(inject(function($q, dataService) {
                // return a mock microschema is dataService.getMicroschema() is called
                spyOn(dataService, "getMicroschemaByName").and.callFake(function() {
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
                                "name": "people",
                                "type": "list",
                                "listType": "string"
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
                var schemaFields = [{
                        "name": "list",
                        "label": "List Type",
                        "type": "list",
                        "listType": "microschema",
                        "allow": ["test"]
                    }],
                    fields = {
                        "list": []
                    };
                compileListField(fields, schemaFields);
                listController.addWidget('test');
                $scope.$apply();
                scopeListObject = $scope.fields.list[0];
            });

            it('should create "microschema" property', function() {
                expect(scopeListObject.microschema.name).toEqual("testMicroschema");
                expect(scopeListObject.microschema.uuid).toEqual("uuid_test_microschema");
            });

            it('should create correct number of fields', function() {
                expect(Object.keys(scopeListObject.fields)).toEqual(['title', 'greeting', 'age', 'volume', 'people', 'date']);
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

            it('should create correct default for list', function() {
                console.log('yolo');
                expect(scopeListObject.fields.people).toEqual([]);
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